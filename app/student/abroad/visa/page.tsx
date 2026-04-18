'use client'

import { useState } from 'react'
import { ArrowUpRight, Star, MapPin, Phone, CheckCircle2, Clock, FileText, Search } from 'lucide-react'

const consultants = [
  {
    id: '1',
    name: 'IDP Education India',
    type: 'Global Agency',
    city: 'Pan India (50+ offices)',
    rating: 4.7,
    reviews: 12400,
    specialisation: ['USA', 'UK', 'Canada', 'Australia', 'New Zealand'],
    services: ['University shortlisting', 'SOP/LOR review', 'Visa filing', 'Pre-departure briefing', 'Scholarship guidance'],
    successRate: 96,
    avgProcessingTime: '4–6 weeks',
    fee: '₹15,000–₹35,000',
    phone: '1800-102-9898',
    description: 'World\'s largest student placement organisation with 50+ years of experience and offices across India.',
    visaTypes: ['F-1 (USA)', 'Tier-4 (UK)', 'Study Permit (CA)', 'Student Visa (AU)'],
    badge: 'Most Trusted',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: '2',
    name: 'AECC Global',
    type: 'Global Agency',
    city: 'Mumbai, Delhi, Bangalore, Hyderabad',
    rating: 4.6,
    reviews: 8200,
    specialisation: ['Australia', 'UK', 'Canada', 'Ireland'],
    services: ['Course selection', 'Application support', 'Visa documentation', 'Accommodation help', 'Airport pickup coordination'],
    successRate: 94,
    avgProcessingTime: '3–5 weeks',
    fee: '₹10,000–₹25,000',
    phone: '+91 80 4718 4718',
    description: 'Award-winning education consultancy specialising in Australia and UK with strong university partnerships.',
    visaTypes: ['Student Visa (AU)', 'Tier-4 (UK)', 'Study Permit (CA)', 'Student Visa (IE)'],
    badge: 'Australia Specialist',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: '3',
    name: 'Edwise International',
    type: 'Indian Agency',
    city: 'Mumbai, Pune, Nagpur, Ahmedabad',
    rating: 4.5,
    reviews: 6800,
    specialisation: ['USA', 'UK', 'Canada', 'Germany', 'France'],
    services: ['Profile evaluation', 'University applications', 'Visa interview prep', 'Education loan assistance', 'Test prep referrals'],
    successRate: 92,
    avgProcessingTime: '5–8 weeks',
    fee: '₹8,000–₹20,000',
    phone: '+91 22 2282 9999',
    description: 'India\'s pioneer overseas education consultancy since 1991 with strong presence in Western India.',
    visaTypes: ['F-1 (USA)', 'Tier-4 (UK)', 'Study Permit (CA)', 'National Visa (DE)'],
    badge: 'Since 1991',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: '4',
    name: 'Leverage Edu',
    type: 'EdTech + Consultancy',
    city: 'Delhi, Mumbai, Bangalore (+ Online)',
    rating: 4.4,
    reviews: 15600,
    specialisation: ['USA', 'UK', 'Canada', 'Australia', 'Germany'],
    services: ['AI-powered university matching', 'SOP writing', 'Visa filing', 'Scholarship search', 'Loan assistance'],
    successRate: 91,
    avgProcessingTime: '3–6 weeks',
    fee: '₹12,000–₹30,000',
    phone: '1800-572-000',
    description: 'Tech-first education consultancy using AI to match students with the best universities and scholarships.',
    visaTypes: ['F-1 (USA)', 'Tier-4 (UK)', 'Study Permit (CA)', 'Student Visa (AU)', 'National Visa (DE)'],
    badge: 'AI-Powered',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: '5',
    name: 'KC Overseas Education',
    type: 'Indian Agency',
    city: 'Delhi, Chandigarh, Jalandhar, Ludhiana',
    rating: 4.5,
    reviews: 9100,
    specialisation: ['Canada', 'Australia', 'UK', 'New Zealand'],
    services: ['IELTS/PTE coaching', 'University applications', 'Visa filing', 'PR pathway guidance', 'Post-landing support'],
    successRate: 93,
    avgProcessingTime: '4–7 weeks',
    fee: '₹10,000–₹22,000',
    phone: '+91 11 4560 4560',
    description: 'North India\'s leading consultancy with deep expertise in Canada PR pathways and Australian migration.',
    visaTypes: ['Study Permit (CA)', 'Student Visa (AU)', 'Tier-4 (UK)', 'Student Visa (NZ)'],
    badge: 'Canada Specialist',
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    id: '6',
    name: 'Canam Consultants',
    type: 'Indian Agency',
    city: 'Pan India (30+ offices)',
    rating: 4.6,
    reviews: 11200,
    specialisation: ['Canada', 'Australia', 'UK', 'USA'],
    services: ['Free profile assessment', 'University shortlisting', 'Visa documentation', 'GIC assistance', 'Biometrics support'],
    successRate: 95,
    avgProcessingTime: '4–6 weeks',
    fee: 'Free basic + ₹15,000 premium',
    phone: '1800-200-3678',
    description: 'One of India\'s largest consultancies with 30+ offices and a strong track record for Canada study permits.',
    visaTypes: ['Study Permit (CA)', 'Student Visa (AU)', 'F-1 (USA)', 'Tier-4 (UK)'],
    badge: 'Free Assessment',
    badgeColor: 'bg-teal-100 text-teal-700',
  },
]

