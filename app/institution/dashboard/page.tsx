'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Users, GraduationCap, DollarSign, Landmark, BarChart3, User } from 'lucide-react'

interface InstitutionProfile { id: string; email: string; institution_name: string; created_at: string }

const mgmtLinks = [
  { href: '/institution/crm', icon: <Users size={18} />, label: 'Student CRM', desc: 'View and manage your student pipeline' },
  { href: '/institution/programs', icon: <GraduationCap size={18} />, label: 'Programs', desc: 'Create and configure academic programs' },
  { href: '/institution/fees', icon: <DollarSign size={18} />, label: 'Fee Management', desc: 'Set fee structures and track collections' },
  { href: '/institution/lenders', icon: <Landmark size={18} />, label: 'Lender Partnerships', desc: 'Manage financing partner integrations' },
  { href: '/institution/analytics', icon: <BarChart3 size={18} />, label: 'Analytics', desc: 'Enrollment trends and engagement metrics' },
]

export default function InstitutionDashboard() {
  const [profile, setProfile] = useState<InstitutionProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const pipeline = { total: 250, inquiries: 85, applied: 45, enrolled: 28, pending: 15 }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) { router.push('/auth/login'); return }
      setProfile({
        id: user.id,
        email: user.email || '',
        institution_name: user.user_metadata?.institution_name || 'Institution',
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

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Institution Portal</p>
          <h1 className="text-4xl font-semibold text-foreground">{profile.institution_name}</h1>
          <p className="text-muted-foreground mt-2 text-sm">Manage admissions, fees, and financing partnerships.</p>
        </div>
        <Link
          href="/institution/profile"
          className="flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm font-medium hover:bg-muted transition"
        >
          <User size={14} /> Profile
        </Link>
      </div>

      {/* Pipeline stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: pipeline.total },
          { label: 'Inquiries', value: pipeline.inquiries },
          { label: 'Applications', value: pipeline.applied },
          { label: 'Enrolled', value: pipeline.enrolled },
          { label: 'Pending', value: pipeline.pending },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-2xl p-6">
            <p className="text-xs text-muted-foreground mb-2">{s.label}</p>
            <p className="text-2xl font-semibold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pipeline bars */}
      <div className="border border-border rounded-2xl p-8">
        <h2 className="text-lg font-semibold text-foreground mb-6">Student pipeline</h2>
        <div className="space-y-5">
          {[
            { label: 'Inquiries', value: pipeline.inquiries },
            { label: 'Applications', value: pipeline.applied },
            { label: 'Enrolled', value: pipeline.enrolled },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-muted-foreground">{item.value} / {pipeline.total}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground rounded-full transition-all"
                  style={{ width: `${(item.value / pipeline.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Management links */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Management</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {mgmtLinks.map((a) => (
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

    </div>
  )
}
