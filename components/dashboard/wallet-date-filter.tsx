'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import { addDays, format } from 'date-fns'

export function WalletDateFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize from URL or default to last 30 days
    const fromParam = searchParams.get('from')
    const toParam = searchParams.get('to')

    const [date, setDate] = useState<DateRange | undefined>({
        from: fromParam ? new Date(fromParam) : addDays(new Date(), -30),
        to: toParam ? new Date(toParam) : new Date(),
    })

    useEffect(() => {
        if (date?.from) {
            const params = new URLSearchParams()
            params.set('from', format(date.from, 'yyyy-MM-dd'))
            if (date.to) {
                params.set('to', format(date.to, 'yyyy-MM-dd'))
            } else {
                params.delete('to')
            }

            // Push to router with shallow? No, we want to reload data
            // router.push(`?${params.toString()}`)
            // Actually, we are just changing params on the current path
            const newSearch = params.toString()
            const currentSearch = searchParams.toString()

            if (newSearch !== currentSearch) {
                router.push(`?${newSearch}`)
            }
        }
    }, [date, router, searchParams])

    return (
        <DateRangePicker
            dateRange={date}
            onDateRangeChange={setDate}
        />
    )
}
