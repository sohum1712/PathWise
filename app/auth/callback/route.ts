import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const user = data.user
      const role = user.user_metadata?.role

      try {
        // Create student profile if role is student
        if (role === 'student') {
          const firstName = user.user_metadata?.first_name || ''
          const lastName = user.user_metadata?.last_name || ''
          const email = user.email || ''

          const { error: profileError } = await supabase
            .from('students')
            .insert({
              id: user.id,
              first_name: firstName,
              last_name: lastName,
              email,
            })

          if (profileError && profileError.code !== '23505') {
            console.error('[v0] Error creating student profile:', profileError)
          }

          return NextResponse.redirect(`${origin}/student/dashboard`)
        }

        // Create institution admin profile if role is institution or institution_admin
        if (role === 'institution_admin' || role === 'institution') {
          const institutionName = user.user_metadata?.institution_name || ''
          const firstName = user.user_metadata?.first_name || 'Admin'
          const lastName = user.user_metadata?.last_name || ''
          const email = user.email || ''

          // Create institution first if it doesn't exist
          const { data: existingInstitution } = await supabase
            .from('institutions')
            .select('id')
            .eq('created_by', user.id)
            .single()

          let institutionId = existingInstitution?.id

          if (!institutionId) {
            const { data: newInstitution, error: instError } = await supabase
              .from('institutions')
              .insert({
                name: institutionName || `Institution-${user.id.slice(0, 8)}`,
                type: 'College',
                created_by: user.id,
                is_verified: false,
              })
              .select()
              .single()

            if (instError) {
              console.error('[v0] Error creating institution:', instError)
              return NextResponse.redirect(`${origin}/auth/error`)
            }

            institutionId = newInstitution?.id
          }

          // Create institution admin profile
          const { error: adminError } = await supabase
            .from('institution_admins')
            .insert({
              institution_id: institutionId,
              user_id: user.id,
              first_name: firstName,
              last_name: lastName,
              email,
              role: 'admin',
            })

          if (adminError && adminError.code !== '23505') {
            console.error('[v0] Error creating admin profile:', adminError)
          }

          return NextResponse.redirect(`${origin}/institution/dashboard`)
        }
      } catch (profileError) {
        console.error('[v0] Profile creation error:', profileError)
      }

      // Default redirect based on role
      return NextResponse.redirect(
        `${origin}/${(role === 'institution_admin' || role === 'institution') ? 'institution' : 'student'}/dashboard`
      )
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
