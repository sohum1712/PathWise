import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  ApiError,
  UnauthorizedError,
  parsePaginationParams,
} from '@/lib/api/api-response'

/**
 * GET /api/notifications
 * Get current user's notifications
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new UnauthorizedError('Authentication required')
    }

    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const { page, limit, offset } = parsePaginationParams(searchParams)
    const unreadOnly = searchParams.unread === 'true'

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('recipient_id', user.id)

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    // Get total count
    const { count } = await query.head()

    // Get paginated data
    const { data: notifications, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(
      paginatedResponse(notifications || [], count || 0, page, limit)
    )
  } catch (error) {
    console.error('[v0] GET /api/notifications error:', error)

    if (error instanceof ApiError) {
      return NextResponse.json(
        errorResponse(error.code, error.message, error.details),
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Failed to fetch notifications'),
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/notifications/[id]
 * Mark notification as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new UnauthorizedError('Authentication required')
    }

    const { searchParams } = request.nextUrl
    const notificationId = searchParams.get('id')

    if (!notificationId) {
      return NextResponse.json(
        errorResponse('INVALID_REQUEST', 'Notification ID is required'),
        { status: 400 }
      )
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId)
      .eq('recipient_id', user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    if (!notification) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Notification not found'),
        { status: 404 }
      )
    }

    return NextResponse.json(successResponse(notification))
  } catch (error) {
    console.error('[v0] PATCH /api/notifications error:', error)

    if (error instanceof ApiError) {
      return NextResponse.json(
        errorResponse(error.code, error.message, error.details),
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Failed to update notification'),
      { status: 500 }
    )
  }
}

/**
 * Utility function to send notification to user
 * Can be called from other API routes
 */
export async function sendNotification(
  supabase: any,
  recipientId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  link?: string
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        recipient_id: recipientId,
        title,
        message,
        type,
        link,
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error sending notification:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[v0] Error sending notification:', error)
    return null
  }
}

/**
 * Mark all notifications as read for user
 */
export async function markAllNotificationsAsRead(
  supabase: any,
  userId: string
) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('recipient_id', userId)
      .eq('is_read', false)

    if (error) {
      console.error('[v0] Error marking all notifications as read:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[v0] Error marking all notifications as read:', error)
    return false
  }
}
