'use client'

import { useState } from 'react'
import { ArrowUpRight, Users, Clock, IndianRupee, TrendingUp, Plus } from 'lucide-react'

const programs = [
  {
    id: '1',
    name: 'B.Tech Computer Science & Engineering',
    level: 'Bachelor',
    duration: '4 years',
    intake: 120,
    annualFees: 350000,
    totalFees: 1400000,
    placement: 98,
    avgPackage: 1200000,
    eligibility: '10+2 with PCM, min 75%',
    description: 'Industry-aligned curriculum covering AI, ML, cloud computing, and full-stack development.',
    topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS'],
    enrolled: 112,
    status: 'active',
  },
  {
    id: '2',
    name: 'B.Tech Electronics & Communication',
    level: 'Bachelor',
    duration: '4 years',
    intake: 90,
    annualFees: 320000,
    totalFees: 1280000,
    placement: 94,
    avgPackage: 850000,
    eligibility: '10+2 with PCM, min 70%',
    description: 'Covers VLSI design, embedded systems, IoT, and wireless communication technologies.',
    topRecruiters: ['Qualcomm', 'Intel', 'Samsung', 'ISRO', 'DRDO'],
    enrolled: 84,
    status: 'active',
  },
  {
    id: '3',
    name: 'MBA — Business Analytics',
    level: 'Master',
    duration: '2 years',
    intake: 60,
    annualFees: 550000,
    totalFees: 1100000,
    placement: 100,
    avgPackage: 1800000,
    eligibility: 'Graduation with 50%, CAT/MAT score',
    description: 'Data-driven MBA program with specialisation in analytics, strategy, and digital transformation.',
    topRecruiters: ['Deloitte', 'McKinsey', 'KPMG', 'Flipkart', 'Paytm'],
    enrolled: 58,
    status: 'active',
  },
  {
    id: '4',
    name: 'B.Sc Data Science',
    level: 'Bachelor',
    duration: '3 years',
    intake: 80,
    annualFees: 280000,
    totalFees: 840000,
    placement: 91,
    avgPackage: 720000,
    eligibility: '10+2 with Maths, min 65%',
    description: 'Hands-on program in Python, statistics, machine learning, and data visualisation.',
    topRecruiters: ['Mu Sigma', 'Fractal', 'Accenture', 'Wipro', 'Capgemini'],
    enrolled: 72,
    status: 'active',
  },
  {
    id: '5',
    name: 'M.Tech Artificial Intelligence',
    level: 'Master',
    duration: '2 years',
    intake: 40,
    annualFees: 420000,
    totalFees: 840000,
    placement: 96,
    avgPackage: 2200000,
    eligibility: 'B.Tech/B.E with 60%, GATE preferred',
    description: 'Advanced research-oriented program in deep learning, NLP, computer vision, and robotics.',
    topRecruiters: ['NVIDIA', 'Adobe', 'Google DeepMind', 'Meta AI', 'OpenAI'],
    enrolled: 38,
    status: 'active',
  },
  {
    id: '6',
    name: 'BCA — Cloud & DevOps',
    level: 'Bachelor',
    duration: '3 years',
    intake: 100,
    annualFees: 220000,
    totalFees: 660000,
    placement: 88,
    avgPackage: 580000,
    eligibility: '10+2 any stream, min 55%',
    description: 'Practical program covering AWS, Azure, Docker, Kubernetes, and CI/CD pipelines.',
    topRecruiters: ['HCL', 'Tech Mahindra', 'Cognizant', 'Mphasis', 'LTIMindtree'],
    enrolled: 91,
    status: 'active',
  },
]

const levelColors: Record<string, string> = {
  Bachelor: 'bg-blue-100 text-blue-700',
  Master: 'bg-purple-100 text-purple-700',
}

export default function Programs() {
  const [selected, setSelected] = useState<typeof programs[0] | null>(null)

  if (selected) {
    return (
      <div className="space-y-6 max-w-4xl">
        <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground transition">
          ← Back to programs
        </button>

        <div className="border border-border rounded-2xl p-8">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColors[selected.level]} mb-2 inline-block`}>{selected.level}</span>
              <h1 className="text-2xl font-semibold text-foreground">{selected.name}</h1>
              <p className="text-muted-foreground text-sm mt-1">{selected.description}</p>
            </div>
            <button className="flex items-center gap-1.5 border border-border rounded-full px-4 py-2 text-sm font-medium hover:bg-muted transition">
              Edit Program
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Duration', value: selected.duration, icon: <Clock size={14} /> },
              { label: 'Annual Intake', value: `${selected.intake} seats`, icon: <Users size={14} /> },
              { label: 'Annual Fees', value: `₹${(selected.annualFees/100000).toFixed(1)}L`, icon: <IndianRupee size={14} /> },
              { label: 'Placement', value: `${selected.placement}%`, icon: <TrendingUp size={14} /> },
            ].map((s) => (
              <div key={s.label} className="border border-border rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">{s.icon}<span className="text-xs">{s.label}</span></div>
                <p className="font-semibold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Eligibility</p>
              <p className="text-sm text-foreground bg-muted rounded-xl px-4 py-3">{selected.eligibility}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Avg Package</p>
              <p className="text-2xl font-semibold text-foreground">₹{(selected.avgPackage/100000).toFixed(1)}L <span className="text-sm font-normal text-muted-foreground">per annum</span></p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Top Recruiters</p>
            <div className="flex flex-wrap gap-2">
              {selected.topRecruiters.map((r) => (
                <span key={r} className="bg-muted text-foreground text-xs font-medium px-3 py-1.5 rounded-full">{r}</span>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Currently enrolled</p>
              <p className="font-semibold text-foreground">{selected.enrolled} / {selected.intake} students</p>
            </div>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-foreground rounded-full" style={{ width: `${(selected.enrolled / selected.intake) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Academic</p>
          <h1 className="text-4xl font-semibold text-foreground">Programs</h1>
          <p className="text-muted-foreground mt-2 text-sm">{programs.length} active programs · {programs.reduce((s, p) => s + p.enrolled, 0)} students enrolled</p>
        </div>
        <button className="flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition">
          <Plus size={14} /> Add Program
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {programs.map((p) => (
          <div key={p.id} className="border border-border rounded-2xl p-6 hover:border-foreground/30 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColors[p.level]} mb-2 inline-block`}>{p.level} · {p.duration}</span>
                <h3 className="font-semibold text-foreground leading-snug">{p.name}</h3>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{p.description}</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Fees/yr</p>
                <p className="font-semibold text-sm">₹{(p.annualFees/100000).toFixed(1)}L</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Placement</p>
                <p className="font-semibold text-sm">{p.placement}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Enrolled</p>
                <p className="font-semibold text-sm">{p.enrolled}/{p.intake}</p>
              </div>
            </div>
            <button onClick={() => setSelected(p)}
              className="w-full flex items-center justify-center gap-1.5 border border-border rounded-full py-2 text-xs font-medium hover:bg-muted transition">
              View Details <ArrowUpRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
