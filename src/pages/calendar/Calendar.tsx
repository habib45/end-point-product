import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import toast from 'react-hot-toast'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

interface CalEvent {
  day: number
  title: string
  type: 'meeting' | 'deadline' | 'reminder' | 'event'
}

const EVENTS: CalEvent[] = [
  { day: 3, title: 'Team Standup', type: 'meeting' },
  { day: 7, title: 'Project Deadline', type: 'deadline' },
  { day: 10, title: 'Client Call', type: 'meeting' },
  { day: 14, title: 'Pay Invoices', type: 'reminder' },
  { day: 18, title: 'Product Launch', type: 'event' },
  { day: 22, title: 'Board Meeting', type: 'meeting' },
  { day: 25, title: 'Sprint Review', type: 'deadline' },
  { day: 28, title: 'Team Outing', type: 'event' },
]

const TYPE_COLORS = { meeting: 'primary', deadline: 'danger', reminder: 'warning', event: 'success' }

export default function Calendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1)

  return (
    <>
      <ContentHeader title="Calendar" breadcrumbs={[{ label: 'Calendar' }]} />

      <div className="row g-3">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom d-flex align-items-center justify-content-between">
              <button className="btn btn-outline-secondary btn-sm" onClick={prev}>
                <i className="bi bi-chevron-left"></i>
              </button>
              <h5 className="mb-0 fw-semibold">{MONTHS[month]} {year}</h5>
              <button className="btn btn-outline-secondary btn-sm" onClick={next}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
            <div className="card-body p-0">
              <div className="row g-0">
                {DAYS.map(d => (
                  <div key={d} className="col text-center py-2 small fw-semibold text-muted border-bottom bg-body-tertiary">
                    {d}
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {cells.map((day, i) => {
                  const events = day ? EVENTS.filter(e => e.day === day) : []
                  const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                  return (
                    <div
                      key={i}
                      className={`border-end border-bottom p-1 ${!day ? 'bg-body-tertiary' : ''}`}
                      style={{ minHeight: 80, cursor: day ? 'pointer' : 'default' }}
                      onClick={() => day && toast.success(`Day ${day}`)}
                    >
                      {day && (
                        <>
                          <span className={`d-inline-flex align-items-center justify-content-center rounded-circle ${isToday ? 'bg-primary text-white' : ''}`}
                            style={{ width: 28, height: 28, fontSize: 13, fontWeight: isToday ? 700 : 400 }}>
                            {day}
                          </span>
                          {events.map((e, j) => (
                            <div key={j} className={`bg-${TYPE_COLORS[e.type]}-subtle text-${TYPE_COLORS[e.type]} rounded px-1 mt-1`}
                              style={{ fontSize: 11, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              {e.title}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">Upcoming Events</h5>
              <button className="btn btn-sm btn-primary" onClick={() => toast.success('Add event')}>
                <i className="bi bi-plus-lg"></i>
              </button>
            </div>
            <div className="card-body p-0">
              {EVENTS.map((e, i) => (
                <div key={i} className="d-flex align-items-center gap-3 px-3 py-2 border-bottom">
                  <div className={`bg-${TYPE_COLORS[e.type]} rounded-2 text-white d-flex align-items-center justify-content-center flex-shrink-0`}
                    style={{ width: 36, height: 36, fontWeight: 700, fontSize: 13 }}>
                    {e.day}
                  </div>
                  <div>
                    <p className="mb-0 small fw-semibold">{e.title}</p>
                    <small className={`text-${TYPE_COLORS[e.type]}`}>{e.type}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom">
              <h5 className="mb-0 fw-semibold">Event Types</h5>
            </div>
            <div className="card-body">
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <div key={type} className="d-flex align-items-center gap-2 mb-2">
                  <div className={`bg-${color} rounded-circle`} style={{ width: 10, height: 10 }}></div>
                  <span className="text-capitalize small">{type}</span>
                  <span className="ms-auto badge bg-secondary-subtle text-secondary">{EVENTS.filter(e => e.type === type).length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
