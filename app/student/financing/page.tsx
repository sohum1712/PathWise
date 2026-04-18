'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Clock, Shield, TrendingDown } from 'lucide-react'

const lenders = [
  {
    id: '1',
    name: 'SBI Education Loan',
    bank: 'State Bank of India',
    type: 'Government Bank',
    minAmount: 400000,
    maxAmount: 15000000,
    interestRate: 8.15,
    processingFee: 0,
    tenure: '15 years',
    approvalDays: '7-10 days',
    badge: 'Lowest Rate',
    badgeColor: 'bg-green-100 text-green-700',
    features: ['No collateral up to ₹7.5L', 'Tax benefit under 80E', 'Moratorium during study', 'No prepayment penalty'],
    eligibility: '60% in qualifying exam',
    disbursedStudents: 12400,
    rating: 4.3,
  },
  {
    id: '2',
    name: 'Propelld Education Loan',
    bank: 'Propelld',
    type: 'Fintech NBFC',
    minAmount: 100000,
    maxAmount: 5000000,
    interestRate: 10.5,
    processingFee: 1.0,
    tenure: '10 years',
    approvalDays: '2-3 days',
    badge: 'Fastest Approval',
    badgeColor: 'bg-blue-100 text-blue-700',
    features: ['100% digital process', 'No branch visit needed', 'Instant in-principle approval', 'Flexible repayment'],
    eligibility: 'Admission letter required',
    disbursedStudents: 8200,
    rating: 4.5,
  },
  {
    id: '3',
    name: 'HDFC Credila',
    bank: 'HDFC Credila',
    type: 'Specialised Lender',
    minAmount: 200000,
    maxAmount: 20000000,
    interestRate: 9.25,
    processingFee: 1.0,
    tenure: '12 years',
    approvalDays: '5-7 days',
    badge: 'Highest Limit',
    badgeColor: 'bg-purple-100 text-purple-700',
    features: ['Covers all expenses', 'Study abroad supported', 'Co-applicant optional', 'Door-step service'],
    eligibility: 'Secured admission required',
    disbursedStudents: 22600,
    rating: 4.4,
  },
  {
    id: '4',
    name: 'Avanse Education Loan',
    bank: 'Avanse Financial',
    type: 'NBFC',
    minAmount: 100000,
    maxAmount: 7500000,
    interestRate: 11.0,
    processingFee: 1.5,
    tenure: '10 years',
    approvalDays: '3-5 days',
    badge: 'Best for Tier-2',
    badgeColor: 'bg-orange-100 text-orange-700',
    features: ['Tier-2 city friendly', 'Vocational courses covered', 'Part-time income considered', 'Online tracking'],
    eligibility: '50% in qualifying exam',
    disbursedStudents: 6800,
    rating: 4.2,
  },
]

const myApplications = [
  { lender: 'Propelld Education Loan', amount: 500000, status: 'Under Review', date: '12 Apr 2025', statusColor: 'bg-yellow-100 text-yellow-700' },
  { lender: 'SBI Education Loan', amount: 750000, status: 'Documents Pending', date: '08 Apr 2025', statusColor: 'bg-blue-100 text-blue-700' },
]

export default function Financing() {
  const [activeTab, setActiveTab] = useState<'explore' | 'applications'>('explore')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Finance</p>
          <h1 className="text-4xl font-semibold text-foreground">Education Financing</h1>
          <p className="text-muted-foreground mt-2 text-sm">Compare verified lenders and apply for the best education loan.</p>
        </div>
        <div className="flex gap-2">
          {(['explore', 'applications'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                activeTab === tab ? 'bg-foreground text-background' : 'border border-border text-muted-foreground hover:text-foreground'
              }`}>
              {tab === 'applications' ? `My Applications (${myApplications.length})` : 'Explore Lenders'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'explore' && (
        <>
          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <TrendingDown size={16} />, label: 'Lowest Rate', value: '8.15% p.a.' },
              { icon: <Clock size={16} />, label: 'Fastest Approval', value: '2-3 days' },
              { icon: <Shield size={16} />, label: 'Max Loan', value: '₹2 Crore' },
            ].map((s) => (
              <div key={s.label} className="border border-border rounded-2xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">{s.icon}</div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-semibold text-sm text-foreground">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Lender cards */}
          <div className="grid md:grid-cols-2 gap-5">
            {lenders.map((l) => (
              <div key={l.id} className="border border-border rounded-2xl p-6 hover:border-foreground/30 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{l.name}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${l.badgeColor}`}>{l.badge}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{l.bank} · {l.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-foreground">{l.interestRate}%</p>
                    <p className="text-xs text-muted-foreground">per annum</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-y border-border">
                  {[
                    { label: 'Loan Range', value: `₹${(l.minAmount/100000).toFixed(0)}L – ₹${(l.maxAmount/100000).toFixed(0)}L` },
                    { label: 'Processing Fee', value: l.processingFee === 0 ? 'NIL' : `${l.processingFee}%` },
                    { label: 'Max Tenure', value: l.tenure },
                    { label: 'Approval', value: l.approvalDays },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Key Features</p>
                  <div className="space-y-1.5">
                    {l.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-foreground">
                        <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{l.disbursedStudents.toLocaleString('en-IN')} students funded</p>
                  <button className="flex items-center gap-1.5 bg-foreground text-background rounded-full px-4 py-2 text-xs font-semibold hover:bg-foreground/90 transition">
                    Apply Now <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-4">How to choose the right lender</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { title: 'Compare effective rate', desc: 'Add processing fee to interest rate to get the true cost of borrowing.' },
                { title: 'Check moratorium period', desc: 'Most lenders offer repayment holiday during your study period + 6 months.' },
                { title: 'Verify tax benefits', desc: 'Interest paid on education loans is fully deductible under Section 80E.' },
              ].map((t) => (
                <div key={t.title}>
                  <p className="font-medium text-sm text-foreground mb-1">{t.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-4">
          {myApplications.map((app, i) => (
            <div key={i} className="border border-border rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-semibold text-foreground">{app.lender}</p>
                <p className="text-sm text-muted-foreground">Applied on {app.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">₹{app.amount.toLocaleString('en-IN')}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${app.statusColor}`}>{app.status}</span>
              </div>
            </div>
          ))}
          <div className="border border-dashed border-border rounded-2xl p-8 text-center">
            <p className="text-muted-foreground text-sm mb-3">Want to apply to more lenders?</p>
            <button onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition mx-auto">
              Explore Lenders <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
