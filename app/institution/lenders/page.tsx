'use client'

import { useState } from 'react'
import { ArrowUpRight, CheckCircle2, Users, TrendingUp, IndianRupee } from 'lucide-react'

const lenders = [
  {
    id: '1',
    name: 'SBI Education Loan',
    bank: 'State Bank of India',
    type: 'Government Bank',
    status: 'active',
    studentsFinanced: 142,
    totalDisbursed: 48500000,
    avgLoanSize: 341549,
    interestRate: '8.15%',
    repaymentRate: 97.2,
    partnerSince: 'Jan 2023',
    contactPerson: 'Ramesh Iyer',
    contactEmail: 'ramesh.iyer@sbi.co.in',
    products: ['SBI Student Loan', 'SBI Scholar Loan', 'SBI Skill Loan'],
    badge: 'Preferred Partner',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: '2',
    name: 'Propelld',
    bank: 'Propelld Financial Services',
    type: 'Fintech NBFC',
    status: 'active',
    studentsFinanced: 89,
    totalDisbursed: 31200000,
    avgLoanSize: 350562,
    interestRate: '10.5%',
    repaymentRate: 95.8,
    partnerSince: 'Mar 2023',
    contactPerson: 'Ankit Sharma',
    contactEmail: 'ankit@propelld.com',
    products: ['Propelld Education Loan', 'Propelld Fast Track'],
    badge: 'Fastest Disbursal',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: '3',
    name: 'HDFC Credila',
    bank: 'HDFC Credila Financial Services',
    type: 'Specialised Lender',
    status: 'active',
    studentsFinanced: 67,
    totalDisbursed: 28900000,
    avgLoanSize: 431343,
    interestRate: '9.25%',
    repaymentRate: 98.1,
    partnerSince: 'Jun 2022',
    contactPerson: 'Meera Nair',
    contactEmail: 'meera.nair@hdfccredila.com',
    products: ['Credila Education Loan', 'Credila Abroad Loan'],
    badge: 'Highest Limit',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: '4',
    name: 'Avanse Financial',
    bank: 'Avanse Financial Services',
    type: 'NBFC',
    status: 'pending',
    studentsFinanced: 0,
    totalDisbursed: 0,
    avgLoanSize: 0,
    interestRate: '11.0%',
    repaymentRate: 0,
    partnerSince: 'Onboarding',
    contactPerson: 'Deepak Verma',
    contactEmail: 'deepak@avanse.com',
    products: ['Avanse Education Loan'],
    badge: 'New Partner',
    badgeColor: 'bg-orange-100 text-orange-700',
  },
]

export default function Lenders() {
  const [selected, setSelected] = useState<typeof lenders[0] | null>(null)

  if (selected) {
    return (
      <div className="space-y-6 max-w-3xl">
        <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground transition">
          ← Back to lenders
        </button>

        <div className="border border-border rounded-2xl p-8">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selected.badgeColor} mb-2 inline-block`}>{selected.badge}</span>
              <h1 className="text-2xl font-semibold text-foreground">{selected.name}</h1>
              <p className="text-muted-foreground text-sm">{selected.bank} · {selected.type}</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${selected.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {selected.status === 'active' ? 'Active Partner' : 'Onboarding'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Students Financed', value: selected.studentsFinanced || '—' },
              { label: 'Total Disbursed', value: selected.totalDisbursed ? `₹${(selected.totalDisbursed / 100000).toFixed(1)}L` : '—' },
              { label: 'Interest Rate', value: selected.interestRate },
              { label: 'Repayment Rate', value: selected.repaymentRate ? `${selected.repaymentRate}%` : '—' },
            ].map((s) => (
              <div key={s.label} className="border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className="font-semibold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Contact</p>
              <p className="font-medium text-foreground">{selected.contactPerson}</p>
              <p className="text-sm text-muted-foreground">{selected.contactEmail}</p>
              <p className="text-xs text-muted-foreground mt-1">Partner since {selected.partnerSince}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Products Offered</p>
              <div className="space-y-1.5">
                {selected.products.map((p) => (
                  <div key={p} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 size={12} className="text-green-500" />{p}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition">
              Contact Partner <ArrowUpRight size={13} />
            </button>
            <button className="flex items-center gap-2 border border-border rounded-full px-5 py-2.5 text-sm font-medium hover:bg-muted transition">
              View Agreement
            </button>
          </div>
        </div>
      </div>
    )
  }

  const totalDisbursed = lenders.reduce((s, l) => s + l.totalDisbursed, 0)
  const totalStudents = lenders.reduce((s, l) => s + l.studentsFinanced, 0)

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Partnerships</p>
          <h1 className="text-4xl font-semibold text-foreground">Lender Network</h1>
          <p className="text-muted-foreground mt-2 text-sm">{lenders.filter((l) => l.status === 'active').length} active partners · {totalStudents} students financed</p>
        </div>
        <button className="flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition">
          Add Lender <ArrowUpRight size={13} />
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Disbursed', value: `₹${(totalDisbursed / 10000000).toFixed(1)}Cr`, icon: <IndianRupee size={16} /> },
          { label: 'Students Financed', value: totalStudents, icon: <Users size={16} /> },
          { label: 'Avg Repayment Rate', value: '97.0%', icon: <TrendingUp size={16} /> },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-2xl p-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">{s.icon}</div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="font-semibold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {lenders.map((l) => (
          <div key={l.id} className="border border-border rounded-2xl p-6 hover:border-foreground/30 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{l.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${l.badgeColor}`}>{l.badge}</span>
                </div>
                <p className="text-xs text-muted-foreground">{l.type} · Since {l.partnerSince}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${l.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {l.status === 'active' ? 'Active' : 'Pending'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-y border-border">
              <div>
                <p className="text-xs text-muted-foreground">Students</p>
                <p className="font-semibold text-sm">{l.studentsFinanced || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Disbursed</p>
                <p className="font-semibold text-sm">{l.totalDisbursed ? `₹${(l.totalDisbursed / 100000).toFixed(0)}L` : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rate</p>
                <p className="font-semibold text-sm">{l.interestRate}</p>
              </div>
            </div>

            <button onClick={() => setSelected(l)}
              className="w-full flex items-center justify-center gap-1.5 border border-border rounded-full py-2 text-xs font-medium hover:bg-muted transition">
              View Details <ArrowUpRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
