'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

export default function EMICalculator() {
  const router = useRouter()
  const [principal, setPrincipal] = useState<number>(500000)
  const [rate, setRate] = useState<number>(8.5)
  const [tenure, setTenure] = useState<number>(10)
  const [emi, setEmi] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [totalInterest, setTotalInterest] = useState<number>(0)

  const calculateEMI = () => {
    if (principal <= 0 || rate <= 0 || tenure <= 0) {
      return
    }

    const monthlyRate = rate / 12 / 100
    const numberOfMonths = tenure * 12

    const emiValue =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
      (Math.pow(1 + monthlyRate, numberOfMonths) - 1)

    const total = emiValue * numberOfMonths
    const interest = total - principal

    setEmi(Math.round(emiValue))
    setTotalAmount(Math.round(total))
    setTotalInterest(Math.round(interest))
  }

  // Calculate on mount
  useState(() => {
    calculateEMI()
  })

  const handlePrincipalChange = (value: string) => {
    const num = parseFloat(value) || 0
    setPrincipal(num)
  }

  const handleRateChange = (value: string) => {
    const num = parseFloat(value) || 0
    setRate(num)
  }

  const handleTenureChange = (value: string) => {
    const num = parseInt(value) || 0
    setTenure(num)
  }

  // Auto-calculate when values change
  useState(() => {
    calculateEMI()
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/student/dashboard">← Back</Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">EMI Calculator</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Input Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">Loan Details</h2>
            <div className="space-y-8">
              {/* Principal Amount */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Loan Amount (₹)
                </label>
                <Input
                  type="number"
                  value={principal}
                  onChange={(e) => {
                    handlePrincipalChange(e.target.value)
                    calculateEMI()
                  }}
                  className="w-full text-lg py-3 px-4"
                  placeholder="Enter loan amount"
                />
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={principal}
                  onChange={(e) => {
                    setPrincipal(parseFloat(e.target.value))
                    calculateEMI()
                  }}
                  className="w-full mt-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>₹50K</span>
                  <span>₹50L</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Annual Interest Rate (%)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={rate}
                  onChange={(e) => {
                    handleRateChange(e.target.value)
                    calculateEMI()
                  }}
                  className="w-full text-lg py-3 px-4"
                  placeholder="Enter interest rate"
                />
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="0.5"
                  value={rate}
                  onChange={(e) => {
                    setRate(parseFloat(e.target.value))
                    calculateEMI()
                  }}
                  className="w-full mt-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>3%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* Tenure */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Loan Tenure (Years)
                </label>
                <Input
                  type="number"
                  value={tenure}
                  onChange={(e) => {
                    handleTenureChange(e.target.value)
                    calculateEMI()
                  }}
                  className="w-full text-lg py-3 px-4"
                  placeholder="Enter tenure"
                />
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={tenure}
                  onChange={(e) => {
                    setTenure(parseInt(e.target.value))
                    calculateEMI()
                  }}
                  className="w-full mt-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>1 Year</span>
                  <span>20 Years</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10">
              <h2 className="text-sm text-muted-foreground mb-2">Monthly EMI</h2>
              <div className="text-5xl font-bold text-primary mb-4">
                ₹{emi.toLocaleString('en-IN')}
              </div>
              <p className="text-muted-foreground text-sm">
                You need to pay this amount every month for {tenure} years
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Loan Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Principal Amount</p>
                    <p className="text-lg font-semibold text-foreground">
                      ₹{principal.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-2xl">📍</div>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Interest</p>
                    <p className="text-lg font-semibold text-foreground">
                      ₹{totalInterest.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-2xl">💰</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount to Pay</p>
                    <p className="text-lg font-bold text-primary">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-2xl">✅</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Payment Schedule</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Monthly Payment: ₹{emi.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Total Months: {tenure * 12}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Start Date: {new Date().toLocaleDateString()}
              </p>
              <Button asChild className="w-full">
                <Link href="/student/financing">Proceed to Financing</Link>
              </Button>
            </Card>
          </div>
        </div>

        {/* Key Info */}
        <Card className="mt-12 p-8 bg-secondary/10">
          <h3 className="text-xl font-bold text-foreground mb-4">💡 Pro Tips</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Reduce Principal</h4>
              <p className="text-sm text-muted-foreground">
                Lower principal amount reduces both EMI and total interest paid
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Shorter Tenure</h4>
              <p className="text-sm text-muted-foreground">
                Shorter tenure reduces interest but increases monthly EMI
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Compare Rates</h4>
              <p className="text-sm text-muted-foreground">
                Even 0.5% difference in rate significantly impacts total interest
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
