import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyRazorpayPayment } from '@/app/api/payments/route'
import { errorResponse, successResponse } from '@/lib/api/api-response'

/**
 * POST /api/webhooks/razorpay
 * Handle Razorpay payment webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json(
        errorResponse('INVALID_SIGNATURE', 'Missing signature'),
        { status: 400 }
      )
    }

    const event = body.event
    const payload = body.payload

    console.log('[v0] Razorpay webhook received:', event)

    // Handle payment authorized event
    if (event === 'payment.authorized') {
      const razorpayOrderId = payload.payment.entity.order_id
      const razorpayPaymentId = payload.payment.entity.id

      // Verify payment signature
      const isValid = await verifyRazorpayPayment(
        razorpayOrderId,
        razorpayPaymentId,
        signature
      )

      if (!isValid) {
        return NextResponse.json(
          errorResponse('INVALID_SIGNATURE', 'Signature verification failed'),
          { status: 401 }
        )
      }

      const supabase = await createClient()

      // Update payment record
      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          razorpay_payment_id: razorpayPaymentId,
          status: 'completed',
          transaction_date: new Date().toISOString(),
        })
        .eq('razorpay_order_id', razorpayOrderId)

      if (updateError) {
        console.error('[v0] Error updating payment:', updateError)
        return NextResponse.json(
          errorResponse('DATABASE_ERROR', 'Failed to update payment'),
          { status: 500 }
        )
      }

      // Create notification for student
      const { data: payment } = await supabase
        .from('payment_transactions')
        .select('student_id')
        .eq('razorpay_order_id', razorpayOrderId)
        .single()

      if (payment) {
        await supabase.from('notifications').insert({
          recipient_id: payment.student_id,
          title: 'Payment Successful',
          message: 'Your payment has been processed successfully',
          type: 'success',
        })

        // Log engagement
        await supabase.from('student_engagement_log').insert({
          student_id: payment.student_id,
          action_type: 'payment_completed',
          resource_type: 'payment',
        })
      }

      return NextResponse.json(successResponse({ event_processed: true }))
    }

    // Handle payment failed event
    if (event === 'payment.failed') {
      const razorpayOrderId = payload.payment.entity.order_id
      const failureReason = payload.payment.entity.error_description

      const supabase = await createClient()

      // Update payment record
      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
        })
        .eq('razorpay_order_id', razorpayOrderId)

      if (!updateError) {
        // Create notification for student
        const { data: payment } = await supabase
          .from('payment_transactions')
          .select('student_id')
          .eq('razorpay_order_id', razorpayOrderId)
          .single()

        if (payment) {
          await supabase.from('notifications').insert({
            recipient_id: payment.student_id,
            title: 'Payment Failed',
            message: `Your payment failed: ${failureReason}. Please try again.`,
            type: 'error',
          })
        }
      }

      return NextResponse.json(successResponse({ event_processed: true }))
    }

    return NextResponse.json(
      successResponse({ event_processed: true, message: `Event ${event} received` })
    )
  } catch (error) {
    console.error('[v0] Webhook error:', error)

    return NextResponse.json(
      errorResponse('WEBHOOK_ERROR', 'Failed to process webhook'),
      { status: 500 }
    )
  }
}
