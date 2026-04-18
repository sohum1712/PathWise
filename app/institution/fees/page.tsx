'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, AlertCircle, IndianRupee } from 'lucide-react'

const feeStructures = [
  {
    program: 'B.Tech CSE',
    year: 1,
    tuition: 280000,
    hostel: 60000,
    exam: 5000,
    library: 3000,
    misc: 2000,
    dueDate: '2025-07-15',
    collected: 95,
  },
  {
    program: 'B.Tech CSE',
    year: 2,
    tuition: 280000,
    hostel: 60000,
    exam: 5000,
    library: 3000,
    misc: 2000,
    dueDate: '2025-07-15',
    collected: 88,
  },
  {
    program: 'MBA Analytics',
    year: 1,
    tuition: 480000,
    hostel: 65000,
    exam: 8000,
    library: 5000,
    misc: 2000,
    dueDate: '2025-06-30',
    collected: 100,
  },
  {
    program: 'MBA Analytics',
    year: 2,
    tuition: 480000,
    hostel: 65000,
    exam: 8000,
    library: 5000,
    misc: 2000,
    dueDate: '2025-06-30',
    collected: 72,
  },
  {
    program: 'B.Sc Data Science',
    year: 1,
    tuition: 220000,
    hostel: 55000,
    exam: 4000,
    library: 2500,
    misc: 1500,
    dueDate: '2025-08-01',
    collected: 91,
  },
]

const recentTransactions = [
  { student: 'Priya Sharma', program: 'B.Tech CSE', amount: 350000, date: '14 Apr 2025', method: 'UPI', status: 'Completed' },
  { student: 'Rahul Gupta', program: 'MBA Analytics', amount: 560000, date: '13 Apr 2025', method: 'Bank Transfer', status: 'Completed' },
  { student: 'Ananya Patel', program: 'B.Sc Data Science', amount: 283000, date: '12 Apr 2025', method: 'Card', status: 'Completed' },
  { student: 'Karan Mehta', program: 'B.Tech CSE', amount: 350000, date: '11 Apr 2025', method: 'UPI', status: 'Pending' },
  { student: 'Sneha Reddy', program: 'MBA Analytics', amount: 560000, date: '10 Apr 2025', method: 'Loan Disbursement', status: 'Completed' },
]

export default function Fees() {
  const [activeProgram, setActiveProgram] = useState('All')
  const programs = ['All', ...Array.from(new Set(feeStructures.map((f) => f.program)))]

  const filtered = activeProgram === 'All' ? feeStructures : feeStructures.filter((f) => f.program === activeProgram)
  const totalCollected = recentTransactions.filter((t) => t.status === 'Completed').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Finance</p>
        <h1 className="text-4xl font-semibold text-foreground">Fee Management</h1>
        <p className="text-muted-foreground mt-2 text-sm">Track fee structures, collection rates, and payment history.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Collected This Month', value: `₹${(totalCollected / 100000).toFixed(1)}L`, icon: <IndianRupee size={16} />, sub: '5 transactions' },
          { label: 'Collection Rate', value: '89.2%', icon: <CheckCircle2 size={16} />, sub: 'Across all programs' },
          { label: 'Pending Dues', value: '₹12.4L', icon: <Clock size={16} />, sub: '8 students' },
          { label: 'Overdue', value: '₹2.1L', icon: <AlertCircle size={16} />, sub: '3 students' },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">{s.icon}<span className="text-xs">{s.label}</span></div>
            <p className="text-2xl font-semibold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Fee structures */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-semibold text-foreground">Fee Structures</h2>
          <div className="flex gap-2 flex-wrap">
            {programs.map((p) => (
              <button key={p} onClick={() => setActiveProgram(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeProgram === p ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {['Program', 'Year', 'Tuition', 'Hostel', 'Other', 'Total', 'Due Date', 'Collection'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((f, i) => {
                const total = f.tuition + f.hostel + f.exam + f.library + f.misc
                return (
                  <tr key={i} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{f.program}</td>
                    <td className="px-4 py-3 text-muted-foreground">Year {f.year}</td>
                    <td className="px-4 py-3">₹{(f.tuition / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3">₹{(f.hostel / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3">₹{((f.exam + f.library + f.misc) / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3 font-semibold text-foreground">₹{(total / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(f.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-foreground rounded-full" style={{ width: `${f.collected}%` }} />
                        </div>
                        <span className="text-xs font-medium">{f.collected}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent transactions */}
      <div>
        <h2 className="font-semibold text-foreground mb-4">Recent Transactions</h2>
        <div className="border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {['Student', 'Program', 'Amount', 'Date', 'Method', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentTransactions.map((t, i) => (
                <tr key={i} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{t.student}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.program}</td>
                  <td className="px-4 py-3 font-semibold">₹{t.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.method}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      t.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
