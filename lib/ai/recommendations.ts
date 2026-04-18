import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createClient } from '@/lib/supabase/server'

export interface StudentProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  desired_stream?: string
  budget_range?: string
  location_preference?: string
}

export interface InstitutionData {
  id: string
  name: string
  type: string
  location: string
  rating?: number
}

export interface FinancingProductData {
  id: string
  name: string
  interest_rate: number
  processing_fee: number
  max_loan_amount: number
  eligibility_criteria?: string
}

export interface Recommendation {
  type: 'institution' | 'financing' | 'fee_planning' | 'general'
  title: string
  description: string
  reason: string
  action_link?: string
  priority: 'high' | 'medium' | 'low'
}

/**
 * Generate AI-powered institution recommendations for a student
 */
export async function recommendInstitutions(
  student: StudentProfile
): Promise<Recommendation[]> {
  try {
    const supabase = await createClient()

    // Fetch available institutions
    const { data: institutions } = await supabase
      .from('institutions')
      .select('*')
      .eq('is_verified', true)
      .limit(10)

    if (!institutions || institutions.length === 0) {
      return []
    }

    // Build context for AI
    const institutionsContext = institutions
      .map(
        (inst: InstitutionData) =>
          `- ${inst.name} (${inst.type}) in ${inst.location}, Rating: ${inst.rating || 'N/A'}`
      )
      .join('\n')

    const prompt = `
You are an education advisor recommending institutions to a student.

Student Profile:
- Name: ${student.first_name} ${student.last_name}
- Stream Preference: ${student.desired_stream || 'Not specified'}
- Budget Range: ${student.budget_range || 'Not specified'}
- Location Preference: ${student.location_preference || 'Not specified'}

Available Institutions:
${institutionsContext}

Based on the student's profile, recommend the top 3 institutions that would be the best fit.
For each recommendation, provide:
1. Institution name
2. Why it's a good fit (one sentence)
3. Key advantage (one sentence)

Format: Use | as delimiter. Example:
Institution Name|Reason|Advantage

Return exactly 3 recommendations.`

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Parse AI response
    const recommendations = text
      .split('\n')
      .filter((line) => line.includes('|'))
      .slice(0, 3)
      .map((line, index) => {
        const [name, reason, advantage] = line.split('|').map((s) => s.trim())
        const matchedInst = institutions.find(
          (i: InstitutionData) => i.name.toLowerCase() === name.toLowerCase()
        )

        return {
          type: 'institution' as const,
          title: name,
          description: advantage,
          reason,
          action_link: matchedInst ? `/student/fee-discovery?institution=${matchedInst.id}` : undefined,
          priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
        }
      })

    return recommendations
  } catch (error) {
    console.error('[v0] Error generating institution recommendations:', error)
    return []
  }
}

/**
 * Generate AI-powered financing recommendations for a student
 */
export async function recommendFinancing(
  student: StudentProfile,
  loanAmount: number,
  tenure_months?: number
): Promise<Recommendation[]> {
  try {
    const supabase = await createClient()

    // Fetch available financing products
    const { data: products } = await supabase
      .from('financing_products')
      .select('*')
      .gt('max_loan_amount', loanAmount)
      .limit(10)

    if (!products || products.length === 0) {
      return []
    }

    // Build context for AI
    const productsContext = products
      .map(
        (prod: FinancingProductData) =>
          `- ${prod.name}: ${prod.interest_rate}% interest, ${prod.processing_fee}% processing fee, Max loan: ₹${prod.max_loan_amount}`
      )
      .join('\n')

    const prompt = `
You are a fintech advisor recommending loan products to a student.

Student Details:
- Loan Amount Needed: ₹${loanAmount}
- Preferred Tenure: ${tenure_months ? tenure_months + ' months' : 'Flexible'}

Available Financing Products:
${productsContext}

Recommend the top 3 financing products that offer the best value and lowest effective cost.
Consider total cost of borrowing (interest + processing fee).

For each recommendation, provide:
1. Product name
2. Why it's a good fit
3. Key benefit

Format: Use | as delimiter.
Return exactly 3 recommendations.`

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Parse AI response
    const recommendations = text
      .split('\n')
      .filter((line) => line.includes('|'))
      .slice(0, 3)
      .map((line, index) => {
        const [name, reason, benefit] = line.split('|').map((s) => s.trim())
        const matchedProd = products.find(
          (p: FinancingProductData) => p.name.toLowerCase() === name.toLowerCase()
        )

        return {
          type: 'financing' as const,
          title: name,
          description: benefit,
          reason,
          action_link: matchedProd
            ? `/student/financing?product=${matchedProd.id}&amount=${loanAmount}`
            : undefined,
          priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
        }
      })

    return recommendations
  } catch (error) {
    console.error('[v0] Error generating financing recommendations:', error)
    return []
  }
}

