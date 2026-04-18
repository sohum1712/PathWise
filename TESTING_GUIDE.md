# StudyHub Testing Guide

This guide covers manual and automated testing for the StudyHub platform.

## Manual Testing Scenarios

### 1. Authentication Flow

#### Student Signup
1. Navigate to `http://localhost:3000/auth/sign-up`
2. Click "I'm a Student"
3. Fill in:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `student@example.com`
   - Password: `Test@1234` (must meet requirements)
   - Confirm Password: `Test@1234`
4. Click "Sign up"
5. Verify: Redirected to `/student/dashboard`
6. Verify: Student profile created in Supabase

#### Institution Admin Signup
1. Navigate to `/auth/sign-up`
2. Click "I'm an Institution"
3. Fill in:
   - Institution Name: `Example College`
   - Email: `admin@example.com`
   - Password: `Test@1234`
   - Confirm Password: `Test@1234`
4. Click "Sign up"
5. Verify: Redirected to `/institution/dashboard`
6. Verify: Institution and admin profiles created

#### Login
1. Navigate to `/auth/login`
2. Enter registered email and password
3. Click "Login"
4. Verify: Redirected to appropriate dashboard based on role

#### Logout
1. From any dashboard, click "Sign Out"
2. Verify: Redirected to home page
3. Verify: Auth state cleared

### 2. Student Features

#### Profile Completion
1. From student dashboard, click "Edit Profile"
2. Fill in additional information (DOB, phone, address, etc.)
3. Click "Save"
4. Verify: Changes saved to database
5. Navigate to profile again and verify data persists

#### Fee Discovery
1. Click "Discover Institutions & Fees"
2. View list of institutions
3. Click on an institution
4. View:
   - Institution details
   - Available programs
   - Fee structures per year
5. Filter by location, type, etc.

#### EMI Calculator
1. Click "Calculate EMI"
2. Enter:
   - Loan Amount: `500000`
   - Interest Rate: `8.5`
   - Tenure: `5`
3. Verify: EMI calculated correctly
4. Adjust sliders and verify real-time updates
5. View payment breakdown

#### Financing Application
1. Click "Apply for Financing"
2. Select program and financing product
3. Enter requested amount
4. Click "Submit Application"
5. Verify: Application saved with status "draft"
6. Navigate back and verify application appears in list

#### Payment Initiation
1. Click "Payment Tracker"
2. Click "Pay Fee" or "Pay Now"
3. Verify: Razorpay order created
4. Test payment flow (use test card: 4111 1111 1111 1111)

### 3. Institution Features

#### Institution Dashboard
1. Login as institution admin
2. View dashboard with:
   - Student pipeline statistics
   - Recent activities
   - Quick action buttons

#### Student CRM
1. Click "Student CRM"
2. View list of enrolled students
3. Click on student to view details
4. Filter by enrollment status

#### Program Management
1. Click "Programs"
2. View list of programs
3. Click "Add Program" to create new program
4. Fill in program details:
   - Name
   - Level (Diploma, Bachelor, etc.)
   - Duration
   - Total Fees
   - Seats Available
5. Click "Create"
6. Verify: Program appears in list

#### Fee Configuration
1. Click "Fees"
2. View fee structures for programs
3. Click "Configure Fees"
4. Set annual fees for each year
5. Click "Save"
6. Verify: Fee structure updated

#### Analytics Dashboard
1. Click "Analytics"
2. View charts and metrics:
   - Enrollment trends
   - Application status distribution
   - Fee collection vs target
3. Verify: Charts render correctly with sample data
4. Hover over data points to see tooltips

### 4. Notifications and Messaging

#### Receive Notification
1. Perform an action that triggers notification (e.g., complete payment)
2. Verify: Notification appears in notification list
3. Click notification to view details
4. Click "Mark as Read" to mark read
5. Verify: Notification marked as read

#### Send Message
1. Navigate to Messages page
2. Enter recipient ID/email
3. Type message content
4. Click "Send"
5. Verify: Message saved to database
6. Verify: Recipient gets notification

### 5. Error Handling

#### Invalid Input
1. Try signing up with invalid email format
2. Verify: Error message displayed
3. Try submitting form with missing required fields
4. Verify: Validation errors shown

#### Unauthorized Access
1. Try accessing `/student/dashboard` without login
2. Verify: Redirected to `/auth/login`
3. Try accessing institution route as student
4. Verify: Redirected to `/auth/error?code=unauthorized`

