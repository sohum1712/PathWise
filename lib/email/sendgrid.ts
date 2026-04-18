import sgMail from '@sendgrid/mail'
import { createClient } from '@/lib/supabase/server'

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}

export interface NotificationEmailData extends EmailData {
  studentId?: string
  institutionId?: string
  type: string
}

/**
 * Send a generic email
 */
export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn(
        '[v0] SendGrid API key not configured. Email would have been sent to:',
        data.to
      )
      return false
    }

    const msg = {
      to: data.to,
      from: data.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@PathWise.com',
      subject: data.subject,
      html: data.html,
      text: data.text || data.html.replace(/<[^>]*>/g, ''),
    }

    await sgMail.send(msg)
    console.log(`[v0] Email sent to ${data.to}`)
    return true
  } catch (error) {
    console.error('[v0] Error sending email:', error)
    return false
  }
}

/**
 * Send welcome email to new student
 */
export async function sendStudentWelcomeEmail(studentId: string, email: string, name: string): Promise<boolean> {
  const subject = 'Welcome to PathWise - Your Education Financing Journey Starts Here'
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1E40AF 0%, #0F766E 100%); color: white; padding: 40px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to PathWise!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Your gateway to education financing</p>
      </div>
      
      <div style="padding: 40px 20px; color: #333;">
        <p>Hi ${name},</p>
        
        <p>We're excited to have you on PathWise! We're here to help you discover the right institution and financing options for your education.</p>
        
        <h2 style="color: #1E40AF; font-size: 20px;">Here's what you can do:</h2>
        <ul style="font-size: 14px; line-height: 1.8;">
          <li><strong>Discover Institutions</strong> - Browse colleges, universities, and their programs</li>
          <li><strong>Explore Financing</strong> - Find loans and financing products suited for you</li>
          <li><strong>Calculate EMI</strong> - Plan your finances with our EMI calculator</li>
          <li><strong>Track Applications</strong> - Monitor your financing applications in real-time</li>
        </ul>
        
        <div style="background: #f0f9ff; border-left: 4px solid #1E40AF; padding: 20px; margin: 30px 0;">
          <p style="margin: 0; font-weight: bold; color: #1E40AF;">Next Steps:</p>
          <p style="margin: 10px 0 0 0;">Complete your profile to get personalized institution and financing recommendations.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://PathWise.com'}/student/profile" 
             style="background: #1E40AF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Complete Your Profile
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 40px;">
          Questions? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://PathWise.com'}/help" style="color: #1E40AF;">help center</a> or contact support@PathWise.com
        </p>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">© 2024 PathWise. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">This is an automated email. Please do not reply to this address.</p>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject,
    html,
  })
}

/**
 * Send financing application submitted notification
 */
