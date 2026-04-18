import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  ApiError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  parsePaginationParams,
} from '@/lib/api/api-response'
import { validatePaymentCreation } from '@/lib/api/validators'

/**
 * GET /api/payments
 * Get current user's payment history
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

    // Get total count
    const { count } = await supabase
      .from('payment_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', user.id)

    // Get paginated data
    const { data: transactions, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('student_id', user.id)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(
      paginatedResponse(transactions || [], count || 0, page, limit)
    )
  } catch (error) {
    console.error('[v0] GET /api/payments error:', error)

    if (error instanceof ApiError) {
      return NextResponse.json(
        errorResponse(error.code, error.message, error.details),
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Failed to fetch payments'),
      { status: 500 }
    )
  }
}

/**
 * POST /api/payments
 * Create a new payment/order
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
    validatePaymentCreation(body)

    // Verify student exists
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id, first_name, last_name, email, phone')
      .eq('id', user.id)
      .single()

    if (studentError || !student) {
      throw new NotFoundError('Student profile')
    }

    // Create payment record
    const { data: payment, error } = await supabase
      .from('payment_transactions')
      .insert({
        student_id: user.id,
        amount: body.amount,
        currency: body.currency || 'INR',
        payment_for_id: body.paymentForId,
        description: body.description,
        payment_method: body.paymentMethod || 'online',
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Initialize Razorpay payment if using online method
    if (body.paymentMethod === 'online' || !body.paymentMethod) {
      // Call Razorpay API to create order
      const razorpayOrder = await createRazorpayOrder(
        body.amount,
        student,
        payment.id
      )

      if (razorpayOrder) {
        // Update payment with Razorpay order ID
        await supabase
          .from('payment_transactions')
          .update({ razorpay_order_id: razorpayOrder.id })
          .eq('id', payment.id)

        return NextResponse.json(
          successResponse({
            ...payment,
            razorpay_order_id: razorpayOrder.id,
            razorpay_key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          }),
          { status: 201 }
        )
      }
    }

    // Log engagement
    await supabase.from('student_engagement_log').insert({
      student_id: user.id,
      action_type: 'initiate_payment',
      resource_type: 'payment',
      resource_id: payment.id,
    })

    return NextResponse.json(successResponse(payment), { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/payments error:', error)

    if (error instanceof ApiError) {
      return NextResponse.json(
        errorResponse(error.code, error.message, error.details),
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Failed to create payment'),
      { status: 500 }
    )
  }
}

/**
 * Create Razorpay order
 * This is a helper function that calls Razorpay API
 */
async function createRazorpayOrder(
  amount: number,
  student: any,
  paymentId: string
) {
  try {
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.warn('[v0] Razorpay credentials not configured')
      return null
    }

    const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString(
      'base64'
    )

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: paymentId,
        customer_notify: 1,
        notes: {
          student_id: student.id,
          student_name: `${student.first_name} ${student.last_name}`,
          student_email: student.email,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Razorpay API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Razorpay order creation error:', error)
    return null
  }
}

/**
 * Verify Razorpay payment
 * This should be called from webhook or client callback
 */
export async function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<boolean> {
  try {
    const crypto = await import('crypto')
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keySecret) {
      throw new Error('Razorpay key secret not configured')
    }

    const shasum = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex')

    return shasum === razorpaySignature
  } catch (error) {
    console.error('[v0] Payment verification error:', error)
    return false
  }
}
