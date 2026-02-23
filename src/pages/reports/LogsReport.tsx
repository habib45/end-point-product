import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_LOGS = [
  { id:'1', level:'ERROR', module:'DEVICE_CONTROL', message:'USB device blocked: KT32-ABC-001', user:'j.smith', computer:'WS-FINANCE-01', timestamp:'2025-02-22 09:12:34' },
  { id:'2', level:'WARNING', module:'CONTENT_AWARE', message:'Sensitive content pattern matched: Credit Card x3', user:'a.jones', computer:'WS-HR-05', timestamp:'2025-02-22 08:50:12' },
  { id:'3', level:'INFO', module:'POLICY_ENGINE', message:'Policy applied: Global USB Policy → WS-FINANCE-01', user:'system', computer:'WS-FINANCE-01', timestamp:'2025-02-22 08:45:00' },
  { id:'4', level:'CRITICAL', module:'ENCRYPTION', message:'EasyLock bypass attempt detected on device ST7-XYZ-002', user:'r.patel', computer:'WS-LEGAL-03', timestamp:'2025-02-22 07:45:22' },
  { id:'5', level:'INFO', module:'DIRECTORY_SYNC', message:'AD sync completed: 2847 users synchronized', user:'system', computer:'SERVER-01', timestamp:'2025-02-22 06:00:00' },
  { id:'6', level:'WARNING', module:'LICENSE', message:'License expiring in 14 days (expires 2025-03-08)', user:'system', computer:'SERVER-01', timestamp:'2025-02-22 00:00:00' },
]

const LEVEL_COLOR: Record<string,string> = { CRITICAL:'danger', ERROR:'danger', WARNING:'warning', INFO:'info' }

export default function LogsReport() {
  const [levelFilter, setLevelFilter] = useState('ALL')
  const filtered = levelFilter === 'ALL' ? MOCK_LOGS : MOCK_LOGS.filter(l => l.level === levelFilter)

  return (
    <>
      <ContentHeader title="System Logs" breadcrumbs={[{label:'Reports',path:'/reports'},{label:'Logs'}]} />
      <div className="card border-0 shadow-sm" style={{borderRadius:16}}>
        <div className="card-header bg-transparent border-0 pt-4 px-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="mb-0 fw-bold">Log Entries</h6>
            <div className="d-flex gap-2 flex-wrap">
              {['ALL','CRITICAL','ERROR','WARNING','INFO'].map(l=>(
                <button key={l} onClick={()=>setLevelFilter(l)}
                  className={`btn btn-sm ${levelFilter===l?`btn-${LEVEL_COLOR[l]||'secondary'}`:`btn-outline-${LEVEL_COLOR[l]||'secondary'}`}`}>{l}</button>
              ))}
              <button className="btn btn-sm btn-outline-primary"><i className="bi bi-download me-1"/>Export</button>
            </div>
          </div>
        </div>
        <div className="card-body p-4 pt-0">
          <DataTable
            columns={[
              {key:'level', label:'Level', render:(v:string)=><span className={`badge bg-${LEVEL_COLOR[v]||'secondary'}`}>{v}</span>},
              {key:'module', label:'Module', render:(v:string)=><code className="small">{v}</code>},
              {key:'message', label:'Message', render:(v:string)=><span className="small">{v}</span>},
              {key:'user', label:'User'},
              {key:'computer', label:'Computer'},
              {key:'timestamp', label:'Timestamp', sortable:true},
            ]}
            data={filtered} searchable
          />
        </div>
      </div>
    </>
  )
}
