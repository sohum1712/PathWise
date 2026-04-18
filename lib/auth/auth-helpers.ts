import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type UserRole = 'student' | 'institution_admin' | 'lender_admin' | 'admin'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  metadata: {
    first_name?: string
    last_name?: string
    institution_name?: string
    institution_id?: string
    role?: UserRole
  }
}

/**
 * Get current authenticated user from Supabase
 * Returns null if user is not authenticated
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const role = (user.user_metadata?.role as UserRole) || 'student'

    return {
      id: user.id,
      email: user.email || '',
      role,
      metadata: user.user_metadata,
    }
  } catch (error) {
    console.error('[v0] Error getting current user:', error)
    return null
  }
}

/**
 * Require authentication and redirect to login if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  return user
}

/**
 * Require specific role and redirect if user doesn't have permission
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role)) {
    redirect('/auth/error?code=unauthorized')
  }

  return user
}

/**
 * Get student profile by user ID
 */
export async function getStudentProfile(userId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error fetching student profile:', error)
    return null
  }
}

/**
 * Get institution admin profile
 */
export async function getInstitutionAdminProfile(userId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('institution_admins')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error fetching institution admin profile:', error)
    return null
  }
}

/**
 * Check if user is institution admin for a specific institution
 */
export async function isInstitutionAdminFor(
  userId: string,
  institutionId: string
): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('institution_admins')
      .select('id')
      .eq('user_id', userId)
      .eq('institution_id', institutionId)
      .eq('is_active', true)
      .single()

    if (error) return false
    return !!data
  } catch (error) {
    return false
  }
}

/**
 * Get all institutions managed by a user
 */
export async function getUserInstitutions(userId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('institution_admins')
      .select('institution_id, institutions(*)')
      .eq('user_id', userId)
      .eq('is_active', true)

    if (error) throw error
    return data?.map((item: any) => item.institutions) || []
  } catch (error) {
    console.error('[v0] Error fetching user institutions:', error)
    return []
  }
}

/**
 * Sign up a new user (student or institution)
 */
export async function signUpUser(
  email: string,
  password: string,
  role: UserRole,
  metadata: Record<string, any>
) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: {
          role,
          ...metadata,
        },
      },
    })

    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    console.error('[v0] Sign up error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign up failed',
    }
  }
}

/**
 * Sign in user
 */
export async function signInUser(email: string, password: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    console.error('[v0] Sign in error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign in failed',
    }
  }
}

/**
 * Sign out user
 */
export async function signOutUser() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('[v0] Sign out error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign out failed',
    }
  }
}

/**
 * Create student profile after signup
 */
export async function createStudentProfile(
  userId: string,
  firstName: string,
  lastName: string,
  email: string
) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from('students').insert({
      id: userId,
      first_name: firstName,
      last_name: lastName,
      email,
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('[v0] Error creating student profile:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Profile creation failed',
    }
  }
}

/**
 * Create institution admin profile
 */
export async function createInstitutionAdminProfile(
  userId: string,
  institutionId: string,
  firstName: string,
  lastName: string,
  email: string,
  role: 'admin' | 'manager' | 'counselor' = 'manager'
) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from('institution_admins').insert({
      user_id: userId,
      institution_id: institutionId,
      first_name: firstName,
      last_name: lastName,
      email,
      role,
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('[v0] Error creating institution admin profile:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Profile creation failed',
    }
  }
}

/**
 * Log user activity for engagement tracking
 */
export async function logEngagementActivity(
  userId: string,
  actionType: string,
  resourceType?: string,
  resourceId?: string,
  metadata?: Record<string, any>
) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from('student_engagement_log').insert({
      student_id: userId,
      action_type: actionType,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
    })

    if (error) {
      console.error('[v0] Error logging activity:', error)
      // Don't throw, this is non-critical
    }
  } catch (error) {
    console.error('[v0] Error logging activity:', error)
  }
}
