'use client'

import { useState } from 'react'
import { Search, MapPin, ArrowUpRight, BookOpen, Users, Award } from 'lucide-react'

const universities = [
  {
    id: '1', name: 'Massachusetts Institute of Technology', shortName: 'MIT',
    country: 'USA', city: 'Cambridge, MA', flag: '🇺🇸',
    qsRank: 1, usNewsRank: 2,
    annualTuition: 5700000, livingCost: 2200000,
    acceptanceRate: 3.9, avgGRE: 167, avgIELTS: 7.0,
    programs: ['MS Computer Science', 'MS Electrical Eng.', 'MBA Sloan', 'PhD AI/ML'],
    intakes: ['September'],
    scholarships: ['MIT Fellowship', 'RA/TA Funding', 'Need-based Aid'],
    indianStudents: 1200,
    rating: 5.0,
    description: 'World\'s top STEM university with unmatched research output and Silicon Valley connections.',
    deadline: 'Dec 15, 2025',
    type: 'Private',
    color: 'from-red-900/40 to-red-800/20',
  },
  {
    id: '2', name: 'University of Toronto', shortName: 'UofT',
    country: 'Canada', city: 'Toronto, ON', flag: '🇨🇦',
    qsRank: 21, usNewsRank: 18,
    annualTuition: 2800000, livingCost: 1400000,
    acceptanceRate: 43, avgGRE: 158, avgIELTS: 6.5,
    programs: ['MS Data Science', 'MBA Rotman', 'MS Computer Science', 'MEng'],
    intakes: ['September', 'January'],
    scholarships: ['Lester B. Pearson', 'UofT Excellence Award', 'Ontario Graduate Scholarship'],
    indianStudents: 8400,
    rating: 4.7,
    description: 'Canada\'s top university with strong post-study work permit pathways and diverse campus.',
    deadline: 'Jan 15, 2026',
    type: 'Public',
    color: 'from-blue-900/40 to-blue-800/20',
  },
  {
    id: '3', name: 'University of Oxford', shortName: 'Oxford',
    country: 'UK', city: 'Oxford', flag: '🇬🇧',
    qsRank: 3, usNewsRank: 5,
    annualTuition: 3800000, livingCost: 1800000,
    acceptanceRate: 17, avgGRE: 0, avgIELTS: 7.5,
    programs: ['MSc Computer Science', 'MBA Saïd', 'MSc Financial Economics', 'DPhil'],
    intakes: ['October'],
    scholarships: ['Rhodes Scholarship', 'Clarendon Fund', 'Oxford-Weidenfeld'],
    indianStudents: 2100,
    rating: 4.9,
    description: 'One of the world\'s oldest universities with exceptional research and alumni network.',
    deadline: 'Jan 20, 2026',
    type: 'Public',
    color: 'from-indigo-900/40 to-indigo-800/20',
  },
  {
    id: '4', name: 'Technical University of Munich', shortName: 'TU Munich',
    country: 'Germany', city: 'Munich', flag: '🇩🇪',
    qsRank: 37, usNewsRank: 42,
    annualTuition: 280000, livingCost: 1100000,
    acceptanceRate: 8, avgGRE: 155, avgIELTS: 6.5,
    programs: ['MS Informatics', 'MS Robotics', 'MS Data Engineering', 'MS Mechanical Eng.'],
    intakes: ['October', 'April'],
    scholarships: ['DAAD Scholarship', 'Deutschlandstipendium', 'TUM Merit Award'],
    indianStudents: 3200,
    rating: 4.6,
    description: 'Germany\'s top technical university with near-zero tuition fees and strong industry ties.',
    deadline: 'May 31, 2025',
    type: 'Public',
    color: 'from-slate-800/60 to-slate-700/30',
  },
  {
    id: '5', name: 'University of Melbourne', shortName: 'UMelbourne',
    country: 'Australia', city: 'Melbourne', flag: '🇦🇺',
    qsRank: 14, usNewsRank: 20,
    annualTuition: 3200000, livingCost: 1600000,
    acceptanceRate: 70, avgGRE: 155, avgIELTS: 6.5,
    programs: ['Master of CS', 'Master of Data Science', 'MBA', 'Master of Engineering'],
    intakes: ['February', 'July'],
    scholarships: ['Melbourne International Scholarship', 'Graduate Research Scholarship', 'Equity Scholarship'],
    indianStudents: 5600,
    rating: 4.5,
    description: 'Australia\'s leading university with strong post-study work rights and vibrant student life.',
    deadline: 'Oct 31, 2025',
    type: 'Public',
    color: 'from-cyan-900/40 to-cyan-800/20',
  },
  {
    id: '6', name: 'Carnegie Mellon University', shortName: 'CMU',
    country: 'USA', city: 'Pittsburgh, PA', flag: '🇺🇸',
    qsRank: 52, usNewsRank: 22,
    annualTuition: 5400000, livingCost: 2000000,
    acceptanceRate: 11, avgGRE: 168, avgIELTS: 7.0,
    programs: ['MS CS (MSCS)', 'MS ML', 'MS Software Engineering', 'MS HCI'],
    intakes: ['August'],
    scholarships: ['CMU Presidential Fellowship', 'RA Funding', 'SCS Dean\'s Fellowship'],
    indianStudents: 2800,
    rating: 4.8,
    description: 'World\'s #1 CS school with the highest density of Indian students in top US programs.',
    deadline: 'Dec 1, 2025',
    type: 'Private',
    color: 'from-red-900/40 to-orange-900/20',
  },
  {
    id: '7', name: 'University of British Columbia', shortName: 'UBC',
    country: 'Canada', city: 'Vancouver, BC', flag: '🇨🇦',
    qsRank: 34, usNewsRank: 30,
    annualTuition: 2600000, livingCost: 1500000,
    acceptanceRate: 52, avgGRE: 156, avgIELTS: 6.5,
    programs: ['MS Computer Science', 'MEng', 'MBA Sauder', 'MS Data Science'],
    intakes: ['September'],
    scholarships: ['International Leader of Tomorrow', 'UBC Graduate Fellowship', 'Four Year Fellowship'],
    indianStudents: 6200,
    rating: 4.6,
    description: 'Top Canadian university in Vancouver with excellent quality of life and PR pathways.',
    deadline: 'Dec 15, 2025',
    type: 'Public',
    color: 'from-blue-900/40 to-teal-900/20',
  },
  {
    id: '8', name: 'Imperial College London', shortName: 'Imperial',
    country: 'UK', city: 'London', flag: '🇬🇧',
    qsRank: 8, usNewsRank: 12,
    annualTuition: 4200000, livingCost: 2200000,
    acceptanceRate: 14, avgGRE: 0, avgIELTS: 7.0,
    programs: ['MSc Computing', 'MSc AI', 'MSc Finance', 'MSc Biomedical Eng.'],
    intakes: ['October'],
    scholarships: ['President\'s Scholarship', 'Imperial College PhD Scholarship', 'Chevening'],
    indianStudents: 1800,
    rating: 4.8,
    description: 'London\'s top STEM university with direct access to global finance and tech industries.',
    deadline: 'Feb 1, 2026',
    type: 'Public',
    color: 'from-violet-900/40 to-violet-800/20',
  },
]

