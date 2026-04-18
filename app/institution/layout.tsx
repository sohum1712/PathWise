'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/logo'
import { ArrowUpRight } from 'lucide-react'

const navLinks = [
  { href: '/institution/dashboard', label: 'Dashboard' },
  { href: '/institution/crm', label: 'Student CRM' },
  { href: '/institution/programs', label: 'Programs' },
  { href: '/institution/fees', label: 'Fees' },
  { href: '/institution/lenders', label: 'Lenders' },
  { href: '/institution/analytics', label: 'Analytics' },
]

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [userEmail, setUserEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/auth/login'); return }
        const role = user.user_metadata?.role
        if (role !== 'institution_admin' && role !== 'institution') {
          router.push('/auth/error?code=unauthorized'); return
        }
        setUserEmail(user.email || '')
      } catch {
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo href="/institution/dashboard" />
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      active
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-muted-foreground">{userEmail}</span>
            <Link
              href="/institution/profile"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 bg-foreground text-background text-sm font-semibold px-4 py-2 rounded-full hover:bg-foreground/90 transition"
            >
              Sign out <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
