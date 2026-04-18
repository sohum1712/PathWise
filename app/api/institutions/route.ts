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
 * GET /api/institutions
 * Get all public institutions (paginated)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)

    const { page, limit, offset } = parsePaginationParams(searchParams)

    // Get total count
    const { count } = await supabase
      .from('institutions')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', true)

    // Get paginated data
    const { data: institutions, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('is_verified', true)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(
      paginatedResponse(institutions || [], count || 0, page, limit)
    )
  } catch (error) {
    console.error('[v0] GET /api/institutions error:', error)

    if (error instanceof ApiError) {
      return NextResponse.json(
        errorResponse(error.code, error.message, error.details),
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Failed to fetch institutions'),
      { status: 500 }
    )
  }
}

/**
 * GET /api/institutions/[id]
 * Get single institution details
 */
export async function getInstitutionById(id: string) {
  try {
    const supabase = await createClient()

    const { data: institution, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('id', id)
      .eq('is_verified', true)
      .single()

    if (error || !institution) {
      throw new Error('Institution not found')
    }

    return institution
  } catch (error) {
    console.error('[v0] Error fetching institution:', error)
    throw error
  }
}

/**
 * GET /api/institutions/[id]/programs
 * Get programs for an institution
 */
export async function getInstitutionPrograms(
  institutionId: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const supabase = await createClient()
    const offset = (page - 1) * limit

    // Get total count
    const { count } = await supabase
      .from('programs')
      .select('*', { count: 'exact', head: true })
      .eq('institution_id', institutionId)
      .eq('is_active', true)

    // Get paginated data
    const { data: programs, error } = await supabase
      .from('programs')
      .select('*')
      .eq('institution_id', institutionId)
      .eq('is_active', true)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return {
      data: programs || [],
      total: count || 0,
      page,
      limit,
    }
  } catch (error) {
    console.error('[v0] Error fetching institution programs:', error)
    throw error
  }
}

/**
 * GET /api/institutions/[id]/fees
 * Get fee structures for an institution's programs
 */
export async function getInstitutionFees(institutionId: string) {
  try {
    const supabase = await createClient()

    const { data: feeStructures, error } = await supabase
      .from('fee_structures')
      .select(
        `
        *,
        programs(id, name, institution_id, level, duration_years)
      `
      )
      .in(
        'program_id',
        (await supabase
          .from('programs')
          .select('id')
          .eq('institution_id', institutionId)
          .then((res) => res.data?.map((p: any) => p.id) || []))
      )

    if (error) {
      throw error
    }

    return feeStructures || []
  } catch (error) {
    console.error('[v0] Error fetching institution fees:', error)
    throw error
  }
}

/**
 * Search institutions by name, city, or type
 */
export async function searchInstitutions(
  query: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const supabase = await createClient()
    const offset = (page - 1) * limit

    const { data: institutions, count, error } = await supabase
      .from('institutions')
      .select('*', { count: 'exact' })
      .eq('is_verified', true)
      .or(`name.ilike.%${query}%, city.ilike.%${query}%, type.ilike.%${query}%`)
      .range(offset, offset + limit - 1)
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    return {
      data: institutions || [],
      total: count || 0,
      page,
      limit,
    }
  } catch (error) {
    console.error('[v0] Error searching institutions:', error)
    throw error
  }
}
