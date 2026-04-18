'use client'

import { useState } from 'react'
import { Search, ArrowUpRight, Mail, Phone } from 'lucide-react'

const students = [
  { id: '1', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', phone: '+91 98201 34567', status: 'enrolled', program: 'B.Tech CSE', appliedDate: '2025-01-15', city: 'Mumbai', loanStatus: 'Approved', loanAmount: 350000, score: 89.2 },
  { id: '2', name: 'Rahul Gupta', email: 'rahul.gupta@gmail.com', phone: '+91 97654 23456', status: 'admitted', program: 'MBA Analytics', appliedDate: '2025-02-03', city: 'Delhi', loanStatus: 'Disbursed', loanAmount: 560000, score: 82.5 },
  { id: '3', name: 'Ananya Patel', email: 'ananya.patel@gmail.com', phone: '+91 96543 12345', status: 'applied', program: 'B.Sc Data Science', appliedDate: '2025-03-10', city: 'Ahmedabad', loanStatus: 'Under Review', loanAmount: 280000, score: 78.0 },
  { id: '4', name: 'Karan Mehta', email: 'karan.mehta@gmail.com', phone: '+91 95432 01234', status: 'inquiry', program: 'B.Tech ECE', appliedDate: '2025-04-01', city: 'Pune', loanStatus: 'Not Applied', loanAmount: 0, score: 74.5 },
  { id: '5', name: 'Sneha Reddy', email: 'sneha.reddy@gmail.com', phone: '+91 94321 90123', status: 'enrolled', program: 'MBA Analytics', appliedDate: '2025-01-20', city: 'Hyderabad', loanStatus: 'Approved', loanAmount: 560000, score: 91.0 },
  { id: '6', name: 'Arjun Singh', email: 'arjun.singh@gmail.com', phone: '+91 93210 89012', status: 'admitted', program: 'M.Tech AI', appliedDate: '2025-02-14', city: 'Bangalore', loanStatus: 'Documents Pending', loanAmount: 420000, score: 85.3 },
  { id: '7', name: 'Divya Nair', email: 'divya.nair@gmail.com', phone: '+91 92109 78901', status: 'applied', program: 'B.Tech CSE', appliedDate: '2025-03-22', city: 'Chennai', loanStatus: 'Not Applied', loanAmount: 0, score: 80.1 },
  { id: '8', name: 'Rohan Joshi', email: 'rohan.joshi@gmail.com', phone: '+91 91098 67890', status: 'inquiry', program: 'BCA Cloud', appliedDate: '2025-04-08', city: 'Jaipur', loanStatus: 'Not Applied', loanAmount: 0, score: 68.4 },
  { id: '9', name: 'Meera Iyer', email: 'meera.iyer@gmail.com', phone: '+91 90987 56789', status: 'enrolled', program: 'B.Sc Data Science', appliedDate: '2025-01-08', city: 'Coimbatore', loanStatus: 'Disbursed', loanAmount: 280000, score: 88.7 },
  { id: '10', name: 'Vikram Rao', email: 'vikram.rao@gmail.com', phone: '+91 89876 45678', status: 'applied', program: 'M.Tech AI', appliedDate: '2025-03-05', city: 'Pune', loanStatus: 'Under Review', loanAmount: 420000, score: 83.9 },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  inquiry:  { label: 'Inquiry',  color: 'bg-yellow-100 text-yellow-700' },
  applied:  { label: 'Applied',  color: 'bg-blue-100 text-blue-700' },
  admitted: { label: 'Admitted', color: 'bg-purple-100 text-purple-700' },
  enrolled: { label: 'Enrolled', color: 'bg-green-100 text-green-700' },
}

const loanStatusColor: Record<string, string> = {
  'Approved': 'text-green-600',
  'Disbursed': 'text-green-700',
  'Under Review': 'text-yellow-600',
  'Documents Pending': 'text-orange-600',
  'Not Applied': 'text-muted-foreground',
}

export default function InstitutionCRM() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof students[0] | null>(null)

  const counts = {
    all: students.length,
    inquiry: students.filter((s) => s.status === 'inquiry').length,
    applied: students.filter((s) => s.status === 'applied').length,
    admitted: students.filter((s) => s.status === 'admitted').length,
    enrolled: students.filter((s) => s.status === 'enrolled').length,
  }

  const filtered = students.filter((s) => {
    const matchFilter = filter === 'all' || s.status === filter
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.program.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  if (selected) {
    return (
      <div className="space-y-6 max-w-2xl">
        <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground transition">
          ← Back to CRM
        </button>
        <div className="border border-border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center text-xl font-semibold shrink-0">
              {selected.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{selected.name}</h1>
              <p className="text-muted-foreground text-sm">{selected.program} · {selected.city}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${statusConfig[selected.status].color}`}>
                {statusConfig[selected.status].label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: 'Email', value: selected.email, icon: <Mail size={13} /> },
              { label: 'Phone', value: selected.phone, icon: <Phone size={13} /> },
              { label: 'Applied On', value: new Date(selected.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
              { label: 'Score / %', value: `${selected.score}%` },
              { label: 'Loan Status', value: selected.loanStatus },
              { label: 'Loan Amount', value: selected.loanAmount ? `₹${selected.loanAmount.toLocaleString('en-IN')}` : 'N/A' },
            ].map((item) => (
              <div key={item.label} className="border border-border rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  {item.icon}<span className="text-xs">{item.label}</span>
                </div>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition">
              <Mail size={13} /> Send Email
            </button>
            <button className="flex items-center gap-2 border border-border rounded-full px-5 py-2.5 text-sm font-medium hover:bg-muted transition">
              Update Status
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Management</p>
        <h1 className="text-4xl font-semibold text-foreground">Student CRM</h1>
        <p className="text-muted-foreground mt-2 text-sm">{students.length} students in pipeline</p>
      </div>

      {/* Pipeline cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'inquiry', label: 'Inquiries' },
          { key: 'applied', label: 'Applications' },
          { key: 'admitted', label: 'Admitted' },
          { key: 'enrolled', label: 'Enrolled' },
        ].map((item) => (
          <button key={item.key} onClick={() => setFilter(filter === item.key ? 'all' : item.key)}
            className={`border rounded-2xl p-5 text-left transition-all ${filter === item.key ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/30'}`}>
            <p className={`text-xs mb-1 ${filter === item.key ? 'text-background/60' : 'text-muted-foreground'}`}>{item.label}</p>
            <p className="text-3xl font-semibold">{counts[item.key as keyof typeof counts]}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, program, or city…"
          className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
      </div>

      {/* Table */}
      <div className="border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              {['Student', 'Program', 'City', 'Score', 'Loan Status', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold shrink-0">
                      {s.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.program}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.city}</td>
                <td className="px-4 py-3 font-medium">{s.score}%</td>
                <td className={`px-4 py-3 text-xs font-medium ${loanStatusColor[s.loanStatus]}`}>{s.loanStatus}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusConfig[s.status].color}`}>
                    {statusConfig[s.status].label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelected(s)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
                    View <ArrowUpRight size={11} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">No students match your search.</div>
        )}
      </div>
    </div>
  )
}