const visaGuides = [
  {
    country: 'USA',
    flag: '🇺🇸',
    visaType: 'F-1 Student Visa',
    processingTime: '3–5 weeks',
    fee: '$185 (SEVIS) + $160 (visa)',
    steps: [
      'Get I-20 from university',
      'Pay SEVIS fee (I-901)',
      'Fill DS-160 form',
      'Schedule visa interview',
      'Attend interview at US Embassy',
      'Receive visa',
    ],
    documents: ['I-20 form', 'DS-160 confirmation', 'SEVIS fee receipt', 'Passport', 'Financial proof', 'Admission letter', 'Academic transcripts'],
    tip: 'Apply at least 120 days before your program start date. Show strong ties to India.',
  },
  {
    country: 'UK',
    flag: '🇬🇧',
    visaType: 'Student Visa (Tier-4)',
    processingTime: '3 weeks',
    fee: '£363 + IHS surcharge',
    steps: [
      'Receive CAS from university',
      'Apply online on UKVI',
      'Pay visa fee + IHS',
      'Book biometrics appointment',
      'Submit documents',
      'Receive decision',
    ],
    documents: ['CAS number', 'Passport', 'Financial proof (28 days)', 'English test results', 'Tuberculosis test (if applicable)', 'Parental consent (if under 18)'],
    tip: 'You must show funds for tuition + 9 months living costs. Apply no earlier than 6 months before course start.',
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    visaType: 'Study Permit',
    processingTime: '4–12 weeks',
    fee: 'CAD $150',
    steps: [
      'Get acceptance letter',
      'Apply online on IRCC',
      'Pay application fee',
      'Submit biometrics',
      'Upload documents',
      'Receive port of entry letter',
    ],
    documents: ['Acceptance letter', 'Passport', 'Financial proof', 'Statement of purpose', 'Biometrics', 'Medical exam (if required)', 'Police clearance'],
    tip: 'Apply as early as possible — processing times vary. SDS stream is faster for eligible students.',
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    visaType: 'Student Visa (Subclass 500)',
    processingTime: '4–6 weeks',
    fee: 'AUD $650',
    steps: [
      'Get CoE from institution',
      'Apply on ImmiAccount',
      'Pay visa fee',
      'Get health insurance (OSHC)',
      'Submit biometrics',
      'Receive visa grant',
    ],
    documents: ['Confirmation of Enrolment (CoE)', 'Passport', 'Financial proof', 'OSHC insurance', 'English test results', 'Genuine Temporary Entrant statement'],
    tip: 'Write a strong GTE statement explaining why you want to study in Australia and your plans to return.',
  },
]

