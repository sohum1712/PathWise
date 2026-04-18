'use client'

import { useState } from 'react'
import { ArrowUpRight, Award, Globe, Building2, Search } from 'lucide-react'

const scholarships = [
  // Indian Government — for abroad
  {
    id: '1', name: 'National Overseas Scholarship (NOS)',
    provider: 'Ministry of Social Justice & Empowerment, Govt. of India',
    type: 'govt-abroad', category: 'Government (India)',
    amount: '₹15,000–₹20,000/month + tuition',
    coverage: 'Full tuition + living allowance + travel',
    eligibility: 'SC/ST/OBC students, family income < ₹6L/yr, 60%+ in graduation',
    countries: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France'],
    deadline: 'March 31, 2026',
    renewable: true,
    link: 'scholarships.gov.in',
    description: 'Flagship Indian government scholarship for meritorious students from marginalised communities to pursue Masters/PhD abroad.',
    tags: ['SC/ST/OBC', 'Masters', 'PhD'],
  },
  {
    id: '2', name: 'ICCR Scholarship Programme',
    provider: 'Indian Council for Cultural Relations (ICCR)',
    type: 'govt-abroad', category: 'Government (India)',
    amount: 'Full scholarship',
    coverage: 'Tuition + accommodation + stipend',
    eligibility: 'Indian nationals, bilateral agreements with partner countries',
    countries: ['Russia', 'China', 'Egypt', 'Brazil', 'Mexico'],
    deadline: 'January 31, 2026',
    renewable: true,
    link: 'iccr.gov.in',
    description: 'Cultural exchange scholarships under bilateral agreements between India and partner nations.',
    tags: ['Cultural Exchange', 'Bilateral', 'All levels'],
  },
  {
    id: '3', name: 'Prime Minister\'s Scholarship Scheme (PMSS)',
    provider: 'Ministry of Education, Govt. of India',
    type: 'govt-abroad', category: 'Government (India)',
    amount: '₹3,000/month (boys) · ₹3,500/month (girls)',
    coverage: 'Monthly stipend for technical/professional courses',
    eligibility: 'Wards of ex-servicemen/coast guard, 60%+ in 12th',
    countries: ['India (abroad-linked programs)'],
    deadline: 'October 31, 2025',
    renewable: true,
    link: 'ksb.gov.in',
    description: 'Scholarship for wards of ex-servicemen pursuing professional courses including abroad-linked programs.',
    tags: ['Ex-servicemen', 'Technical', 'Professional'],
  },
  // International Government
  {
    id: '4', name: 'Chevening Scholarship',
    provider: 'UK Foreign, Commonwealth & Development Office',
    type: 'govt-intl', category: 'Government (International)',
    amount: 'Full scholarship',
    coverage: 'Full tuition + living allowance + flights + visa',
    eligibility: 'Indian nationals, 2+ years work experience, leadership potential',
    countries: ['UK'],
    deadline: 'November 5, 2025',
    renewable: false,
    link: 'chevening.org',
    description: 'UK government\'s flagship scholarship for future global leaders. Covers all costs for a 1-year Masters at any UK university.',
    tags: ['Leadership', 'Masters', 'UK'],
  },
  {
    id: '5', name: 'DAAD Scholarship',
    provider: 'German Academic Exchange Service (DAAD)',
    type: 'govt-intl', category: 'Government (International)',
    amount: '€934/month + tuition waiver',
    coverage: 'Monthly stipend + health insurance + travel allowance',
    eligibility: 'Excellent academic record, relevant work experience, German/English proficiency',
    countries: ['Germany'],
    deadline: 'October 15, 2025',
    renewable: true,
    link: 'daad.de',
    description: 'Germany\'s premier scholarship for international students. Most German public universities have zero tuition fees.',
    tags: ['Germany', 'Research', 'Masters/PhD'],
  },
  {
    id: '6', name: 'Australia Awards Scholarship',
    provider: 'Australian Government (DFAT)',
    type: 'govt-intl', category: 'Government (International)',
    amount: 'Full scholarship',
    coverage: 'Full tuition + living allowance + travel + health cover',
    eligibility: 'Citizens of eligible countries, 3+ years work experience',
    countries: ['Australia'],
    deadline: 'April 30, 2026',
    renewable: false,
    link: 'australiaawards.gov.au',
    description: 'Australian government scholarship promoting development through education. Covers Masters and PhD programs.',
    tags: ['Australia', 'Development', 'Masters/PhD'],
  },
  {
    id: '7', name: 'Fulbright-Nehru Fellowship',
    provider: 'US-India Educational Foundation (USIEF)',
    type: 'govt-intl', category: 'Government (International)',
    amount: 'Full fellowship',
    coverage: 'Tuition + living stipend + health insurance + travel',
    eligibility: 'Indian citizens, Masters/PhD, strong academic record',
    countries: ['USA'],
    deadline: 'July 15, 2025',
    renewable: false,
    link: 'usief.org.in',
    description: 'Prestigious US-India bilateral fellowship for Masters, PhD, and research programs at US universities.',
    tags: ['USA', 'Research', 'Masters/PhD'],
  },
  // University scholarships
  {
    id: '8', name: 'Lester B. Pearson International Scholarship',
    provider: 'University of Toronto',
    type: 'university', category: 'University Scholarship',
    amount: 'Full scholarship',
    coverage: 'Full tuition + books + incidentals + residence',
    eligibility: 'Exceptional academic achievement, leadership, nominated by school',
    countries: ['Canada'],
    deadline: 'November 30, 2025',
    renewable: true,
    link: 'future.utoronto.ca',
    description: 'UofT\'s most prestigious international scholarship covering all 4 years of undergraduate study.',
    tags: ['Undergraduate', 'Leadership', 'Canada'],
  },
  {
    id: '9', name: 'Gates Cambridge Scholarship',
    provider: 'Gates Foundation / University of Cambridge',
    type: 'university', category: 'University Scholarship',
    amount: 'Full scholarship',
    coverage: 'Full tuition + maintenance allowance + flights + visa',
    eligibility: 'Outstanding intellectual ability, leadership, commitment to improving lives',
    countries: ['UK'],
    deadline: 'October 14, 2025',
    renewable: true,
    link: 'gatescambridge.org',
    description: 'One of the world\'s most competitive scholarships for postgraduate study at Cambridge University.',
    tags: ['Cambridge', 'Postgraduate', 'Leadership'],
  },
  {
    id: '10', name: 'Rhodes Scholarship',
    provider: 'Rhodes Trust / University of Oxford',
    type: 'university', category: 'University Scholarship',
    amount: 'Full scholarship',
    coverage: 'Full tuition + stipend + travel + health insurance',
    eligibility: 'Exceptional academics, leadership, character, commitment to service',
    countries: ['UK'],
    deadline: 'August 1, 2025',
    renewable: true,
    link: 'rhodeshouse.ox.ac.uk',
    description: 'The world\'s oldest and most prestigious international scholarship for study at Oxford University.',
    tags: ['Oxford', 'Postgraduate', 'Prestigious'],
  },
  // Indian domestic scholarships
  {
    id: '11', name: 'Central Sector Scheme of Scholarships',
    provider: 'Ministry of Education, Govt. of India',
    type: 'india-domestic', category: 'Scholarship (India)',
    amount: '₹10,000/yr (UG) · ₹20,000/yr (PG)',
    coverage: 'Annual scholarship for college/university students',
    eligibility: 'Top 20 percentile in 12th board, family income < ₹8L/yr',
    countries: ['India'],
    deadline: 'October 31, 2025',
    renewable: true,
    link: 'scholarships.gov.in',
    description: 'Central government scholarship for meritorious students from economically weaker sections pursuing higher education in India.',
    tags: ['UG/PG', 'Merit-cum-means', 'India'],
  },
  {
    id: '12', name: 'Inspire Scholarship (SHE)',
    provider: 'Department of Science & Technology, Govt. of India',
    type: 'india-domestic', category: 'Scholarship (India)',
    amount: '₹80,000/yr + mentorship grant',
    coverage: 'Annual scholarship + summer research attachment',
    eligibility: 'Top 1% in 12th board, pursuing BSc/BS/Int. MSc in natural sciences',
    countries: ['India'],
    deadline: 'December 31, 2025',
    renewable: true,
    link: 'online-inspire.gov.in',
    description: 'DST scholarship to attract talented students to pursue careers in natural and basic sciences.',
    tags: ['Science', 'BSc/MSc', 'Research'],
  },
]

