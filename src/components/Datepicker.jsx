import React, { useState, useMemo } from 'react'

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export default function Datepicker({ initialDate = null }) {
  const today = initialDate ? new Date(initialDate) : new Date()
  const [selectedDate, setSelectedDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const formattedDate = selectedDate ? selectedDate.toISOString().slice(0, 10) : ''

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const calendarDays = useMemo(() => {
    const days = []
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
    const prevMonthDays = daysInMonth(currentYear, currentMonth - 1)
    // previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, prevMonthDays - i)
      days.push({ date: d, otherMonth: true })
    }
    // current month days
    const thisMonthDays = daysInMonth(currentYear, currentMonth)
    for (let i = 1; i <= thisMonthDays; i++) {
      const d = new Date(currentYear, currentMonth, i)
      days.push({ date: d, otherMonth: false })
    }
    // next month days to fill 6 weeks (42 cells)
    const nextDays = 42 - days.length
    for (let i = 1; i <= nextDays; i++) {
      const d = new Date(currentYear, currentMonth + 1, i)
      days.push({ date: d, otherMonth: true })
    }
    return days
  }, [currentMonth, currentYear])

  const currentMonthName = useMemo(() => new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' }), [currentMonth, currentYear])

  const toggleCalendar = () => setShowCalendar((s) => !s)
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else setCurrentMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else setCurrentMonth((m) => m + 1)
  }

  const selectDate = (day) => {
    if (day.otherMonth) return
    setSelectedDate(day.date)
    setShowCalendar(false)
  }

  const isSelected = (day) => selectedDate && day.date.toDateString() === selectedDate.toDateString()

  return (
    <div className="relative inline-block">
      <input
        type="text"
        readOnly
        value={formattedDate}
        onClick={toggleCalendar}
        placeholder="Select date"
        className="w-40 p-2 border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-testid="datepicker-input"
      />
      {showCalendar && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-200 rounded">&lt;</button>
            <span className="font-medium">{currentMonthName} {currentYear}</span>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-200 rounded">&gt;</button>
          </div>
          <div className="grid grid-cols-7 text-center mb-1">
            {weekdays.map((d) => (
              <span key={d} className="font-semibold text-gray-700">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 text-center">
            {calendarDays.map((day) => {
              const iso = day.date.toISOString().slice(0, 10)
              const classes = [
                'p-2 cursor-pointer rounded-full',
                day.otherMonth ? 'text-gray-400' : '',
                isSelected(day) ? 'bg-blue-500 text-white' : '',
                !day.otherMonth ? 'hover:bg-blue-100' : '',
              ].join(' ')
              return (
                <button
                  key={iso}
                  onClick={() => selectDate(day)}
                  className={classes}
                  data-testid={`day-${iso}`}
                  type="button"
                >
                  {day.date.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
