'use client'

import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Eye, EyeOff, ArrowUpRight,
  GraduationCap, Building2,
  BookOpen, Calculator, CreditCard,
  Users, BarChart3, Landmark,
} from 'lucide-react'

type UserRole = 'student' | 'institution' | null

const roleContent = {
  student: {
    headline: 'Your education journey starts here.',
    sub: 'Discover institutions, plan your finances, and secure the right loan — all in one place.',
    perks: [
      { icon: <BookOpen size={15} />, text: 'Browse 70,000+ institutions & programs' },
      { icon: <Calculator size={15} />, text: 'Real-time EMI calculator & fee planner' },
      { icon: <CreditCard size={15} />, text: 'AI-matched financing from verified lenders' },
    ],
  },
  institution: {
    headline: 'Manage your entire student lifecycle.',
    sub: 'From inquiry to enrollment — track every student, collect fees, and partner with lenders.',
    perks: [
      { icon: <Users size={15} />, text: 'Full CRM with dropout-risk signals' },
      { icon: <BarChart3 size={15} />, text: 'Analytics on enrollment & fee collection' },
      { icon: <Landmark size={15} />, text: 'Direct lender partnership integrations' },
    ],
  },
  default: {
    headline: 'The operating system for student success.',
    sub: 'Connecting students, institutions, and lenders in one unified platform.',
    perks: [
      { icon: <GraduationCap size={15} />, text: '4.46 Cr students in India\'s higher-ed' },
      { icon: <BarChart3 size={15} />, text: '₹20,000 Cr total addressable market' },
      { icon: <Building2 size={15} />, text: '70,018 higher-ed institutions' },
    ],
  },
}

export default function SignUpPage() {
  const [role, setRole] = useState<UserRole>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeat, setShowRepeat] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [institutionName, setInstitutionName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const panel = role ? roleContent[role] : roleContent.default

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== repeatPassword) { setError('Passwords do not match'); return }
    setIsLoading(true); setError(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
          data: {
            role,
            ...(role === 'student' && { first_name: firstName, last_name: lastName }),
            ...(role === 'institution' && { institution_name: institutionName }),
          },
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const inputCls = "h-11 rounded-xl bg-muted border-0 focus-visible:ring-2 focus-visible:ring-foreground/20 text-sm"

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: role === 'institution'
              ? "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=90')"
              : "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1800&q=90')",
            filter: 'brightness(0.55) saturate(1.1)',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,20,60,0.65) 0%, transparent 55%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)' }} />

        <div className="relative z-10 flex flex-col h-full p-10">
          <Logo href="/" className="text-white" />

          <div className="flex-1 flex flex-col justify-center max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
              {role ? `For ${role === 'student' ? 'Students' : 'Institutions'}` : 'PathWise'}
            </p>
            <h2 className="text-3xl font-semibold text-white leading-snug mb-4 transition-all">
              {panel.headline}
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8">{panel.sub}</p>

            {/* Animated step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    (role === null && i === 0) || (role !== null && i === 1)
                      ? 'w-8 bg-white'
                      : 'w-4 bg-white/30'
                  }`}
                />
              ))}
              <span className="text-white/40 text-xs ml-1">
                {role ? 'Step 2 of 2' : 'Step 1 of 2'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {panel.perks.map((p) => (
              <div key={p.text} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2.5 w-fit">
                <span className="text-white/70">{p.icon}</span>
                <span className="text-white/80 text-xs font-medium">{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="flex items-center justify-between px-8 py-5 border-b border-border lg:border-0">
          <div className="lg:hidden"><Logo href="/" /></div>
          <div className="hidden lg:flex w-full justify-end">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
              ← Back to home
            </Link>
          </div>
          <Link href="/" className="lg:hidden text-sm text-muted-foreground hover:text-foreground transition">
            ← Home
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-sm">

            {/* ── STEP 1: Role picker ── */}
            {!role && (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-semibold text-foreground mb-1.5">Join PathWise</h1>
                  <p className="text-muted-foreground text-sm">Who are you? Pick your role to continue.</p>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    {
                      value: 'student' as const,
                      icon: <GraduationCap size={22} />,
                      title: "I'm a Student",
                      desc: 'Explore colleges, discover financing, manage your education finances',
                      badge: 'Most popular',
                    },
                    {
                      value: 'institution' as const,
                      icon: <Building2 size={22} />,
                      title: "I'm an Institution",
                      desc: 'Manage admissions, track students, partner with lenders',
                      badge: null,
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRole(opt.value)}
                      className="flex items-center gap-4 p-5 border-2 border-border rounded-2xl hover:border-foreground hover:bg-muted/40 transition-all text-left group w-full"
                    >
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-foreground group-hover:text-background transition-colors">
                        {opt.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-foreground text-sm">{opt.title}</p>
                          {opt.badge && (
                            <span className="text-[10px] font-semibold bg-foreground text-background px-2 py-0.5 rounded-full">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{opt.desc}</p>
                      </div>
                      <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">already a member?</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 border border-border rounded-full px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition w-full"
                >
                  Sign in to your account
                </Link>
              </>
            )}

            {/* ── STEP 2: Form ── */}
            {role && (
              <>
                <div className="mb-7">
                  <button
                    onClick={() => { setRole(null); setError(null) }}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition mb-5 group"
                  >
                    <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Change role
                  </button>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center">
                      {role === 'student' ? <GraduationCap size={18} /> : <Building2 size={18} />}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {role === 'student' ? 'Student' : 'Institution'}
                    </span>
                  </div>
                  <h1 className="text-3xl font-semibold text-foreground mb-1">Create account</h1>
                  <p className="text-muted-foreground text-sm">Fill in your details to get started</p>
                </div>

                <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                  {role === 'student' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">First name</Label>
                        <Input placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last name</Label>
                        <Input placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} />
                      </div>
                    </div>
                  )}
                  {role === 'institution' && (
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Institution name</Label>
                      <Input placeholder="e.g. Delhi Institute of Technology" required value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} className={inputCls} />
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email address</Label>
                    <Input type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Password</Label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} pr-10`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition" tabIndex={-1}>
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Confirm password</Label>
                    <div className="relative">
                      <Input type={showRepeat ? 'text' : 'password'} required value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} className={`${inputCls} pr-10`} />
                      <button type="button" onClick={() => setShowRepeat(!showRepeat)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition" tabIndex={-1}>
                        {showRepeat ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                      <span className="text-red-400 mt-0.5 text-sm">⚠</span>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-1 flex items-center justify-center gap-2 bg-foreground text-background font-semibold h-11 rounded-full hover:bg-foreground/90 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
                  >
                    {isLoading
                      ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />Creating account…</span>
                      : <>Create account <ArrowUpRight size={15} /></>
                    }
                  </button>

                  <p className="text-center text-xs text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-foreground font-medium underline underline-offset-4">Sign in</Link>
                  </p>
                </form>
              </>
            )}

          </div>
        </div>

        <div className="px-8 py-4 text-center">
          <p className="text-xs text-muted-foreground">© 2025 PathWise. All rights reserved.</p>
        </div>
      </div>

    </div>
  )
}
