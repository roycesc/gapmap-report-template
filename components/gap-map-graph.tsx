"use client"

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft } from 'lucide-react'

interface RowData {
  id: number
  title: string
  today: number
  goal: number
  gap: number
}

export default function GapMapGraph() {
  const [title, setTitle] = useState<string>("GapMap")
  const [data, setData] = useState<RowData[]>(Array(5).fill(null).map((_, i) => ({
    id: i + 1,
    title: "",
    today: 0,
    goal: 0,
    gap: 0
  })))

  const handleTitleChange = (value: string) => {
    setTitle(value.slice(0, 35))
  }

  const handleInputChange = (id: number, field: 'title' | 'today' | 'goal', value: string) => {
    setData(prevData => prevData.map(row => {
      if (row.id === id) {
        let newValue: string | number = value
        if (field === 'today' || field === 'goal') {
          newValue = Math.min(Math.max(parseFloat(value) || 0, 0), 10)
        } else if (field === 'title') {
          newValue = value.slice(0, 35)
        }
        const updatedRow = { ...row, [field]: newValue }
        updatedRow.gap = calculateGap(updatedRow.today, updatedRow.goal)
        return updatedRow
      }
      return row
    }))
  }

  const calculateGap = (today: number, goal: number): number => {
    if (goal === 0) return 0
    return parseFloat(((goal - today) / goal * 100).toFixed(2))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-2xl font-bold"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Today</TableHead>
              <TableHead>Goal</TableHead>
              <TableHead>Gap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Input
                    value={row.title}
                    onChange={(e) => handleInputChange(row.id, 'title', e.target.value)}
                    maxLength={35}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.today}
                    onChange={(e) => handleInputChange(row.id, 'today', e.target.value)}
                    min={0}
                    max={10}
                    step={0.01}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.goal}
                    onChange={(e) => handleInputChange(row.id, 'goal', e.target.value)}
                    min={0}
                    max={10}
                    step={0.01}
                  />
                </TableCell>
                <TableCell>{row.gap.toFixed(2)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-8 bg-[#BEF264] p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-[#3F6212] mb-6">{title}</h2>
          <div className="space-y-16">
            {data.map((row, index) => (
              <div key={row.id} className="relative flex items-center">
                <div className="w-1/4 pr-4 font-medium text-right leading-tight min-h-[3em] flex items-center justify-end">{row.title || `Row ${index + 1}`}</div>
                <div className="relative flex-1 h-8">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex justify-between">
                    {Array.from({ length: 11 }).map((_, i) => (
                      <div key={i} className="w-px h-full bg-[#3F6212] opacity-20" />
                    ))}
                  </div>
                  {/* Goal bar */}
                  <div 
                    className="absolute inset-y-0 left-0 bg-[#3F6212] opacity-30 rounded-full transition-all duration-300"
                    style={{ width: `${(row.goal / 10) * 100}%` }}
                  />
                  {/* Today bar */}
                  <div 
                    className="absolute inset-y-0 left-0 bg-[#3F6212] rounded-full transition-all duration-300"
                    style={{ width: `${(row.today / 10) * 100}%` }}
                  />
                  {/* Gap indicator */}
                  {row.today > 0 && row.goal > 0 && (
                    <div className="absolute -top-9 left-0 w-full flex items-center text-sm pointer-events-none">
                      <div className="absolute left-0 right-0 flex justify-between items-center">
                        <ArrowLeft className="text-[#3F6212] w-3 h-3" style={{ marginLeft: `calc(${(Math.min(row.today, row.goal) / 10) * 100}% - 6px)` }} />
                        <ArrowRight className="text-[#3F6212] w-3 h-3" style={{ marginRight: `calc(${(10 - Math.max(row.today, row.goal)) / 10 * 100}% - 6px)` }} />
                      </div>
                      <div className="absolute inset-x-0 h-[1px] bg-[#3F6212]" style={{ 
                        left: `${(Math.min(row.today, row.goal) / 10) * 100}%`,
                        right: `${(10 - Math.max(row.today, row.goal)) / 10 * 100}%`
                      }}></div>
                      <div className="absolute inset-x-0 flex justify-center items-center" style={{ 
                        left: `${(Math.min(row.today, row.goal) / 10) * 100}%`,
                        right: `${(10 - Math.max(row.today, row.goal)) / 10 * 100}%`
                      }}>
                        <span className="px-2 py-1 bg-[#BEF264] text-[#3F6212] font-semibold rounded">
                          {row.gap.toFixed(0)}% gap
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {/* Scale numbers */}
                {index === data.length - 1 && (
                  <div className="absolute -bottom-6 w-3/4 right-0 flex justify-between text-sm text-[#3F6212]">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <span key={i}>{i * 2}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

