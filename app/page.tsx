'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowUpRight, GraduationCap, Building2, Landmark,
  Calculator, Search, CreditCard, BarChart3, Bell,
  BookOpen, TrendingUp, Shield, Users, CheckCircle2,
  Zap, Star, Award, Target, Clock
} from 'lucide-react'
import { Logo } from '@/components/logo'

/* ── data ─────────────────────────────────────────────────── */

const stats = [
  {
    icon: <GraduationCap size={22} className="text-white" />,
    title: '4.46 Cr Students',
    desc: "India's higher-ed enrollment base — the market we serve, starting with the most financing-sensitive.",
  },
  {
    icon: <BarChart3 size={22} className="text-white" />,
    title: '₹20,000 Cr TAM',
    desc: 'Total addressable market growing to ₹24 trillion by 2029, driven by rising enrollment and digital adoption.',
  },
]

const features = [
  { icon: <Search size={20} />, title: 'Fee Discovery', desc: 'Browse institutions, compare programs and fees side by side.' },
  { icon: <Calculator size={20} />, title: 'EMI Calculator', desc: 'Plan your loan repayments with real-time interactive calculations.' },
  { icon: <CreditCard size={20} />, title: 'Smart Financing', desc: 'AI-matched loan products from verified lenders based on your profile.' },
  { icon: <BarChart3 size={20} />, title: 'Institution CRM', desc: 'Full student pipeline visibility — from inquiry to enrollment.' },
  { icon: <Bell size={20} />, title: 'Engagement Engine', desc: 'Smart nudges, reminders, and dropout-risk alerts built in.' },
  { icon: <Landmark size={20} />, title: 'Lender Network', desc: 'Consent-based data sharing with richer underwriting signals.' },
]

/* Floating orbit icons — positioned around the hero text */
const orbitIcons = [
  { icon: <GraduationCap size={18} />, style: 'top-[18%] left-[8%]',  delay: '0s',    size: 'w-12 h-12' },
  { icon: <Calculator size={16} />,    style: 'top-[28%] right-[7%]', delay: '0.6s',  size: 'w-10 h-10' },
  { icon: <BookOpen size={16} />,      style: 'top-[55%] left-[5%]',  delay: '1.2s',  size: 'w-10 h-10' },
  { icon: <TrendingUp size={18} />,    style: 'top-[60%] right-[6%]', delay: '0.3s',  size: 'w-12 h-12' },
  { icon: <Shield size={14} />,        style: 'top-[12%] right-[18%]',delay: '0.9s',  size: 'w-9 h-9'  },
  { icon: <Star size={14} />,          style: 'top-[14%] left-[22%]', delay: '1.5s',  size: 'w-9 h-9'  },
  { icon: <Award size={16} />,         style: 'top-[72%] left-[14%]', delay: '0.4s',  size: 'w-10 h-10' },
  { icon: <Zap size={14} />,           style: 'top-[75%] right-[15%]',delay: '1.1s',  size: 'w-9 h-9'  },
]

/* Ticker items */
const tickerItems = [
  '70,018 Higher-Ed Institutions',
  '4.46 Cr Students Enrolled',
  '₹20,000 Cr Market Opportunity',
  'AI-Powered Recommendations',
  'Bank-Grade Security',
  'Real-Time EMI Calculator',
  'Verified Lender Network',
  'Dropout-Risk Alerts',
  'Consent-Based Data Sharing',
]

/* Metrics */
const metrics = [
  { value: '70K+', label: 'Institutions', icon: <Building2 size={20} /> },
  { value: '4.46Cr', label: 'Students', icon: <Users size={20} /> },
  { value: '₹20K Cr', label: 'Market Size', icon: <TrendingUp size={20} /> },
  { value: '98%', label: 'Placement Rate', icon: <Target size={20} /> },
]

/* How it works */
const steps = [
  {
    num: '01',
    icon: <Search size={22} />,
    title: 'Discover',
    desc: 'Browse 70,000+ institutions, compare programs, fees, and placement records in one place.',
  },
  {
    num: '02',
    icon: <Calculator size={22} />,
    title: 'Plan',
    desc: 'Use our EMI calculator and fee planner to map out exactly what your education will cost.',
  },
  {
    num: '03',
    icon: <CreditCard size={22} />,
    title: 'Finance',
    desc: 'Get AI-matched loan offers from verified lenders based on your profile and institution.',
  },
  {
    num: '04',
    icon: <CheckCircle2 size={22} />,
    title: 'Succeed',
    desc: 'Track payments, stay on top of deadlines, and focus on what matters — your education.',
  },
]