export async function sendFinancingApplicationEmail(
  studentEmail: string,
  studentName: string,
  applicationId: string,
  loanAmount: number,
  institutionName: string
): Promise<boolean> {
  const subject = 'Your Financing Application Has Been Submitted'
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1E40AF 0%, #0F766E 100%); color: white; padding: 40px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">✓ Application Submitted</h1>
      </div>
      
      <div style="padding: 40px 20px; color: #333;">
        <p>Hi ${studentName},</p>
        
        <p>Great news! Your financing application has been successfully submitted.</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Application Details:</strong></p>
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="padding: 5px 0;"><strong>Application ID:</strong></td>
              <td style="padding: 5px 0; text-align: right;">${applicationId.slice(0, 8)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;"><strong>Loan Amount:</strong></td>
              <td style="padding: 5px 0; text-align: right;">₹${loanAmount.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;"><strong>Institution:</strong></td>
              <td style="padding: 5px 0; text-align: right;">${institutionName}</td>
            </tr>
          </table>
        </div>
        
        <h3 style="color: #1E40AF;">What Happens Next?</h3>
        <ol style="font-size: 14px; line-height: 1.8;">
          <li><strong>Document Verification (1-2 days)</strong> - We'll verify your submitted documents</li>
          <li><strong>Income Assessment (2-3 days)</strong> - Our team will assess your repayment capacity</li>
          <li><strong>Lender Review (3-5 days)</strong> - The lender will review your application</li>
          <li><strong>Decision (1-2 days)</strong> - You'll receive an approval or request for additional documents</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://PathWise.com'}/student/financing?appId=${applicationId}" 
             style="background: #1E40AF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Track Your Application
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 40px;">
          If you have any questions about your application, please contact us at support@PathWise.com or call our support team.
        </p>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">© 2024 PathWise. All rights reserved.</p>
      </div>
    </div>
  `

  return sendEmail({
    to: studentEmail,
    subject,
    html,
  })
}

/**
 * Send financing application approval email
 */
export async function sendFinancingApprovalEmail(
  studentEmail: string,
  studentName: string,
  loanAmount: number,
  interestRate: number,
  monthlyEMI: number,
  tenure: number
): Promise<boolean> {
  const subject = '✓ Your Financing Application Has Been Approved!'
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #059669 0%, #0F766E 100%); color: white; padding: 40px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🎉 Approved!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Your financing has been approved</p>
      </div>
      
      <div style="padding: 40px 20px; color: #333;">
        <p>Hi ${studentName},</p>
        
        <p>Congratulations! Your financing application has been approved. You're all set to pursue your education.</p>
        
        <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Approval Details:</strong></p>
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0;"><strong>Approved Amount:</strong></td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #059669;">₹${loanAmount.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Interest Rate:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${interestRate}% p.a.</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Monthly EMI:</strong></td>
              <td style="padding: 8px 0; text-align: right;">₹${monthlyEMI.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Tenure:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${tenure} months</td>
            </tr>
          </table>
        </div>
        
        <h3 style="color: #1E40AF;">Next Steps:</h3>
        <ol style="font-size: 14px; line-height: 1.8;">
          <li>Review the loan agreement and terms</li>
          <li>Submit any final documents if requested</li>
          <li>Sign the loan agreement online</li>
          <li>Funds will be disbursed within 48 hours of signing</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://PathWise.com'}/student/financing" 
             style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Loan Agreement
          </a>
        </div>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">© 2024 PathWise. All rights reserved.</p>
      </div>
    </div>
  `

  return sendEmail({
    to: studentEmail,
    subject,
    html,
  })
}

/**
 * Send payment reminder email
 */
export async function sendPaymentReminderEmail(
  studentEmail: string,
  studentName: string,
  dueAmount: number,
  dueDate: string,
  institutionName: string
): Promise<boolean> {
  const subject = '💡 Payment Reminder - Fee Due Soon'
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #fff3cd; border-bottom: 4px solid #ffc107; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 16px; color: #856404;"><strong>Payment Reminder</strong></p>
      </div>
      
      <div style="padding: 40px 20px; color: #333;">
        <p>Hi ${studentName},</p>
        
        <p>This is a friendly reminder that your fee payment is due soon.</p>
        
        <div style="background: #fffbea; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0;"><strong>Amount Due:</strong></td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">₹${dueAmount.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Due Date:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${new Date(dueDate).toLocaleDateString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Institution:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${institutionName}</td>
            </tr>
          </table>
        </div>
        
        <p>Please make the payment before the due date to avoid late fees.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://PathWise.com'}/student/payments" 
             style="background: #1E40AF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Make Payment Now
          </a>
        </div>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">© 2024 PathWise. All rights reserved.</p>
      </div>
    </div>
  `

  return sendEmail({
    to: studentEmail,
    subject,
    html,
  })
}

/**
 * Send institution notification email
 */
export async function sendInstitutionNotificationEmail(
  recipientEmail: string,
  recipientName: string,
  subject: string,
  message: string,
  institutionName: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1E40AF 0%, #0F766E 100%); color: white; padding: 40px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">${subject}</h1>
        <p style="margin: 10px 0 0 0; font-size: 14px;">From ${institutionName}</p>
      </div>
      
      <div style="padding: 40px 20px; color: #333;">
        <p>Hi ${recipientName},</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 6px; border-left: 4px solid #1E40AF; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; line-height: 1.6;">${message}</p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Questions? Log in to your PathWise account to view more details or contact the institution directly.
        </p>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">© 2024 PathWise. All rights reserved.</p>
      </div>
    </div>
  `

  return sendEmail({
    to: recipientEmail,
    subject,
    html,
  })
}

/**
 * Log email activity in database
 */
export async function logEmailActivity(
  data: NotificationEmailData & { status: 'sent' | 'failed' | 'pending' }
): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.from('email_logs').insert({
      recipient_email: data.to,
      subject: data.subject,
      email_type: data.type,
      student_id: data.studentId,
      institution_id: data.institutionId,
      status: data.status,
      sent_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Error logging email activity:', error)
  }
}
