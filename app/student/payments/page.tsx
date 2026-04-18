'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, AlertCircle, ArrowUpRight, Download } from 'lucide-react'

const payments = [
  { id: '1', description: 'Semester 1 Tuition Fee', amount: 175000, status: 'completed', date: '2024-08-10', method: 'Bank Transfer', ref: 'TXN2408100012' },
  { id: '2', description: 'Hostel Fee — Sem 1', amount: 30000, status: 'completed', date: '2024-08-12', method: 'UPI', ref: 'TXN2408120034' },
  { id: '3', description: 'Exam & Library Fee', amount: 8000, status: 'completed', date: '2024-08-15', method: 'Card', ref: 'TXN2408150056' },
  { id: '4', description: 'Semester 2 Tuition Fee', amount: 175000, status: 'completed', date: '2025-01-08', method: 'Loan Disbursement', ref: 'TXN2501080078' },
  { id: '5', description: 'Hostel Fee — Sem 2', amount: 30000, status: 'completed', date: '2025-01-10', method: 'UPI', ref: 'TXN2501100090' },
  { id: '6', description: 'Semester 3 Tuition Fee', amount: 175000, status: 'upcoming', date: '2025-07-15', method: '—', ref: '—' },
  { id: '7', description: 'Hostel Fee — Sem 3', amount: 30000, status: 'upcoming', date: '2025-07-20', method: '—', ref: '—' },
  { id: '8', description: 'Exam & Library Fee', amount: 8000, status: 'upcoming', date: '2025-08-01', method: '—', ref: '—' },
]

const emiSchedule = [
  { month: 'Feb 2025', amount: 14200, status: 'paid', date: '05 Feb 2025' },
  { month: 'Mar 2025', amount: 14200, status: 'paid', date: '05 Mar 2025' },
  { month: 'Apr 2025', amount: 14200, status: 'paid', date: '05 Apr 2025' },
  { month: 'May 2025', amount: 14200, status: 'upcoming', date: '05 May 2025' },
  { month: 'Jun 2025', amount: 14200, status: 'upcoming', date: '05 Jun 2025' },
  { month: 'Jul 2025', amount: 14200, status: 'upcoming', date: '05 Jul 2025' },
]

const statusConfig = {
  completed: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={13} /> },
  upcoming:  { label: 'Upcoming', color: 'bg-blue-100 text-blue-700', icon: <Clock size={13} /> },
  overdue:   { label: 'Overdue', color: 'bg-red-100 text-red-700', icon: <AlertCircle size={13} /> },
  paid:      { label: 'Paid', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={13} /> },
}

export default function Payments() {
  const [activeTab, setActiveTab] = useState<'fees' | 'emi'>('fees')

  const completed = payments.filter((p) => p.status === 'completed')
  const upcoming = payments.filter((p) => p.status === 'upcoming')
  const totalPaid = completed.reduce((s, p) => s + p.amount, 0)
  const totalDue = upcoming.reduce((s, p) => s + p.amount, 0)
  const nextPayment = upcoming[0]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Finance</p>
          <h1 className="text-4xl font-semibold text-foreground">Payment Tracker</h1>
          <p className="text-muted-foreground mt-2 text-sm">B.Tech CSE · Year 2 · SBI Education Loan</p>
        </div>
        <div className="flex gap-2">
          {(['fees', 'emi'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                activeTab === tab ? 'bg-foreground text-background' : 'border border-border text-muted-foreground hover:text-foreground'
              }`}>
              {tab === 'fees' ? 'Fee Payments' : 'EMI Schedule'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Paid', value: `₹${(totalPaid / 100000).toFixed(1)}L`, sub: `${completed.length} transactions`, icon: <CheckCircle2 size={15} /> },
          { label: 'Upcoming Dues', value: `₹${(totalDue / 100000).toFixed(1)}L`, sub: `${upcoming.length} payments`, icon: <Clock size={15} /> },
          { label: 'Next Due', value: nextPayment ? `₹${nextPayment.amount.toLocaleString('en-IN')}` : '—', sub: nextPayment ? new Date(nextPayment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '', icon: <AlertCircle size={15} /> },
          { label: 'Loan EMI', value: '₹14,200', sub: 'Monthly · SBI', icon: <ArrowUpRight size={15} /> },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-2xl p-5">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-2">{s.icon}<span className="text-xs">{s.label}</span></div>
            <p className="text-2xl font-semibold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {activeTab === 'fees' && (
        <>
          {/* Completed */}
          <div>
            <h2 className="font-semibold text-foreground mb-3">Completed Payments</h2>
            <div className="border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {['Description', 'Amount', 'Date', 'Method', 'Reference', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {completed.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{p.description}</td>
                      <td className="px-4 py-3 font-semibold">₹{p.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.method}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{p.ref}</td>
                      <td className="px-4 py-3">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
                          <Download size={11} /> Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming */}
          <div>
            <h2 className="font-semibold text-foreground mb-3">Upcoming Payments</h2>
            <div className="space-y-3">
              {upcoming.map((p) => (
                <div key={p.id} className="border border-border rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-medium text-foreground">{p.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Due {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-foreground">₹{p.amount.toLocaleString('en-IN')}</p>
                    <button className="flex items-center gap-1.5 bg-foreground text-background rounded-full px-4 py-2 text-xs font-semibold hover:bg-foreground/90 transition">
                      Pay Now <ArrowUpRight size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'emi' && (
        <div>
          <div className="border border-border rounded-2xl p-6 mb-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Lender', value: 'SBI Education Loan' },
                { label: 'Loan Amount', value: '₹5,00,000' },
                { label: 'Interest Rate', value: '8.15% p.a.' },
                { label: 'Tenure', value: '10 years' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xs text-muted-foreground mb-0.5">{s.label}</p>
                  <p className="font-semibold text-sm text-foreground">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {['Month', 'EMI Amount', 'Due Date', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {emiSchedule.map((e, i) => {
                  const cfg = statusConfig[e.status as keyof typeof statusConfig]
                  return (
                    <tr key={i} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{e.month}</td>
                      <td className="px-4 py-3 font-semibold">₹{e.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${cfg.color}`}>
                          {cfg.icon}{cfg.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
