import { NextRequest, NextResponse } from 'next/server'
import { generateStudentDashboardRecommendations } from '@/lib/ai/recommendations'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate recommendations based on student activity
    const recommendations = await generateStudentDashboardRecommendations(user.id)

    return NextResponse.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
    })
  } catch (error) {
    console.error('[v0] Recommendations API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