#### Network Errors
1. Disable network connection
2. Try performing action
3. Verify: Appropriate error message shown
4. Re-enable network and retry
5. Verify: Action completes successfully

### 6. API Testing

#### Using cURL

```bash
# Get student profile
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/students

# Create financing application
curl -X POST http://localhost:3000/api/financing/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "programId": "program-id",
    "productId": "product-id",
    "requestedAmount": 500000
  }'

# Create payment
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "studentId": "student-id",
    "amount": 100000,
    "description": "Semester 1 Fees"
  }'

# Get notifications
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/notifications
```

#### Using Postman

1. Create Postman collection
2. Add bearer token in Authorization header
3. Test each endpoint:
   - GET requests for data retrieval
   - POST requests for creation
   - PUT requests for updates
4. Verify response codes (200, 201, 400, 401, 404, 500)

## Performance Testing

### Page Load Times
1. Open DevTools → Network tab
2. Navigate to each page
3. Check DOMContentLoaded and Load times
4. Target: < 2s for initial load

### Database Query Performance
1. Check Supabase Logs for slow queries
2. Optimize queries with indexes
3. Use RLS policies efficiently

### API Response Times
1. Monitor API response times
2. Target: < 500ms for most requests
3. Target: < 2s for complex aggregations

## Security Testing

### SQL Injection
1. Try entering SQL in form fields
2. Verify: Input sanitized/parameterized
3. Verify: No database errors exposed

### XSS (Cross-Site Scripting)
1. Try entering `<script>alert('xss')</script>` in inputs
2. Verify: Script doesn't execute
3. Verify: Input sanitized and escaped

### CSRF Protection
1. Verify: All state-changing requests use POST/PUT/DELETE
2. Verify: CSRF tokens validated (if implemented)

### Authentication Bypass
1. Try modifying JWT token
2. Verify: Request rejected
3. Try accessing protected routes without token
4. Verify: Redirected to login

## Accessibility Testing

### Keyboard Navigation
1. Tab through all form fields
2. Verify: Logical tab order
3. Verify: Can submit forms with keyboard only

### Screen Reader (NVDA/JAWS)
1. Test with screen reader enabled
2. Verify: All content readable
3. Verify: Form labels associated
4. Verify: Alt text for images

### Color Contrast
1. Check text color contrast ratios
2. Target: WCAG AA (4.5:1 for normal text)
3. Use contrast checker tool

### Responsive Design
1. Test on mobile (375px)
2. Test on tablet (768px)
3. Test on desktop (1440px)
4. Verify: Layout adapts properly

## Browser Compatibility

### Test on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Verify:
- Layout renders correctly
- All features work
- No console errors
- Performance acceptable

## Test Data

### Sample Institutions
```json
{
  "name": "Example University",
  "type": "University",
  "city": "Delhi",
  "state": "Delhi",
  "email": "info@example.edu"
}
```

### Sample Programs
```json
{
  "name": "B.Tech Computer Science",
  "level": "Bachelor",
  "duration_years": 4,
  "total_fees": 1200000,
  "seats_available": 60
}
```

### Sample Fee Structure
```json
{
  "year": 1,
  "tuition_fee": 300000,
  "hostel_fee": 50000,
  "exam_fee": 5000,
  "total_fee": 355000
}
```

## Continuous Integration Testing

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
```

## Regression Testing Checklist

Before each release, test:

- [ ] All auth flows work
- [ ] Student dashboard loads and displays correctly
- [ ] Institution dashboard accessible only to admins
- [ ] All API endpoints respond correctly
- [ ] Payment flow initiates Razorpay orders
- [ ] Notifications sent and received
- [ ] Database queries perform well
- [ ] No console errors
- [ ] Mobile layout works
- [ ] Dark/light theme works (if implemented)
- [ ] Error handling works as expected

## Test Report Template

```
## Test Report - [Date]

### Summary
- Total Test Cases: X
- Passed: Y
- Failed: Z
- Blocked: W

### Failures
1. [Test Case Name]
   - Expected: [Description]
   - Actual: [Description]
   - Severity: [Critical/High/Medium/Low]
   - Steps to Reproduce: [Steps]

### Notes
[Any additional notes]

### Sign-Off
- Tested By: [Name]
- Date: [Date]
- Status: [Ready for Release / Not Ready]
```

---

For automated testing, consider adding:
- Jest for unit tests
- React Testing Library for component tests
- Cypress/Playwright for E2E tests
- Load testing with K6 or Artillery
