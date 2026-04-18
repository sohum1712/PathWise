import { NextRequest, NextResponse } from 'next/server'
import {
  sendStudentWelcomeEmail,
  sendFinancingApplicationEmail,
  sendFinancingApprovalEmail,
  sendPaymentReminderEmail,
  sendInstitutionNotificationEmail,
  logEmailActivity,
} from '@/lib/email/sendgrid'
import { createClient } from '@/lib/supabase/server'

export interface SendEmailRequest {
  type: 'welcome' | 'application_submitted' | 'approval' | 'payment_reminder' | 'institution_notification'
  studentId?: string
  institutionId?: string
  email: string
  name: string
  data?: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: SendEmailRequest = await request.json()

    let success = false
    let messageId: string | null = null

    try {
      switch (body.type) {
        case 'welcome':
          success = await sendStudentWelcomeEmail(body.studentId || user.id, body.email, body.name)
          break

        case 'application_submitted':
          if (!body.data?.applicationId || !body.data?.loanAmount || !body.data?.institutionName) {
            return NextResponse.json(
              { error: 'Missing required fields for application_submitted email' },
              { status: 400 }
            )
          }
          success = await sendFinancingApplicationEmail(
            body.email,
            body.name,
            body.data.applicationId,
            body.data.loanAmount,
            body.data.institutionName
          )
          break

        case 'approval':
          if (
            !body.data?.loanAmount ||
            !body.data?.interestRate ||
            !body.data?.monthlyEMI ||
            !body.data?.tenure
          ) {
            return NextResponse.json(
              { error: 'Missing required fields for approval email' },
              { status: 400 }
            )
          }
          success = await sendFinancingApprovalEmail(
            body.email,
            body.name,
            body.data.loanAmount,
            body.data.interestRate,
            body.data.monthlyEMI,
            body.data.tenure
          )
          break

        case 'payment_reminder':
          if (!body.data?.dueAmount || !body.data?.dueDate || !body.data?.institutionName) {
            return NextResponse.json(
              { error: 'Missing required fields for payment_reminder email' },
              { status: 400 }
            )
          }
          success = await sendPaymentReminderEmail(
            body.email,
            body.name,
            body.data.dueAmount,
            body.data.dueDate,
            body.data.institutionName
          )
          break

        case 'institution_notification':
          if (!body.data?.subject || !body.data?.message || !body.data?.institutionName) {
            return NextResponse.json(
              { error: 'Missing required fields for institution_notification email' },
              { status: 400 }
            )
          }
          success = await sendInstitutionNotificationEmail(
            body.email,
            body.name,
            body.data.subject,
            body.data.message,
            body.data.institutionName
          )
          break

        default:
          return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
      }

      // Log email activity
      if (body.type && body.email) {
        await logEmailActivity({
          to: body.email,
          subject: body.data?.subject || `${body.type} notification`,
          html: '',
          type: body.type,
          studentId: body.studentId,
          institutionId: body.institutionId,
          status: success ? 'sent' : 'failed',
        })
      }

      return NextResponse.json({
        success,
        message: success ? 'Email sent successfully' : 'Email sending failed',
        type: body.type,
      })
    } catch (innerError) {
      console.error('[v0] Error in email handler:', innerError)
      throw innerError
    }
  } catch (error) {
    console.error('[v0] Email API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to list recent email logs (for debugging)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify admin access
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin/institution
    const { data: admin } = await supabase
      .from('institution_admins')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get email logs
    const { data: logs } = await supabase
      .from('email_logs')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(50)

    return NextResponse.json({
      success: true,
      data: logs,
      count: logs?.length || 0,
    })
  } catch (error) {
    console.error('[v0] Email logs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email logs' },
      { status: 500 }
    )
  }
}
