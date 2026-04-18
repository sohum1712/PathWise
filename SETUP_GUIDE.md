# StudyHub - Unified Student Engagement Ecosystem Setup Guide

## Overview
StudyHub is a full-stack platform connecting students, institutions, and lenders in a unified education financing and engagement ecosystem. This guide walks you through the complete setup process.

## Prerequisites
- Node.js 18+ and pnpm
- Supabase account (www.supabase.com)
- Razorpay account (www.razorpay.com) - for payment processing
- Vercel account (optional, for deployment)

## 1. Environment Setup

### Clone and Install Dependencies
```bash
cd /vercel/share/v0-project
pnpm install
```

### Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (from Settings → API)
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` - From Razorpay dashboard

## 2. Database Setup

### Create Tables and Policies

Run the SQL migration scripts in Supabase SQL Editor:

1. **First, create the base schema:**
```bash
# Copy and paste contents of /scripts/001_create_schema.sql
# into Supabase SQL Editor and execute
```

2. **Add enrollment and notifications tables:**
```bash
# Copy and paste contents of /scripts/004_add_enrollment.sql
# into Supabase SQL Editor and execute
```

3. **Setup Row Level Security policies:**
```bash
# Copy and paste contents of /scripts/003_rls_policies.sql
# into Supabase SQL Editor and execute
```

### Database Tables Summary

**Core Tables:**
- `students` - Student profiles and enrollment data
- `institutions` - College/University information
- `institution_admins` - Admin users for institutions
- `programs` - Degree programs offered
- `fee_structures` - Per-year fee breakdowns

**Financing:**
- `financing_products` - Loan products from lenders
- `financing_applications` - Student financing requests
- `financing_approvals` - Approval records

**Payments:**
- `payment_transactions` - Payment history
- `payment_plans` - Installment plans
- `payment_installments` - Individual installments

**Communication:**
- `notifications` - In-app notifications
- `messages` - User-to-user messages
- `student_documents` - Document uploads

**Engagement:**
- `student_engagement_log` - Activity tracking
- `parent_guardians` - Parent/guardian information

## 3. Authentication Setup

### Enable Email Authentication in Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Email provider
3. Configure email templates (optional but recommended)

### User Roles and Metadata

The system supports two main roles (set via `user.user_metadata.role`):

- `student` - Regular students
- `institution_admin` - Institution administrators

Users are automatically assigned roles during signup based on selection.

## 4. Payment Integration (Razorpay)

### Configure Razorpay

1. Go to Razorpay Dashboard → Settings → API Keys
2. Copy Key ID and Key Secret
3. Add to `.env.local`:
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
```

### Webhook Configuration

1. In Razorpay Dashboard → Settings → Webhooks
2. Add webhook endpoint: `https://yourdomain.com/api/webhooks/razorpay`
3. Subscribe to events:
   - `payment.authorized`
   - `payment.failed`

## 5. Running the Application

### Development Server
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for Production
```bash
pnpm build
pnpm start
```

## 6. Key Features

### For Students

**Dashboard:**
- View enrolled programs
- Track financing status
- Check payment schedule
- View notifications

**Fee Discovery:**
- Browse institutions
- Compare program fees
- Filter by location, type, fees

**EMI Calculator:**
- Calculate monthly payments
- Compare financing options
- Affordability analysis

**Financing:**
- Apply for education loans
- Track applications
- Download approval letters

**Payments:**
- Pay fees online via Razorpay
- View payment history
- Download receipts

### For Institutions

**CRM Dashboard:**
- View student pipeline
- Track applications
- Manage enrollments
- Send communications

**Program Management:**
- Create/edit programs
- Set eligibility criteria
- Configure fees per year

**Fee Management:**
- Configure fee structures
- Track collections
- Generate reports

**Analytics:**
- Enrollment trends
- Fee collection status
- Application conversion rates
- Student engagement metrics

## 7. API Endpoints

### Students API
- `GET /api/students` - Get current student profile
- `PUT /api/students` - Update profile
- `GET /api/institutions` - List institutions
- `GET /api/programs` - List programs

### Financing API
- `GET /api/financing/applications` - List applications
- `POST /api/financing/applications` - Create application

### Payments API
- `GET /api/payments` - Payment history
- `POST /api/payments` - Create payment/order

### Notifications API
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications?id=X` - Mark as read

### Messages API
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message

## 8. Security Considerations

### Row Level Security (RLS)
- All tables have RLS enabled
- Students can only view/edit their own data
- Institution admins can manage their institution
- Public data (institutions, programs) is readable by all

### Authentication
- Email/password authentication via Supabase
- JWT tokens stored securely
- Middleware validates authentication on protected routes

### Payment Security
- Razorpay handles PCI compliance
- Server-side signature verification
- Order IDs tied to database records

### Data Protection
- Sensitive fields encrypted at rest
- HTTPS required in production
- Environment variables for secrets

## 9. Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

### Environment Variables on Vercel

Add all environment variables from `.env.local` to Vercel project settings:
- Project Settings → Environment Variables
- Add each variable from `.env.example`

## 10. Troubleshooting

### Authentication Issues
- Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Verify email authentication is enabled in Supabase
- Check redirect URLs match `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

### Database Errors
- Ensure all SQL scripts are executed in correct order
- Check RLS policies are enabled
- Verify foreign key relationships

### Payment Issues
- Confirm Razorpay credentials are correct
- Check webhook endpoint is accessible
- Verify webhook is registered in Razorpay dashboard

### Profile Creation Not Working
- Check student/institution admin tables exist
- Verify triggers are created (if using auto-creation)
- Check RLS policies allow insertion

## 11. Next Steps

1. **Seed Data** - Add sample institutions, programs, and financing products
2. **Branding** - Customize colors, logos, and content
3. **Email Templates** - Setup Supabase email templates
4. **SMS Integration** - Optional: Add Twilio for SMS notifications
5. **Analytics** - Optional: Add PostHog or Sentry for monitoring
6. **Testing** - Run comprehensive tests before production

## 12. Support & Documentation

- **Supabase Docs**: https://supabase.com/docs
- **Razorpay Docs**: https://razorpay.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **API Documentation**: See inline comments in `/app/api/**` routes

## 13. Database Backup & Migration

### Backup
```bash
pg_dump postgresql://user:pass@host/dbname > backup.sql
```

### Restore
```bash
psql postgresql://user:pass@host/dbname < backup.sql
```

## Production Checklist

- [ ] All environment variables configured
- [ ] Database schema executed and verified
- [ ] RLS policies enabled and tested
- [ ] Razorpay webhook configured
- [ ] Email templates customized
- [ ] HTTPS enabled
- [ ] Backup strategy defined
- [ ] Monitoring/alerting setup
- [ ] Rate limiting configured
- [ ] CORS policies configured

---

For additional help or issues, check the inline code comments and error messages in console logs.
