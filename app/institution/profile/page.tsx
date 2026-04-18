'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Building2, MapPin, Phone, Globe, Award } from 'lucide-react'

export default function InstitutionProfile() {
  const [institutionName, setInstitutionName] = useState('Delhi Institute of Technology & Management')
  const [email, setEmail] = useState('admin@ditm.edu.in')
  const [phone, setPhone] = useState('+91 11 2345 6789')
  const [website, setWebsite] = useState('www.ditm.edu.in')
  const [city, setCity] = useState('New Delhi')
  const [state, setState] = useState('Delhi')
  const [address, setAddress] = useState('Sector 9, Rohini, New Delhi - 110085')
  const [established, setEstablished] = useState('1998')
  const [accreditation, setAccreditation] = useState('NAAC A+ Grade')
  const [affiliation, setAffiliation] = useState('Guru Gobind Singh Indraprastha University')
  const [totalStudents, setTotalStudents] = useState('4800')
  const [totalFaculty, setTotalFaculty] = useState('320')
  const [description, setDescription] = useState('A premier technical institution in Delhi NCR offering undergraduate and postgraduate programs in engineering, management, and applied sciences with strong industry partnerships.')
  const [isLoading, setIsLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      setEmail(user.email || email)
      if (user.user_metadata?.institution_name) setInstitutionName(user.user_metadata.institution_name)
    })
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaved(true)
    setIsLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputCls = "h-10 rounded-xl bg-muted border-0 focus-visible:ring-2 focus-visible:ring-foreground/20 text-sm"

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Settings</p>
        <h1 className="text-4xl font-semibold text-foreground">Institution Profile</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="border border-border rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-foreground text-background flex items-center justify-center text-2xl font-semibold mx-auto mb-3">
              <Building2 size={28} />
            </div>
            <p className="font-semibold text-foreground text-sm leading-snug">{institutionName}</p>
            <p className="text-xs text-muted-foreground mt-1">{email}</p>
            <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{accreditation}</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">Est. {established}</span>
            </div>
          </div>

          <div className="border border-border rounded-2xl p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Quick Stats</p>
            {[
              { label: 'Total Students', value: parseInt(totalStudents).toLocaleString('en-IN') },
              { label: 'Faculty Members', value: parseInt(totalFaculty).toLocaleString('en-IN') },
              { label: 'Programs Offered', value: '6' },
              { label: 'Lender Partners', value: '3' },
            ].map((s) => (
              <div key={s.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-semibold text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="space-y-5">

            <div className="border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2"><Building2 size={15} /> Basic Information</h2>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Institution Name</label>
                <Input value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm p-3 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Year Established</label>
                  <Input value={established} onChange={(e) => setEstablished(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Affiliation</label>
                  <Input value={affiliation} onChange={(e) => setAffiliation(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1"><Award size={11} /> Accreditation</label>
                <Input value={accreditation} onChange={(e) => setAccreditation(e.target.value)} className={inputCls} />
              </div>
            </div>

            <div className="border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2"><MapPin size={15} /> Contact & Location</h2>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
                <Input value={email} disabled className={`${inputCls} opacity-60`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1"><Phone size={11} /> Phone</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1"><Globe size={11} /> Website</label>
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">City</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">State</label>
                  <Input value={state} onChange={(e) => setState(e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            <div className="border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Capacity</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Students</label>
                  <Input value={totalStudents} onChange={(e) => setTotalStudents(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Faculty Members</label>
                  <Input value={totalFaculty} onChange={(e) => setTotalFaculty(e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            {saved && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-700">
                <CheckCircle2 size={15} /> Profile saved successfully!
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-semibold h-11 rounded-full hover:bg-foreground/90 transition disabled:opacity-50 text-sm">
              {isLoading ? <><span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" /> Saving…</> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
