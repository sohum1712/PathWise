'use client'

import Link from 'next/link'
import { ArrowUpRight, GraduationCap, Award, FileText } from 'lucide-react'

const destinations = [
  { country: 'United States', flag: '🇺🇸', students: '3.3L+', avgCost: '₹35–55L/yr', highlight: 'OPT work permit · Top research unis' },
  { country: 'United Kingdom', flag: '🇬🇧', students: '1.3L+', avgCost: '₹25–40L/yr', highlight: '2-yr post-study work visa' },
  { country: 'Canada',         flag: '🇨🇦', students: '1.9L+', avgCost: '₹18–30L/yr', highlight: 'PR pathway · PGWP 3 yrs' },
  { country: 'Australia',      flag: '🇦🇺', students: '1.0L+', avgCost: '₹20–35L/yr', highlight: '2–4 yr post-study rights' },
  { country: 'Germany',        flag: '🇩🇪', students: '43K+',  avgCost: '₹3–8L/yr',   highlight: 'Near-zero tuition fees' },
  { country: 'Ireland',        flag: '🇮🇪', students: '18K+',  avgCost: '₹20–30L/yr', highlight: '2-yr stay-back option' },
]

const modules = [
  {
    href: '/student/abroad/universities',
    icon: <GraduationCap size={20} />,
    label: 'Universities',
    count: '8 institutions',
    desc: 'Browse top-ranked universities across USA, UK, Canada, Australia & Germany. Compare fees, acceptance rates, and programs.',
  },
  {
    href: '/student/abroad/scholarships',
    icon: <Award size={20} />,
    label: 'Scholarships',
    count: '12 scholarships',
    desc: 'Government schemes, university grants, and private funding — for Indians going abroad and studying in India.',
  },
  {
    href: '/student/abroad/visa',
    icon: <FileText size={20} />,
    label: 'Visa & Consultants',
    count: '6 consultants · 4 guides',
    desc: 'Verified consultants, step-by-step visa guides, document checklists, and interview tips for every major destination.',
  },
]

const steps = [
  { n: '01', title: 'Pick a destination', desc: 'Research countries, costs, and post-study work rights.' },
  { n: '02', title: 'Apply for scholarships', desc: 'Most deadlines are 12–18 months before intake.' },
  { n: '03', title: 'Secure admission', desc: 'SOP, LORs, transcripts, GRE/IELTS/TOEFL.' },
  { n: '04', title: 'Arrange financing', desc: 'SBI Global Ed-Vantage, HDFC Credila, Prodigy Finance.' },
  { n: '05', title: 'Apply for visa', desc: 'Work with a verified consultant for your visa interview.' },
  { n: '06', title: 'Travel & settle', desc: 'Book flights, arrange accommodation, pre-departure prep.' },
]

export default function AbroadHub() {
  return (
    <div className="space-y-14">

      {/* Page header */}
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Global Education</p>
        <h1 className="text-4xl font-semibold text-foreground leading-tight mb-3">
          Everything you need to study abroad.
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Universities, scholarships, visa guidance, and financing — all in one place for Indian students planning international education.
        </p>
        <div className="flex gap-3 mt-6">
          <Link href="/student/abroad/universities"
            className="flex items-center gap-2 bg-foreground text-background font-semibold px-5 py-2.5 rounded-full hover:bg-foreground/90 transition text-sm">
            Browse Universities <ArrowUpRight size={13} />
          </Link>
          <Link href="/student/abroad/scholarships"
            className="flex items-center gap-2 border border-border text-foreground font-medium px-5 py-2.5 rounded-full hover:bg-muted transition text-sm">
            Find Scholarships
          </Link>
        </div>
      </div>

      {/* 3 module cards */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">Explore</p>
        <div className="grid md:grid-cols-3 gap-4">
          {modules.map((m) => (
            <Link key={m.href} href={m.href}
              className="border border-border rounded-2xl p-6 hover:border-foreground/30 hover:shadow-sm transition-all group flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                  {m.icon}
                </div>
                <ArrowUpRight size={15} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-0.5">{m.label}</p>
                <p className="text-xs text-muted-foreground mb-2">{m.count}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Destinations — simple table-style rows */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">Popular destinations</p>
        <div className="border border-border rounded-2xl overflow-hidden">
          {destinations.map((d, i) => (
            <div key={d.country}
              className={`flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors ${
                i < destinations.length - 1 ? 'border-b border-border' : ''
              }`}>
              <div className="flex items-center gap-4">
                <span className="text-2xl">{d.flag}</span>
                <div>
                  <p className="font-medium text-foreground text-sm">{d.country}</p>
                  <p className="text-xs text-muted-foreground">{d.highlight}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 text-right">
                <div className="hidden md:block">
                  <p className="text-xs text-muted-foreground">Indian students</p>
                  <p className="text-sm font-medium text-foreground">{d.students}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg cost/yr</p>
                  <p className="text-sm font-medium text-foreground">{d.avgCost}</p>
                </div>
                <Link href="/student/abroad/universities"
                  className="hidden md:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
                  View unis <ArrowUpRight size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap — horizontal steps */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">Your roadmap</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {steps.map((s) => (
            <div key={s.n} className="border border-border rounded-2xl p-5">
              <span className="text-xs font-semibold text-muted-foreground block mb-2">{s.n}</span>
              <p className="font-medium text-foreground text-sm mb-1">{s.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Loan nudge — single clean banner */}
      <div className="border border-border rounded-2xl p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Financing</p>
          <p className="font-semibold text-foreground mb-1">Need a loan for abroad studies?</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            SBI Global Ed-Vantage, HDFC Credila, and Prodigy Finance offer up to ₹1.5 Cr for international education.
          </p>
        </div>
        <Link href="/student/financing"
          className="shrink-0 flex items-center gap-2 bg-foreground text-background font-semibold px-5 py-2.5 rounded-full hover:bg-foreground/90 transition text-sm">
          Explore Loans <ArrowUpRight size={13} />
        </Link>
      </div>

    </div>
  )
}
