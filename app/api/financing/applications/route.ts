import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  ApiError,
  UnauthorizedError,
  NotFoundError,
  parsePaginationParams,
} from '@/lib/api/api-response'
import { validateFinancingApplication } from '@/lib/api/validators'

/**
 * GET /api/financing/applications
 * Get current user's financing applications
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
      .from('financing_applications')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', user.id)

    // Get paginated data
    const { data: applications, error } = await supabase
      .from('financing_applications')
      .select(
        `
        *,
        products:product_id(name, description, interest_rate_min, interest_rate_max),
        programs:program_id(name, total_fees, level)
      `
      )
      .eq('student_id', user.id)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(
      paginatedResponse(applications || [], count || 0, page, limit)
    )
  } catch (error) {
    console.error('[v0] GET /api/financing/applications error:', error)

    if (error instanceof ApiError) {
      return NextResponse.json(
        errorResponse(error.code, error.message, error.details),
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Failed to fetch applications'),
      { status: 500 }
    )
  }
}

/**
 * POST /api/financing/applications
 * Create a new financing application
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
    validateFinancingApplication(body)

    // Verify student exists
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('id', user.id)
      .single()

    if (studentError || !student) {
      throw new NotFoundError('Student profile')
    }

    // Verify program exists
    const { data: program, error: programError } = await supabase
      .from('programs')
      .select('id')
      .eq('id', body.programId)
      .single()

    if (programError || !program) {
      throw new NotFoundError('Program')
    }

    // Verify financing product exists
    const { data: product, error: productError } = await supabase
      .from('financing_products')
      .select('id')
      .eq('id', body.productId)
      .single()

    if (productError || !product) {
      throw new NotFoundError('Financing product')
    }

    // Create application
    const { data: application, error } = await supabase
      .from('financing_applications')
      .insert({
        student_id: user.id,
        program_id: body.programId,
        product_id: body.productId,
        requested_amount: body.requestedAmount,
        status: 'draft',
        co_applicant_required: body.coApplicantRequired || false,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Log engagement
    await supabase.from('student_engagement_log').insert({
      student_id: user.id,
      action_type: 'create_financing_application',
      resource_type: 'financing_application',
      resource_id: application.id,
    })

    return NextResponse.json(successResponse(application), { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/financing/applications error:', error)

    if (error instanceof ApiError) {
      return NextResponse.json(
        errorResponse(error.code, error.message, error.details),
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Failed to create application'),
      { status: 500 }
    )
  }
}
