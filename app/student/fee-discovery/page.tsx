'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Star, Users, TrendingUp, ArrowUpRight, BookOpen, Award } from 'lucide-react'

const institutions = [
  {
    id: '1',
    name: 'Indian Institute of Technology, Delhi',
    shortName: 'IIT Delhi',
    type: 'Engineering',
    location: 'New Delhi',
    state: 'Delhi',
    annualFees: 224000,
    rating: 4.9,
    totalStudents: 8500,
    programs: 14,
    placement: 98,
    avgPackage: 2100000,
    established: 1961,
    accreditation: 'NAAC A++',
    description: 'Premier engineering institution ranked #1 in India, known for cutting-edge research and exceptional industry placements.',
    topPrograms: ['B.Tech CSE', 'B.Tech EE', 'M.Tech AI', 'PhD Research'],
    facilities: ['Research Labs', 'Sports Complex', 'Hostel', 'Library'],
    color: 'from-blue-600 to-blue-800',
  },
  {
    id: '2',
    name: 'Indian Institute of Management, Ahmedabad',
    shortName: 'IIM-A',
    type: 'Business',
    location: 'Ahmedabad',
    state: 'Gujarat',
    annualFees: 1150000,
    rating: 4.9,
    totalStudents: 1200,
    programs: 6,
    placement: 100,
    avgPackage: 3500000,
    established: 1961,
    accreditation: 'AACSB, EQUIS',
    description: 'India\'s top business school with a legacy of producing world-class business leaders and entrepreneurs.',
    topPrograms: ['PGP MBA', 'PGPX', 'FPM', 'Executive MBA'],
    facilities: ['Case Study Rooms', 'Bloomberg Terminal', 'Incubation Centre', 'Hostel'],
    color: 'from-red-600 to-red-800',
  },
  {
    id: '3',
    name: 'Vellore Institute of Technology',
    shortName: 'VIT Vellore',
    type: 'Engineering',
    location: 'Vellore',
    state: 'Tamil Nadu',
    annualFees: 198000,
    rating: 4.6,
    totalStudents: 35000,
    programs: 28,
    placement: 92,
    avgPackage: 720000,
    established: 1984,
    accreditation: 'NAAC A++',
    description: 'One of India\'s largest private universities with strong industry connections and a vibrant campus life.',
    topPrograms: ['B.Tech CSE', 'B.Tech Mech', 'B.Tech ECE', 'MCA'],
    facilities: ['Tech Park', 'Olympic Pool', 'Hostel', '24/7 Library'],
    color: 'from-purple-600 to-purple-800',
  },
  {
    id: '4',
    name: 'Symbiosis Institute of Business Management',
    shortName: 'SIBM Pune',
    type: 'Business',
    location: 'Pune',
    state: 'Maharashtra',
    annualFees: 875000,
    rating: 4.5,
    totalStudents: 2400,
    programs: 8,
    placement: 96,
    avgPackage: 1450000,
    established: 1978,
    accreditation: 'NAAC A',
    description: 'Top-ranked private B-school in Pune with strong alumni network across Fortune 500 companies.',
    topPrograms: ['MBA', 'MBA Finance', 'MBA Marketing', 'MBA HR'],
    facilities: ['Bloomberg Lab', 'Amphitheatre', 'Hostel', 'Sports Ground'],
    color: 'from-green-600 to-green-800',
  },
  {
    id: '5',
    name: 'Manipal Academy of Higher Education',
    shortName: 'MAHE Manipal',
    type: 'Medical & Engineering',
    location: 'Manipal',
    state: 'Karnataka',
    annualFees: 320000,
    rating: 4.5,
    totalStudents: 28000,
    programs: 35,
    placement: 89,
    avgPackage: 680000,
    established: 1953,
    accreditation: 'NAAC A+',
    description: 'Deemed university offering diverse programs in medicine, engineering, and management with global exposure.',
    topPrograms: ['MBBS', 'B.Tech CSE', 'BDS', 'B.Pharm'],
    facilities: ['Teaching Hospital', 'Research Centre', 'Hostel', 'International Centre'],
    color: 'from-orange-600 to-orange-800',
  },
  {
    id: '6',
    name: 'Delhi School of Economics',
    shortName: 'DSE Delhi',
    type: 'Arts & Science',
    location: 'New Delhi',
    state: 'Delhi',
    annualFees: 28000,
    rating: 4.7,
    totalStudents: 1800,
    programs: 5,
    placement: 94,
    avgPackage: 980000,
    established: 1949,
    accreditation: 'NAAC A++',
    description: 'Prestigious economics school under Delhi University, producing top economists, civil servants, and researchers.',
    topPrograms: ['M.A. Economics', 'M.Com', 'MBA', 'Ph.D Economics'],
    facilities: ['Research Library', 'Seminar Rooms', 'Computer Lab', 'Cafeteria'],
    color: 'from-teal-600 to-teal-800',
  },
]

