'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const enrollmentData = [
  { month: 'Jan', enrollments: 120 },
  { month: 'Feb', enrollments: 150 },
  { month: 'Mar', enrollments: 180 },
  { month: 'Apr', enrollments: 165 },
  { month: 'May', enrollments: 200 },
  { month: 'Jun', enrollments: 220 },
]

const applicationStatusData = [
  { name: 'Draft', value: 45, fill: '#8884d8' },
  { name: 'Submitted', value: 120, fill: '#82ca9d' },
  { name: 'Approved', value: 200, fill: '#ffc658' },
  { name: 'Rejected', value: 35, fill: '#ff8042' },
]

const feeCollectionData = [
  { month: 'Jan', collected: 85, target: 100 },
  { month: 'Feb', collected: 90, target: 100 },
  { month: 'Mar', collected: 88, target: 100 },
  { month: 'Apr', collected: 95, target: 100 },
  { month: 'May', collected: 92, target: 100 },
  { month: 'Jun', collected: 98, target: 100 },
]

const COLORS = ['#0f766e', '#06b6d4', '#06a3d1', '#0284c7']

export default function Analytics() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Insights</h1>
        <p className="text-muted-foreground">Comprehensive metrics about your institution&apos;s performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Total Enrollments</div>
          <div className="text-3xl font-bold text-primary">1,035</div>
          <div className="text-xs text-green-600 mt-2">+12% from last month</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Applications</div>
          <div className="text-3xl font-bold text-secondary">400</div>
          <div className="text-xs text-green-600 mt-2">+8% this month</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Fee Collection Rate</div>
          <div className="text-3xl font-bold text-accent">92%</div>
          <div className="text-xs text-green-600 mt-2">On track</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Avg. Processing Time</div>
          <div className="text-3xl font-bold text-primary">4.2</div>
          <div className="text-xs text-muted-foreground mt-2">days</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Enrollment Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="enrollments" 
                stroke="var(--primary)" 
                dot={{ fill: 'var(--primary)', r: 4 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Application Status */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Application Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={applicationStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {applicationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Fee Collection */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-foreground mb-4">Fee Collection vs Target</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feeCollectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)'
                }} 
              />
              <Legend />
              <Bar dataKey="collected" fill="var(--primary)" name="Collected %" />
              <Bar dataKey="target" fill="var(--muted)" name="Target %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">New Financing Application</p>
              <p className="text-sm text-muted-foreground">Raj Patel - B.Tech CSE</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Payment Completed</p>
              <p className="text-sm text-muted-foreground">Priya Singh - 1st Year Fees</p>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">5 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-foreground">New Student Enrollment</p>
              <p className="text-sm text-muted-foreground">Arjun Kumar - MBA Program</p>
            </div>
            <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full">1 day ago</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
