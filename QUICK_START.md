# StudyHub - Quick Start Guide

Get up and running with StudyHub in 5 minutes!

## Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account
- Razorpay account (optional for testing)

## Step 1: Clone and Setup (1 minute)

```bash
cd /vercel/share/v0-project
pnpm install
cp .env.example .env.local
```

## Step 2: Configure Environment (1 minute)

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get credentials from:
- Supabase: Dashboard → Settings → API
- Razorpay: Dashboard → Settings → API Keys

## Step 3: Setup Database (2 minutes)

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste `/scripts/001_create_schema.sql`
3. Execute the script
4. Repeat for `/scripts/004_add_enrollment.sql`
5. Repeat for `/scripts/003_rls_policies.sql`

## Step 4: Run Development Server (1 minute)

```bash
pnpm dev
```

Visit `http://localhost:3000`

---

## Key URLs

| Page | URL | Role |
|------|-----|------|
| Landing | `http://localhost:3000` | Anyone |
| Sign Up | `http://localhost:3000/auth/sign-up` | Anyone |
| Login | `http://localhost:3000/auth/login` | Anyone |
| Student Dashboard | `http://localhost:3000/student/dashboard` | Student |
| Institution Dashboard | `http://localhost:3000/institution/dashboard` | Admin |

---

## Test Accounts

### Student
- Email: `student@example.com`
- Password: `Test@1234`

### Institution
- Email: `admin@example.com`
- Password: `Test@1234`

---

## Common Tasks

### Create a New Student Account
1. Go to `/auth/sign-up`
2. Click "I'm a Student"
3. Fill in name, email, password
4. Click "Sign up"
5. Verify email (check Supabase email if not confirmed automatically)
6. You're redirected to dashboard

### Create a New Institution
1. Go to `/auth/sign-up`
2. Click "I'm an Institution"
3. Fill in institution name, email, password
4. Click "Sign up"
5. Redirected to institution dashboard

### View Student Data
1. Login as student
2. Click "Dashboard"
3. View stats and profile
4. Click "Edit Profile" to update info

### View Analytics
1. Login as institution admin
2. Click "Analytics" in navigation
3. View enrollment trends, fee collection, application status

### Add a Program
1. Login as institution admin
2. Click "Programs"
3. Click "Add Program"
4. Fill in details (name, level, duration, fees)
5. Click "Create"

### Track Payments
1. Login as student
2. Click "Payments"
3. View payment history and status

---

## API Examples

### Get Student Profile
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/students
```

### List Institutions
```bash
curl http://localhost:3000/api/institutions
```

### Create Financing Application
```bash
curl -X POST http://localhost:3000/api/financing/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "programId": "program-uuid",
    "productId": "product-uuid",
    "requestedAmount": 500000
  }'
```

### Get Notifications
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/notifications
```

---

## Troubleshooting

### "Table does not exist" Error
→ Run the database setup scripts (Step 3)

### "SUPABASE_URL not found"
→ Check your `.env.local` file has correct values

### "Unauthorized" on API calls
→ Ensure you're logged in and have correct Authorization header

### Payment not working
→ Check Razorpay credentials in `.env.local`

### Port 3000 already in use
→ Run `pnpm dev -- -p 3001` to use different port

---

## File Structure Quick Reference

```
app/                          # Next.js pages/routes
├── auth/                      # Authentication pages
├── student/                   # Student pages
├── institution/               # Institution admin pages
├── api/                       # API endpoints
└── page.tsx                   # Landing page

lib/
├── auth/auth-helpers.ts       # Auth utilities
├── api/                       # API utilities
│   ├── api-response.ts        # Response formatting
│   └── validators.ts          # Input validation
└── supabase/                  # Supabase clients

scripts/
├── 001_create_schema.sql      # Create tables
├── 003_rls_policies.sql       # Security policies
└── 004_add_enrollment.sql     # Additional tables
```

---

## Documentation Files

- **SETUP_GUIDE.md** - Complete setup instructions
- **TESTING_GUIDE.md** - Testing procedures
- **IMPLEMENTATION_SUMMARY.md** - Feature overview
- **This file** - Quick start reference

---

## Next Steps

1. **Understand the Structure**
   - Read SETUP_GUIDE.md for comprehensive details
   - Review the codebase organization

2. **Test the Features**
   - Create test accounts
   - Explore each feature
   - Check TESTING_GUIDE.md for test scenarios

3. **Deploy to Production**
   - Follow deployment checklist in SETUP_GUIDE.md
   - Configure production environment variables
   - Test thoroughly before launch

4. **Extend Features**
   - Add AI recommendations
   - Implement email notifications
   - Build mobile app

---

## Get Help

- **Code Comments**: Inline documentation in source files
- **API Responses**: Check error messages for guidance
- **Browser Console**: View detailed error logs
- **Database Logs**: Check Supabase logs for SQL issues
- **Documentation**: Review guides in project root

---

## Key Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Check for linting issues
pnpm lint

# Format code
pnpm format
```

---

## Performance Tips

1. **Database Queries**
   - Use pagination for large datasets
   - Add filters to reduce results
   - Check Supabase logs for slow queries

2. **Frontend Optimization**
   - Use Next.js Image component for images
   - Implement code splitting
   - Monitor bundle size

3. **API Performance**
   - Cache responses when possible
   - Use pagination
   - Optimize database indexes

---

**Happy coding! 🚀**

For detailed information, see the full documentation files in the project root.