/* Testimonials */
const testimonials = [
  {
    quote: "PathWise helped me compare 12 colleges and find a loan that fit my budget in under an hour.",
    name: 'Priya S.',
    role: 'B.Tech Student, Delhi',
    initials: 'PS',
  },
  {
    quote: "Our enrollment conversion improved by 34% after switching to PathWise for student management.",
    name: 'Rajesh K.',
    role: 'Admissions Head, Pune',
    initials: 'RK',
  },
  {
    quote: "The consent-based data model gives us richer underwriting signals than anything else on the market.",
    name: 'Anita M.',
    role: 'Credit Manager, EduLoan Bank',
    initials: 'AM',
  },
]

/* ── component ─────────────────────────────────────────────── */

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-background font-sans overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden" id="hero">

        {/* Bottom feather */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--background))' }}
        />

        {/* Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=2400&q=90')",
            filter: 'brightness(0.72) saturate(1.15)',
          }}
        />
        {/* Gradient layers */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.72) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 22%, transparent 45%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 25%, transparent 55%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,30,80,0.28) 0%, transparent 60%, rgba(0,20,60,0.18) 100%)' }} />

        {/* ── Floating orbit icons ── */}
        {orbitIcons.map((o, i) => (
          <div
            key={i}
            className={`absolute z-10 ${o.style} ${o.size} rounded-2xl glass flex items-center justify-center text-white/70 pointer-events-none`}
            style={{
              animation: `floatY 4s ease-in-out infinite`,
              animationDelay: o.delay,
            }}
          >
            {o.icon}
          </div>
        ))}

        {/* ── Navbar ── */}
        <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5">
          <Logo href="/" className="text-white" />
          <div className="hidden md:flex items-center gap-1 glass rounded-full px-4 py-2">
            {[
              { label: 'Home',             href: '#hero' },
              { label: 'Features',         href: '#features' },
              { label: 'For Students',     href: '#for-whom' },
              { label: 'For Institutions', href: '#for-whom' },
              { label: 'Contact',          href: '#cta' },
            ].map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  i === 0 ? 'bg-white text-black' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden md:block text-sm text-white/80 hover:text-white transition font-medium">
              Sign in
            </Link>
            <Link href="/auth/sign-up" className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/90 transition">
              Get started <ArrowUpRight size={14} />
            </Link>
          </div>
        </nav>

        {/* ── Hero copy ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pb-16 pt-8">
          {/* Eyebrow badge */}
          <div className="flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/80 text-xs font-medium">India's #1 Education Financing Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight max-w-4xl">
            Smart and simple education
            <br />financing for India.
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/70 max-w-lg">
            Connecting students, institutions, and lenders in one unified platform — from enrollment to outcomes.
          </p>

          {/* CTA pill */}
          <button
            onClick={() => router.push('/auth/sign-up')}
            className="mt-8 flex items-center gap-3 bg-white/10 border border-white/30 backdrop-blur-md text-white text-sm font-medium pl-5 pr-2 py-2 rounded-full hover:bg-white/20 transition group"
          >
            Start your PathWise journey
            <span className="bg-blue-500 rounded-full p-1.5 group-hover:bg-blue-400 transition">
              <ArrowUpRight size={14} />
            </span>
          </button>

          {/* Frosted stat cards */}
          <div className="mt-16 w-full max-w-5xl grid md:grid-cols-2 gap-4 px-4">
            {stats.map((s) => (
              <div key={s.title} className="glass-dark rounded-2xl p-6 text-left">
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TICKER / TRUST BAR
      ══════════════════════════════════════════════════════ */}
      <div className="bg-foreground py-3 overflow-hidden">
        <div className="flex gap-0" style={{ animation: 'ticker 28s linear infinite' }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0 px-6">
              <span className="w-1 h-1 rounded-full bg-background/40" />
              <span className="text-background/70 text-xs font-medium whitespace-nowrap">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          METRICS ROW
      ══════════════════════════════════════════════════════ */}
      <section className="bg-background py-16 px-6 md:px-12 border-b border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                {m.icon}
              </div>
              <div>
                <p className="text-3xl font-semibold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section className="bg-background py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Process</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground leading-tight max-w-md">
              From discovery<br />to success.
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Four simple steps to take control of your education financing journey.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-5 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-border z-0" />

            {steps.map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col gap-4">
                {/* Icon circle */}
                <div className="w-16 h-16 rounded-2xl border-2 border-border bg-background flex items-center justify-center text-foreground group-hover:border-foreground transition-colors">
                  {s.icon}
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">{s.num}</span>
                  <h3 className="font-semibold text-foreground mt-1 mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section className="bg-muted/40 py-24 px-6 md:px-12" id="features">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Platform</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground leading-tight max-w-lg">
              Everything you need,<br />in one place.
            </h2>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              PathWise connects the full student lifecycle — from fee discovery and financing to institutional analytics and lender partnerships.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="border border-border bg-background rounded-2xl p-7 hover:border-foreground/30 hover:shadow-sm transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center mb-5 text-background group-hover:scale-105 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section className="bg-background py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Testimonials</p>
          <h2 className="text-4xl font-semibold text-foreground mb-16 max-w-md leading-tight">
            Trusted by students<br />and institutions.
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="border border-border rounded-2xl p-7 flex flex-col gap-5 hover:border-foreground/20 transition-colors">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-foreground text-foreground" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOR WHOM
      ══════════════════════════════════════════════════════ */}
      <section className="bg-foreground text-background py-24 px-6 md:px-12" id="for-whom">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-background/50 mb-4">Who it&apos;s for</p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-16 max-w-xl leading-tight">
            Built for every stakeholder.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <GraduationCap size={24} />,
                role: 'Students',
                desc: 'One app for admission updates, fee schedules, financing offers, scholarship alerts, and career milestones.',
                cta: 'Student sign up',
                href: '/auth/sign-up',
                perks: ['Fee discovery', 'EMI calculator', 'Loan matching'],
              },
              {
                icon: <Building2 size={24} />,
                role: 'Institutions',
                desc: 'One dashboard for lead-to-enrollment conversion, dropout-risk signals, fee collection tracking, and placement readiness.',
                cta: 'Institution sign up',
                href: '/auth/sign-up',
                perks: ['Student CRM', 'Analytics', 'Fee management'],
              },
              {
                icon: <Landmark size={24} />,
                role: 'Lenders',
                desc: 'Consent-based access to attendance patterns, academic consistency, engagement metrics, and institutional trust markers.',
                cta: 'Learn more',
                href: '/auth/sign-up',
                perks: ['Alt data signals', 'Verified demand', 'Low CAC'],
              },
            ].map((item) => (
              <div key={item.role} className="border border-background/20 rounded-2xl p-8 flex flex-col gap-5 hover:border-background/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-3">{item.role}</h3>
                  <p className="text-background/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
                {/* Perk pills */}
                <div className="flex flex-wrap gap-2">
                  {item.perks.map((p) => (
                    <span key={p} className="text-xs bg-background/10 border border-background/20 text-background/70 px-3 py-1 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
                <Link
                  href={item.href}
                  className="mt-auto flex items-center gap-2 text-sm font-medium text-background/80 hover:text-background transition"
                >
                  {item.cta} <ArrowUpRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="bg-background py-24 px-6 md:px-12" id="cta">
        <div className="max-w-6xl mx-auto">
          {/* Big bordered CTA box */}
          <div className="border border-border rounded-3xl p-12 md:p-16 relative overflow-hidden">
            {/* Decorative background circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-muted/60 pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-muted/40 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                {/* Mini icon row */}
                <div className="flex items-center gap-2 mb-5">
                  {[GraduationCap, Building2, Landmark, TrendingUp].map((Icon, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center -ml-1 first:ml-0">
                      <Icon size={13} className="text-muted-foreground" />
                    </div>
                  ))}
                  <span className="text-xs text-muted-foreground ml-2 font-medium">Join thousands already on PathWise</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
                  Ready to transform<br />student finance?
                </h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Join institutions and students already using PathWise to simplify education financing.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href="/auth/sign-up"
                  className="flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-full hover:bg-foreground/90 transition text-sm"
                >
                  Get started <ArrowUpRight size={14} />
                </Link>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 border border-border text-foreground font-semibold px-6 py-3 rounded-full hover:bg-muted transition text-sm"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="border-t border-border bg-background px-6 md:px-12 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <Logo href="/" />
            <p className="text-muted-foreground text-sm mt-3 max-w-xs">
              The operating system for student success — connecting engagement, affordability, and outcomes.
            </p>
            {/* Social row */}
            <div className="flex gap-2 mt-5">
              {['𝕏', 'in', 'f'].map((s) => (
                <div key={s} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground hover:border-foreground hover:text-foreground transition cursor-pointer">
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-12 text-sm">
            {[
              { heading: 'Product', links: ['Features', 'Pricing', 'Security'] },
              { heading: 'Company', links: ['About', 'Blog', 'Contact'] },
              { heading: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] },
            ].map((col) => (
              <div key={col.heading}>
                <p className="font-semibold text-foreground mb-3">{col.heading}</p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition">{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">© 2025 PathWise. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Built for India&apos;s 4.46 Cr students</p>
          </div>
        </div>
      </footer>

      {/* ── Global keyframes ── */}
      <style jsx global>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

    </main>
  )
}