const categories = ['All', 'Government (India)', 'Government (International)', 'University Scholarship', 'Scholarship (India)']

const categoryIcons: Record<string, React.ReactNode> = {
  'Government (India)': <Building2 size={14} />,
  'Government (International)': <Globe size={14} />,
  'University Scholarship': <Award size={14} />,
  'Scholarship (India)': <Building2 size={14} />,
}

const categoryColors: Record<string, string> = {
  'Government (India)': 'bg-orange-100 text-orange-700',
  'Government (International)': 'bg-blue-100 text-blue-700',
  'University Scholarship': 'bg-purple-100 text-purple-700',
  'Scholarship (India)': 'bg-green-100 text-green-700',
}

export default function AbroadScholarships() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<typeof scholarships[0] | null>(null)

  const filtered = scholarships.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.provider.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || s.category === category
    return matchSearch && matchCat
  })

  if (selected) {
    return (
      <div className="space-y-6 max-w-3xl">
        <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition text-sm">
          ← Back to scholarships
        </button>
        <div className="bg-background border border-border rounded-2xl p-8">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
            <div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-3 inline-flex items-center gap-1.5 ${categoryColors[selected.category]}`}>
                {categoryIcons[selected.category]}{selected.category}
              </span>
              <h1 className="text-2xl font-semibold text-foreground mb-1">{selected.name}</h1>
              <p className="text-muted-foreground text-sm">{selected.provider}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-xs mb-1">Amount</p>
              <p className="text-lg font-semibold text-foreground">{selected.amount}</p>
            </div>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-6">{selected.description}</p>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-2">Coverage</p>
              <p className="text-sm text-foreground">{selected.coverage}</p>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-2">Eligibility</p>
              <p className="text-sm text-foreground">{selected.eligibility}</p>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-2">Application Deadline</p>
              <p className="text-sm font-semibold text-foreground">{selected.deadline}</p>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-2">Countries</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.countries.map((c) => (
                  <span key={c} className="text-xs bg-background text-muted-foreground border border-border px-2 py-0.5 rounded-full">{c}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {selected.tags.map((t) => (
              <span key={t} className="text-xs bg-muted text-muted-foreground border border-border px-3 py-1 rounded-full">{t}</span>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-full hover:opacity-90 transition text-sm">
              Apply Now <ArrowUpRight size={14} />
            </button>
            <button className="flex items-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-full hover:bg-muted transition text-sm">
              Save Scholarship
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Funding</p>
        <h1 className="text-4xl font-semibold text-foreground">Scholarships</h1>
        <p className="text-muted-foreground mt-2 text-sm">Government, university, and private scholarships for Indian students — both abroad and in India.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Govt. (India)', count: scholarships.filter((s) => s.type === 'govt-abroad' || s.type === 'india-domestic').length, color: 'text-orange-600' },
          { label: 'Govt. (International)', count: scholarships.filter((s) => s.type === 'govt-intl').length, color: 'text-blue-600' },
          { label: 'University', count: scholarships.filter((s) => s.type === 'university').length, color: 'text-purple-600' },
          { label: 'Total Available', count: scholarships.length, color: 'text-foreground' },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-2xl p-5">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-3xl font-semibold ${s.color}`}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scholarships…"
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                category === c ? 'bg-foreground text-background' : 'border border-border text-foreground hover:bg-muted'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground text-sm">{filtered.length} scholarships</p>

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((s) => (
          <div key={s.id} onClick={() => setSelected(s)}
            className="bg-background border border-border rounded-2xl p-6 hover:border-foreground/20 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${categoryColors[s.category]}`}>
                {categoryIcons[s.category]}{s.category}
              </span>
              {s.renewable && <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Renewable</span>}
            </div>
            <h3 className="font-semibold text-foreground mb-1">{s.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{s.provider}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{s.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-sm font-semibold text-foreground">{s.amount}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="text-sm font-medium text-foreground">{s.deadline}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {s.tags.map((t) => (
                <span key={t} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
