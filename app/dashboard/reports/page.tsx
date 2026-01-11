'use client'

import { useState } from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'
import { GlassCard } from '@/components/ui/glass-card'
import { Calendar, Filter } from 'lucide-react'

// Mock Data - Replace with real API data
const monthlyData = [
    { name: 'Ene', ingresos: 4000, gastos: 2400 },
    { name: 'Feb', ingresos: 3000, gastos: 1398 },
    { name: 'Mar', ingresos: 2000, gastos: 9800 },
    { name: 'Abr', ingresos: 2780, gastos: 3908 },
    { name: 'May', ingresos: 1890, gastos: 4800 },
    { name: 'Jun', ingresos: 2390, gastos: 3800 },
    { name: 'Jul', ingresos: 3490, gastos: 4300 },
]

const categoryData = [
    { name: 'Alimentación', value: 400 },
    { name: 'Transporte', value: 300 },
    { name: 'Servicios', value: 300 },
    { name: 'Entretenimiento', value: 200 },
]

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState('Este Mes')

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reportes Financieros</h1>
                    <p className="text-slate-500 dark:text-slate-400">Análisis detallado de tus finanzas</p>
                </div>

                <div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    {['Este Mes', 'Últimos 3 Meses', 'Este Año'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateRange === range
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="h-[400px]" delay={0.1}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Balance General</h3>
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `S/${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#cbd5e1' }}
                            />
                            <Area type="monotone" dataKey="ingresos" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
                            <Area type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorGastos)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </GlassCard>

                <GlassCard className="h-[400px]" delay={0.2}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Gastos por Categoría</h3>
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                            <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', color: '#fff' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Ingreso Promedio', value: 'S/ 3,450', change: '+12%', color: 'indigo' },
                    { label: 'Gasto Promedio', value: 'S/ 2,100', change: '-5%', color: 'emerald' },
                    { label: 'Ahorro Neto', value: 'S/ 1,350', change: '+8%', color: 'blue' },
                ].map((stat, i) => (
                    <GlassCard key={stat.label} delay={0.3 + (i * 0.1)}>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                            <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                {stat.change}
                            </span>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}
