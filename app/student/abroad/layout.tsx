'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/student/abroad',              label: 'Overview' },
  { href: '/student/abroad/universities', label: 'Universities' },
  { href: '/student/abroad/scholarships', label: 'Scholarships' },
  { href: '/student/abroad/visa',         label: 'Visa & Consultants' },
]

export default function AbroadLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="space-y-0">
      {/* Slim section header — sits inside the existing page content area */}
      <div className="border-b border-border mb-8 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/student/dashboard" className="hover:text-foreground transition">Dashboard</Link>
            <span>/</span>
            <span className="text-foreground font-medium">✈️ Study Abroad</span>
          </div>
        </div>
        {/* Tab strip */}
        <div className="flex gap-1 overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const active = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`shrink-0 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  active
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>

      {children}
    </div>
  )
}
