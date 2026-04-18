'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Search, Calculator, CreditCard, BarChart3, User } from 'lucide-react'

interface StudentProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
}

const quickActions = [
  { href: '/student/fee-discovery', icon: <Search size={18} />, label: 'Discover Colleges', desc: 'Browse institutions & compare fees' },
  { href: '/student/emi-calculator', icon: <Calculator size={18} />, label: 'EMI Calculator', desc: 'Plan your loan repayments' },
  { href: '/student/financing', icon: <CreditCard size={18} />, label: 'Apply for Financing', desc: 'Explore matched loan products' },
  { href: '/student/payments', icon: <BarChart3 size={18} />, label: 'Payment Tracker', desc: 'View history & upcoming dues' },
]

export default function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) { router.push('/auth/login'); return }
      setProfile({
        id: user.id,
        email: user.email || '',
        first_name: user.user_metadata?.first_name || 'Student',
        last_name: user.user_metadata?.last_name || '',
        created_at: user.created_at || new Date().toISOString(),
      })
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="space-y-10">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Student Portal</p>
          <h1 className="text-4xl font-semibold text-foreground">
            Hello, {profile.first_name} 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">Manage your education finances and track your academic journey.</p>
        </div>
        <Link
          href="/student/profile"
          className="flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm font-medium hover:bg-muted transition"
        >
          <User size={14} /> Profile
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Fees', value: '₹0', sub: 'No fees added yet' },
          { label: 'Financed', value: '₹0', sub: 'No financing yet' },
          { label: 'Monthly EMI', value: '₹0', sub: 'Calculated automatically' },
          { label: 'Status', value: 'Active', sub: 'All systems operational' },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-2xl p-6">
            <p className="text-xs text-muted-foreground mb-2">{s.label}</p>
            <p className="text-2xl font-semibold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center justify-between border border-border rounded-2xl p-6 hover:border-foreground/40 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                  {a.icon}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Getting started */}
      <div className="border border-border rounded-2xl p-8">
        <h2 className="text-lg font-semibold text-foreground mb-6">Getting started</h2>
        <div className="space-y-4">
          {[
            { step: '01', title: 'Complete your profile', desc: 'Add your educational background and financial information for personalised recommendations.' },
            { step: '02', title: 'Explore institutions', desc: 'Discover colleges, universities, and their fee structures using our fee discovery tool.' },
            { step: '03', title: 'Plan your finances', desc: 'Use the EMI calculator and apply for matched financing products from verified lenders.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-5 p-4 rounded-xl hover:bg-muted/50 transition-colors">
              <span className="text-xs font-semibold text-muted-foreground mt-0.5 w-6 shrink-0">{item.step}</span>
              <div>
                <p className="font-medium text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Abroad CTA banner */}
      <Link
        href="/student/abroad"
        className="block relative overflow-hidden rounded-2xl group"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f2d4a 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-4 right-32 w-2 h-2 rounded-full bg-blue-400/60" />
        <div className="absolute bottom-6 right-48 w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
        <div className="absolute top-8 right-64 w-1 h-1 rounded-full bg-white/40" />

        <div className="relative z-10 p-7 flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">✈️</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">New</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-1.5">Planning to study abroad?</h3>
            <p className="text-white/60 text-sm max-w-sm">
              Explore global universities, scholarships, visa guidance, and international financing — all in one place.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {['🌍 Global Universities', '🎓 Scholarships', '📋 Visa Help', '✈️ Travel & Tickets'].map((tag) => (
                <span key={tag} className="text-xs bg-white/10 text-white/70 border border-white/15 px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-white text-black font-semibold text-sm px-5 py-2.5 rounded-full group-hover:bg-white/90 transition whitespace-nowrap">
            Explore Abroad <ArrowUpRight size={14} />
          </div>
        </div>
      </Link>

    </div>
  )
}
