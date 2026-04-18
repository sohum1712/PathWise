'use client'

import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, ArrowUpRight, GraduationCap, TrendingUp, Shield } from 'lucide-react'

const highlights = [
  { icon: <GraduationCap size={16} />, text: '4.46 Cr students on the platform' },
  { icon: <TrendingUp size={16} />, text: '₹20,000 Cr total addressable market' },
  { icon: <Shield size={16} />, text: 'Bank-grade security & data privacy' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const role = data.user?.user_metadata?.role
      router.push(role === 'institution_admin' || role === 'institution' ? '/institution/dashboard' : '/student/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden">
        {/* Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1800&q=90')",
            filter: 'brightness(0.6) saturate(1.1)',
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,20,60,0.7) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <Logo href="/" className="text-white" />

          {/* Middle quote */}
          <div className="flex-1 flex flex-col justify-center max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">Why PathWise</p>
            <h2 className="text-3xl font-semibold text-white leading-snug mb-6">
              Your complete education financing journey, in one place.
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              From discovering the right institution to securing financing and tracking payments — PathWise connects every step.
            </p>
          </div>

          {/* Bottom stat pills */}
          <div className="flex flex-col gap-3">
            {highlights.map((h) => (
              <div key={h.text} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2.5 w-fit">
                <span className="text-white/70">{h.icon}</span>
                <span className="text-white/80 text-xs font-medium">{h.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 lg:hidden border-b border-border">
          <Logo href="/" />
        </div>
        <div className="hidden lg:flex items-center justify-end px-8 py-5">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Back to home
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-sm">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-1.5">Welcome back</h1>
              <p className="text-muted-foreground text-sm">Sign in to continue to PathWise</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl bg-muted border-0 focus-visible:ring-2 focus-visible:ring-foreground/20 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl bg-muted border-0 focus-visible:ring-2 focus-visible:ring-foreground/20 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <span className="text-red-400 mt-0.5">⚠</span>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 flex items-center justify-center gap-2 bg-foreground text-background font-semibold h-11 rounded-full hover:bg-foreground/90 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
              >
                {isLoading
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />Signing in…</span>
                  : <>Sign in <ArrowUpRight size={15} /></>
                }
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Sign up nudge */}
            <div className="border border-border rounded-2xl p-5 text-center">
              <p className="text-sm text-muted-foreground mb-3">New to PathWise?</p>
              <Link
                href="/auth/sign-up"
                className="flex items-center justify-center gap-2 border border-border rounded-full px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition w-full"
              >
                Create a free account <ArrowUpRight size={13} />
              </Link>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 text-center">
          <p className="text-xs text-muted-foreground">© 2025 PathWise. All rights reserved.</p>
        </div>
      </div>

    </div>
  )
}
