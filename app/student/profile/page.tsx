'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { CheckCircle2, User, BookOpen, DollarSign } from 'lucide-react'

export default function StudentProfile() {
  const [firstName, setFirstName] = useState('Arjun')
  const [lastName, setLastName] = useState('Mehta')
  const [email, setEmail] = useState('arjun.mehta@gmail.com')
  const [phone, setPhone] = useState('+91 98765 43210')
  const [dob, setDob] = useState('2002-08-15')
  const [city, setCity] = useState('Mumbai')
  const [state, setState] = useState('Maharashtra')
  const [qualification, setQualification] = useState('12th Pass')
  const [stream, setStream] = useState('Science (PCM)')
  const [percentage, setPercentage] = useState('87.4')
  const [targetCourse, setTargetCourse] = useState('B.Tech Computer Science')
  const [annualIncome, setAnnualIncome] = useState('650000')
  const [budgetRange, setBudgetRange] = useState('3-5 Lakhs per year')
  const [isLoading, setIsLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      setEmail(user.email || email)
      if (user.user_metadata?.first_name) setFirstName(user.user_metadata.first_name)
      if (user.user_metadata?.last_name) setLastName(user.user_metadata.last_name)
    })
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaved(true)
    setIsLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const completionFields = [firstName, lastName, phone, dob, city, qualification, stream, percentage, targetCourse, annualIncome]
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100)

  const inputCls = "h-10 rounded-xl bg-muted border-0 focus-visible:ring-2 focus-visible:ring-foreground/20 text-sm"

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Account</p>
        <h1 className="text-4xl font-semibold text-foreground">My Profile</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Avatar */}
          <div className="border border-border rounded-2xl p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center text-2xl font-semibold mx-auto mb-3">
              {firstName[0]}{lastName[0]}
            </div>
            <p className="font-semibold text-foreground">{firstName} {lastName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Profile complete</span>
                <span className="font-semibold text-foreground">{completion}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="border border-border rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Profile Tips</p>
            <div className="space-y-2.5">
              {[
                'Complete profile for better loan matches',
                'Add income details for eligibility check',
                'Update target course for recommendations',
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0" />
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 space-y-5">
          <form onSubmit={handleSave} className="space-y-5">

            {/* Personal */}
            <div className="border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2"><User size={15} /> Personal Information</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">First Name</label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Name</label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
                <Input value={email} disabled className={`${inputCls} opacity-60`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date of Birth</label>
                  <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">City</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">State</label>
                  <Input value={state} onChange={(e) => setState(e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2"><BookOpen size={15} /> Education Details</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Qualification</label>
                  <Input value={qualification} onChange={(e) => setQualification(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Stream</label>
                  <Input value={stream} onChange={(e) => setStream(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Percentage / CGPA</label>
                  <Input value={percentage} onChange={(e) => setPercentage(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Target Course</label>
                  <Input value={targetCourse} onChange={(e) => setTargetCourse(e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Financial */}
            <div className="border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2"><DollarSign size={15} /> Financial Information</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Annual Family Income (₹)</label>
                  <Input value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fee Budget Range</label>
                  <Input value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            {saved && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-700">
                <CheckCircle2 size={15} /> Profile saved successfully!
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-semibold h-11 rounded-full hover:bg-foreground/90 transition disabled:opacity-50 text-sm">
              {isLoading ? <><span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" /> Saving…</> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