const types = ['All', 'Engineering', 'Business', 'Medical & Engineering', 'Arts & Science']

export default function FeeDiscovery() {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedInstitution, setSelectedInstitution] = useState<typeof institutions[0] | null>(null)

  const filtered = institutions.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase()) ||
      i.shortName.toLowerCase().includes(search.toLowerCase())
    const matchType = selectedType === 'All' || i.type === selectedType
    return matchSearch && matchType
  })

  if (selectedInstitution) {
    return (
      <div className="space-y-8">
        {/* Back */}
        <button onClick={() => setSelectedInstitution(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
          ← Back to results
        </button>

        {/* Hero banner */}
        <div className={`bg-gradient-to-r ${selectedInstitution.color} rounded-2xl p-8 text-white`}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-white/60 text-sm mb-1">{selectedInstitution.accreditation}</p>
              <h1 className="text-3xl font-semibold mb-2">{selectedInstitution.name}</h1>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1"><MapPin size={13} />{selectedInstitution.location}, {selectedInstitution.state}</span>
                <span>Est. {selectedInstitution.established}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{selectedInstitution.type}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs mb-1">Annual Fees</p>
              <p className="text-3xl font-semibold">₹{selectedInstitution.annualFees.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <p className="mt-4 text-white/70 text-sm max-w-2xl">{selectedInstitution.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Rating', value: `⭐ ${selectedInstitution.rating}`, sub: 'Student rating' },
            { label: 'Placement', value: `${selectedInstitution.placement}%`, sub: 'Placement rate' },
            { label: 'Avg Package', value: `₹${(selectedInstitution.avgPackage / 100000).toFixed(1)}L`, sub: 'Per annum' },
            { label: 'Students', value: selectedInstitution.totalStudents.toLocaleString('en-IN'), sub: 'Enrolled' },
          ].map((s) => (
            <div key={s.label} className="border border-border rounded-2xl p-5">
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className="text-2xl font-semibold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Programs */}
          <div className="border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><BookOpen size={16} /> Top Programs</h2>
            <div className="space-y-3">
              {selectedInstitution.topPrograms.map((p) => (
                <div key={p} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{p}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Available</span>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Award size={16} /> Campus Facilities</h2>
            <div className="grid grid-cols-2 gap-3">
              {selectedInstitution.facilities.map((f) => (
                <div key={f} className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                  <span className="text-sm text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground">Interested in {selectedInstitution.shortName}?</p>
            <p className="text-sm text-muted-foreground">Calculate your EMI or explore financing options</p>
          </div>
          <div className="flex gap-3">
            <Link href={`/student/emi-calculator?fees=${selectedInstitution.annualFees}`}
              className="flex items-center gap-2 border border-border rounded-full px-5 py-2.5 text-sm font-medium hover:bg-muted transition">
              Calculate EMI
            </Link>
            <Link href="/student/financing"
              className="flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition">
              Apply for Loan <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Explore</p>
        <h1 className="text-4xl font-semibold text-foreground">Fee Discovery</h1>
        <p className="text-muted-foreground mt-2 text-sm">Browse top institutions, compare fees, and find the right fit.</p>
      </div>

      {/* Search + Filter */}
      <div className="border border-border rounded-2xl p-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, city, or short name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button key={t} onClick={() => setSelectedType(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedType === t ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">Showing {filtered.length} institutions</p>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((inst) => (
          <div key={inst.id} className="border border-border rounded-2xl overflow-hidden hover:border-foreground/30 hover:shadow-sm transition-all group">
            {/* Color bar */}
            <div className={`bg-gradient-to-r ${inst.color} p-5`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/60 text-xs mb-1">{inst.accreditation}</p>
                  <h3 className="text-white font-semibold text-sm leading-snug">{inst.shortName}</h3>
                  <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1"><MapPin size={10} />{inst.location}</p>
                </div>
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{inst.type}</span>
              </div>
            </div>

            <div className="p-5">
              <p className="text-xs text-muted-foreground mb-1">Annual Fees</p>
              <p className="text-2xl font-semibold text-foreground mb-4">₹{inst.annualFees.toLocaleString('en-IN')}</p>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-semibold text-sm flex items-center gap-0.5"><Star size={11} className="fill-foreground" />{inst.rating}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Programs</p>
                  <p className="font-semibold text-sm">{inst.programs}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Placement</p>
                  <p className="font-semibold text-sm">{inst.placement}%</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setSelectedInstitution(inst)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-foreground text-background rounded-full py-2 text-xs font-semibold hover:bg-foreground/90 transition">
                  View Details <ArrowUpRight size={12} />
                </button>
                <Link href={`/student/emi-calculator?fees=${inst.annualFees}`}
                  className="flex items-center justify-center border border-border rounded-full px-3 py-2 text-xs font-medium hover:bg-muted transition">
                  EMI
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
