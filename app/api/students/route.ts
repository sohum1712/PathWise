import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse, ApiError, UnauthorizedError } from '@/lib/api/api-response'
import { validateStudentProfileUpdate } from '@/lib/api/validators'

/**
 * GET /api/students
 * Get current student profile
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

    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !student) {
      throw new Error('Student profile not found')
    }

    return NextResponse.json(successResponse(student))
  } catch (error) {
    console.error('[v0] GET /api/students error:', error)

    if (error instanceof ApiError) {
      return NextResponse.json(
        errorResponse(error.code, error.message, error.details),
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Failed to fetch student profile'),
      { status: 500 }
    )
  }
}

/**
 * PUT /api/students
 * Update current student profile
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new UnauthorizedError('Authentication required')
    }

    const body = await request.json()
    validateStudentProfileUpdate(body)

    const { data: student, error } = await supabase
      .from('students')
      .update({
        first_name: body.firstName,
        last_name: body.lastName,
        phone: body.phone,
        date_of_birth: body.dateOfBirth,
        gender: body.gender,
        address: body.address,
        city: body.city,
        state: body.state,
        postal_code: body.postalCode,
        country: body.country,
        qualification_level: body.qualificationLevel,
        specialization: body.specialization,
        annual_family_income: body.annualFamilyIncome,
        is_complete: body.isComplete !== undefined ? body.isComplete : true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(successResponse(student))
  } catch (error) {
    console.error('[v0] PUT /api/students error:', error)

    if (error instanceof ApiError) {
      return NextResponse.json(
        errorResponse(error.code, error.message, error.details),
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Failed to update student profile'),
      { status: 500 }
    )
  }
}
