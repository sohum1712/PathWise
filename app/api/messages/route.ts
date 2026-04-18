import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  ApiError,
  UnauthorizedError,
  ValidationError,
  parsePaginationParams,
} from '@/lib/api/api-response'

/**
 * GET /api/messages
 * Get user's messages (sent and received)
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
    const type = (searchParams.type as string) || 'all' // 'all', 'sent', 'received'

    let query = supabase
      .from('messages')
      .select('*', { count: 'exact' })

    if (type === 'sent') {
      query = query.eq('sender_id', user.id)
    } else if (type === 'received') {
      query = query.eq('recipient_id', user.id)
    } else {
      // all messages
      query = query.or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    }

    // Get total count
    const { count } = await query.head()

    // Get paginated data
    const { data: messages, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(
      paginatedResponse(messages || [], count || 0, page, limit)
    )
  } catch (error) {
    console.error('[v0] GET /api/messages error:', error)

    if (error instanceof ApiError) {
      return NextResponse.json(
        errorResponse(error.code, error.message, error.details),
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Failed to fetch messages'),
      { status: 500 }
    )
  }
}

/**
 * POST /api/messages
 * Send a new message
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new UnauthorizedError('Authentication required')
    }

    const body = await request.json()

    // Validate required fields
    if (!body.recipientId || !body.content) {
      throw new ValidationError('Message validation failed', {
        recipientId: !body.recipientId ? ['Recipient ID is required'] : undefined,
        content: !body.content ? ['Message content is required'] : undefined,
      })
    }

    if (body.content.length > 5000) {
      throw new ValidationError('Message is too long', {
        content: ['Message must be less than 5000 characters'],
      })
    }

    // Create message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id: body.recipientId,
        subject: body.subject,
        content: body.content,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Send notification to recipient
    await supabase
      .from('notifications')
      .insert({
        recipient_id: body.recipientId,
        title: 'New Message',
        message: `You have a new message from a user`,
        type: 'info',
        link: `/messages?conversation=${user.id}`,
      })

    return NextResponse.json(successResponse(message), { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/messages error:', error)

    if (error instanceof ApiError) {
      return NextResponse.json(
        errorResponse(error.code, error.message, error.details),
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Failed to send message'),
      { status: 500 }
    )
  }
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(
  supabase: any,
  messageId: string,
  userId: string
) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .update({
        is_read: true,
      })
      .eq('id', messageId)
      .eq('recipient_id', userId)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error marking message as read:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[v0] Error marking message as read:', error)
    return null
  }
}