/**
 * Generate AI-powered fee planning recommendations
 */
export async function recommendFeePlanning(
  student: StudentProfile,
  institutionId: string,
  totalFees: number
): Promise<Recommendation[]> {
  try {
    const prompt = `
You are a financial planning advisor helping a student plan for education fees.

Student: ${student.first_name} ${student.last_name}
Total Fees: ₹${totalFees}
Budget Available: ${student.budget_range || 'Not specified'}

Provide 3 practical fee payment strategies:
1. Consider upfront payment, installments, and financing options
2. Consider part-time work and scholarships
3. Consider education loan options and tax benefits

For each strategy, provide:
1. Strategy name
2. How it works
3. Key advantage

Format: Use | as delimiter.
Return exactly 3 practical strategies for fee management.`

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Parse AI response
    const recommendations = text
      .split('\n')
      .filter((line) => line.includes('|'))
      .slice(0, 3)
      .map((line, index) => {
        const [strategy, howItWorks, advantage] = line.split('|').map((s) => s.trim())

        return {
          type: 'fee_planning' as const,
          title: strategy,
          description: advantage,
          reason: howItWorks,
          priority: index === 0 ? 'high' : 'medium',
        }
      })

    return recommendations
  } catch (error) {
    console.error('[v0] Error generating fee planning recommendations:', error)
    return []
  }
}

/**
 * Generate personalized dashboard recommendations for students
 */
export async function generateStudentDashboardRecommendations(
  studentId: string
): Promise<Recommendation[]> {
  try {
    const supabase = await createClient()

    // Fetch student data
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single()

    if (!student) {
      return []
    }

    // Check student's progress
    const { data: applications } = await supabase
      .from('financing_applications')
      .select('*')
      .eq('student_id', studentId)

    const { data: payments } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('student_id', studentId)

    const recommendations: Recommendation[] = []

    // Recommendation 1: Profile completion
    if (!student.degree_stream || !student.board_exam_score) {
      recommendations.push({
        type: 'general',
        title: 'Complete Your Profile',
        description: 'Add your academic details to unlock personalized recommendations',
        reason: 'Your profile is incomplete. Complete it to get better institution matches.',
        action_link: '/student/profile',
        priority: 'high',
      })
    }

    // Recommendation 2: Explore financing
    if (!applications || applications.length === 0) {
      recommendations.push({
        type: 'general',
        title: 'Explore Financing Options',
        description: 'Find the best loans and financing products for your needs',
        reason: 'You haven\'t explored financing options yet. See what\'s available.',
        action_link: '/student/financing',
        priority: 'high',
      })
    }

    // Recommendation 3: Payment schedule
    if (applications && applications.length > 0 && (!payments || payments.length === 0)) {
      recommendations.push({
        type: 'general',
        title: 'Set Up Payment Schedule',
        description: 'Create a payment plan to manage your fees systematically',
        reason: 'You have pending fees. Set up a payment schedule to avoid penalties.',
        action_link: '/student/payments',
        priority: 'medium',
      })
    }

    return recommendations
  } catch (error) {
    console.error('[v0] Error generating dashboard recommendations:', error)
    return []
  }
}