export default function AbroadVisa() {
  const [activeTab, setActiveTab] = useState<'consultants' | 'guides'>('consultants')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof consultants[0] | null>(null)
  const [selectedGuide, setSelectedGuide] = useState<typeof visaGuides[0] | null>(null)

  const filtered = consultants.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.specialisation.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  )

  /* ── Consultant detail ── */
  if (selected) {
    return (
      <div className="space-y-6 max-w-3xl">
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-muted-foreground hover:text-foreground transition"
        >
          ← Back to consultants
        </button>

        <div className="border border-border rounded-2xl p-8">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
            <div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-3 inline-block ${selected.badgeColor}`}>
                {selected.badge}
              </span>
              <h1 className="text-2xl font-semibold text-foreground">{selected.name}</h1>
              <p className="text-muted-foreground text-sm">{selected.type}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span className="text-foreground text-sm font-semibold">{selected.rating}</span>
                <span className="text-muted-foreground text-xs">({selected.reviews.toLocaleString('en-IN')} reviews)</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
              <p className="text-3xl font-semibold text-foreground">{selected.successRate}%</p>
            </div>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-6">{selected.description}</p>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div className="bg-muted rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Services</p>
              <div className="space-y-2">
                {selected.services.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 size={13} className="text-green-600 shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="border border-border rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-2">Visa Types Handled</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.visaTypes.map((v) => (
                    <span key={v} className="text-xs bg-muted text-foreground border border-border px-2.5 py-1 rounded-full">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border border-border rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Processing Time</p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Clock size={13} className="text-muted-foreground" />
                  {selected.avgProcessingTime}
                </p>
              </div>
              <div className="border border-border rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Consultation Fee</p>
                <p className="text-sm font-semibold text-foreground">{selected.fee}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button className="flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-full hover:bg-foreground/90 transition text-sm">
              Book Consultation <ArrowUpRight size={14} />
            </button>
            <button className="flex items-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-full hover:bg-muted transition text-sm">
              <Phone size={13} /> {selected.phone}
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Visa guide detail ── */
  if (selectedGuide) {
    return (
      <div className="space-y-6 max-w-3xl">
        <button
          onClick={() => setSelectedGuide(null)}
          className="text-sm text-muted-foreground hover:text-foreground transition"
        >
          ← Back to guides
        </button>

        <div className="border border-border rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{selectedGuide.flag}</span>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {selectedGuide.country} — {selectedGuide.visaType}
              </h1>
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {selectedGuide.processingTime}
                </span>
                <span>Fee: {selectedGuide.fee}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Step-by-step process
              </p>
              <div className="space-y-3">
                {selectedGuide.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-foreground text-background text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Documents required
              </p>
              <div className="space-y-2.5">
                {selectedGuide.documents.map((doc) => (
                  <div key={doc} className="flex items-center gap-2.5 text-sm text-foreground">
                    <FileText size={13} className="text-muted-foreground shrink-0" />
                    {doc}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-amber-700 mb-1.5">💡 Pro Tip</p>
            <p className="text-sm text-amber-900 leading-relaxed">{selectedGuide.tip}</p>
          </div>
        </div>
      </div>
    )
  }

  /* ── Main list ── */
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Visa & Support</p>
        <h1 className="text-4xl font-semibold text-foreground">Visa & Consultants</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Verified consultants and step-by-step visa guides for every major destination.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['consultants', 'guides'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-foreground text-background'
                : 'border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {tab === 'consultants' ? `Consultants (${consultants.length})` : 'Visa Guides'}
          </button>
        ))}
      </div>

      {/* Consultants tab */}
      {activeTab === 'consultants' && (
        <>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, or country…"
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                className="border border-border rounded-2xl p-6 hover:border-foreground/30 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-2 inline-block ${c.badgeColor}`}>
                      {c.badge}
                    </span>
                    <h3 className="font-semibold text-foreground">{c.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {c.city}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-foreground text-sm font-semibold">{c.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.reviews.toLocaleString('en-IN')} reviews</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2">{c.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {c.specialisation.map((s) => (
                    <span key={s} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                    <p className="text-sm font-semibold text-foreground">{c.successRate}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Consultation Fee</p>
                    <p className="text-sm font-medium text-foreground">{c.fee}</p>
                  </div>
                  <ArrowUpRight size={15} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Guides tab */}
      {activeTab === 'guides' && (
        <div className="grid md:grid-cols-2 gap-5">
          {visaGuides.map((g) => (
            <div
              key={g.country}
              onClick={() => setSelectedGuide(g)}
              className="border border-border rounded-2xl p-6 hover:border-foreground/30 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-5">
                <span className="text-4xl">{g.flag}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{g.country}</h3>
                  <p className="text-xs text-muted-foreground">{g.visaType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Processing Time</p>
                  <p className="text-sm font-semibold text-foreground">{g.processingTime}</p>
                </div>
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Visa Fee</p>
                  <p className="text-sm font-semibold text-foreground">{g.fee}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {g.steps.length} steps · {g.documents.length} documents required
              </p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="text-xs font-medium text-muted-foreground">View full guide</span>
                <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