const countries = ['All', 'USA', 'UK', 'Canada', 'Australia', 'Germany']

export default function AbroadUniversities() {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('All')
  const [selected, setSelected] = useState<typeof universities[0] | null>(null)

  const filtered = universities.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.shortName.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase())
    const matchCountry = country === 'All' || u.country === country
    return matchSearch && matchCountry
  })

  if (selected) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition text-sm">
          ← Back to universities
        </button>

        {/* Hero */}
        <div className="border border-border rounded-2xl p-8 bg-muted/30">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{selected.flag}</span>
                <div>
                  <p className="text-muted-foreground text-xs">{selected.city} · {selected.type}</p>
                  <h1 className="text-2xl font-semibold text-foreground">{selected.name}</h1>
                </div>
              </div>
              <p className="text-muted-foreground text-sm max-w-xl">{selected.description}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-xs mb-1">QS World Rank</p>
              <p className="text-3xl font-semibold text-foreground">#{selected.qsRank}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs bg-muted text-muted-foreground border border-border px-3 py-1 rounded-full">Deadline: {selected.deadline}</span>
            <span className="text-xs bg-muted text-muted-foreground border border-border px-3 py-1 rounded-full">Acceptance: {selected.acceptanceRate}%</span>
            <span className="text-xs bg-muted text-muted-foreground border border-border px-3 py-1 rounded-full">{selected.indianStudents.toLocaleString('en-IN')} Indian students</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Annual Tuition', value: `₹${(selected.annualTuition / 100000).toFixed(0)}L` },
            { label: 'Living Cost/yr', value: `₹${(selected.livingCost / 100000).toFixed(0)}L` },
            { label: 'Min IELTS', value: selected.avgIELTS.toFixed(1) },
            { label: 'Avg GRE', value: selected.avgGRE > 0 ? selected.avgGRE : 'Not req.' },
          ].map((s) => (
            <div key={s.label} className="bg-background border border-border rounded-2xl p-5">
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className="text-xl font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Programs */}
          <div className="bg-background border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><BookOpen size={15} /> Programs</h2>
            <div className="space-y-2">
              {selected.programs.map((p) => (
                <div key={p} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{p}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Open</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scholarships */}
          <div className="bg-background border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Award size={15} /> Scholarships</h2>
            <div className="space-y-2.5">
              {selected.scholarships.map((s) => (
                <div key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-green-600 mt-0.5">✓</span>{s}
                </div>
              ))}
            </div>
          </div>

          {/* Key Info */}
          <div className="bg-background border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Users size={15} /> Key Info</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Intakes</p>
                <div className="flex gap-2 flex-wrap">
                  {selected.intakes.map((i) => (
                    <span key={i} className="text-xs bg-muted text-foreground px-3 py-1 rounded-full">{i}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Application Deadline</p>
                <p className="text-sm font-semibold text-foreground">{selected.deadline}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Indian Students</p>
                <p className="text-sm font-semibold text-foreground">{selected.indianStudents.toLocaleString('en-IN')}+</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-full hover:opacity-90 transition text-sm">
            Apply Now <ArrowUpRight size={14} />
          </button>
          <button className="flex items-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-full hover:bg-muted transition text-sm">
            Save University
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Explore</p>
        <h1 className="text-4xl font-semibold text-foreground">Global Universities</h1>
        <p className="text-muted-foreground mt-2 text-sm">Top-ranked universities accepting Indian students across 6 countries.</p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search university, city…"
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {countries.map((c) => (
            <button key={c} onClick={() => setCountry(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                country === c ? 'bg-foreground text-background' : 'border border-border text-foreground hover:bg-muted'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground text-sm">{filtered.length} universities</p>

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((u) => (
          <div key={u.id}
            className="border border-border bg-muted/30 rounded-2xl p-6 hover:border-foreground/20 transition-all group cursor-pointer"
            onClick={() => setSelected(u)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{u.flag}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{u.shortName}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={10} />{u.city}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">QS Rank</p>
                <p className="font-semibold text-foreground">#{u.qsRank}</p>
              </div>
            </div>

            <p className="text-muted-foreground text-xs mb-4 leading-relaxed line-clamp-2">{u.description}</p>

            <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-border">
              <div>
                <p className="text-xs text-muted-foreground">Tuition/yr</p>
                <p className="text-sm font-semibold text-foreground">₹{(u.annualTuition / 100000).toFixed(0)}L</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Acceptance</p>
                <p className="text-sm font-semibold text-foreground">{u.acceptanceRate}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">IELTS Min</p>
                <p className="text-sm font-semibold text-foreground">{u.avgIELTS}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {u.programs.slice(0, 2).map((p) => (
                  <span key={p} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{p}</span>
                ))}
                {u.programs.length > 2 && <span className="text-xs text-muted-foreground">+{u.programs.length - 2}</span>}
              </div>
              <ArrowUpRight size={15} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
