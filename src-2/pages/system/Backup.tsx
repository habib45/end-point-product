import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_BACKUPS = [
  { id:'1', name:'Daily Auto Backup', type:'FULL', status:'COMPLETED', size:'4.2 GB', path:'/backups/daily/2025-02-22.tar.gz', start:'2025-02-22 02:00:00', end:'2025-02-22 02:47:12', created_by:'system' },
  { id:'2', name:'Weekly Incremental', type:'INCREMENTAL', status:'COMPLETED', size:'890 MB', path:'/backups/weekly/2025-02-22.tar.gz', start:'2025-02-22 03:00:00', end:'2025-02-22 03:12:05', created_by:'system' },
  { id:'3', name:'Pre-upgrade Backup', type:'FULL', status:'COMPLETED', size:'4.1 GB', path:'/backups/manual/pre-upgrade-2025-02-21.tar.gz', start:'2025-02-21 18:00:00', end:'2025-02-21 18:52:00', created_by:'admin' },
  { id:'4', name:'Daily Auto Backup', type:'FULL', status:'FAILED', size:null, path:null, start:'2025-02-21 02:00:00', end:'2025-02-21 02:03:00', created_by:'system' },
  { id:'5', name:'Config-Only Backup', type:'DIFFERENTIAL', status:'COMPLETED', size:'120 MB', path:'/backups/config/2025-02-20.tar.gz', start:'2025-02-20 22:00:00', end:'2025-02-20 22:05:00', created_by:'admin' },
]

const MOCK_SNAPSHOTS = [
  { id:'1', name:'System Snapshot v1.2 → v1.3 upgrade', type:'SYSTEM', status:'COMPLETED', size:'8.4 GB', start:'2025-02-21 17:55:00', end:'2025-02-21 18:32:00', created_by:'admin' },
  { id:'2', name:'Configuration Snapshot Jan 2025', type:'CONFIGURATION', status:'COMPLETED', size:'45 MB', start:'2025-01-31 23:00:00', end:'2025-01-31 23:02:00', created_by:'system' },
  { id:'3', name:'Database Snapshot Q4 Compliance', type:'DATABASE', status:'COMPLETED', size:'2.1 GB', start:'2025-01-15 22:00:00', end:'2025-01-15 22:18:00', created_by:'admin' },
]

const STATUS_COLOR: Record<string,string> = { COMPLETED:'success', RUNNING:'primary', FAILED:'danger', CANCELLED:'secondary' }
const TYPE_COLOR: Record<string,string> = { FULL:'primary', INCREMENTAL:'info', DIFFERENTIAL:'warning' }

export default function Backup() {
  const [tab, setTab] = useState<'backups'|'snapshots'>('backups')
  const [runningBackup, setRunningBackup] = useState(false)

  const backupCols = [
    { key:'name', label:'Backup Name', sortable:true, render:(v:string,row:any)=>(
      <div>
        <div className="fw-semibold small">{v}</div>
        <div className="text-muted" style={{fontSize:'0.72rem'}}>{row.path || 'No file generated'}</div>
      </div>
    )},
    { key:'type', label:'Type', render:(v:string)=>
      <span className={`badge bg-${TYPE_COLOR[v]||'secondary'}`}>{v}</span>
    },
    { key:'status', label:'Status', render:(v:string)=>
      <span className={`badge bg-${STATUS_COLOR[v]||'secondary'}`}>{v}</span>
    },
    { key:'size', label:'Size', render:(v:string|null)=>v||<span className="text-muted">—</span> },
    { key:'start', label:'Started', sortable:true },
    { key:'created_by', label:'By', render:(v:string)=>
      <span className={`badge bg-${v==='system'?'secondary':'info'}`}>{v}</span>
    },
    { key:'id', label:'Actions', render:(_:string, row:any)=>(
      <div className="d-flex gap-1">
        {row.status==='COMPLETED' && <button className="btn btn-sm btn-outline-success" title="Restore"><i className="bi bi-arrow-counterclockwise"/></button>}
        {row.status==='COMPLETED' && <button className="btn btn-sm btn-outline-secondary" title="Download"><i className="bi bi-download"/></button>}
        <button className="btn btn-sm btn-outline-danger" title="Delete"><i className="bi bi-trash"/></button>
      </div>
    )},
  ]

  const snapshotCols = [
    { key:'name', label:'Snapshot Name', sortable:true, render:(v:string)=><span className="fw-semibold small">{v}</span> },
    { key:'type', label:'Type', render:(v:string)=>
      <span className="badge bg-secondary">{v}</span>
    },
    { key:'status', label:'Status', render:(v:string)=>
      <span className={`badge bg-${STATUS_COLOR[v]||'secondary'}`}>{v}</span>
    },
    { key:'size', label:'Size' },
    { key:'start', label:'Created', sortable:true },
    { key:'created_by', label:'By' },
    { key:'id', label:'Actions', render:()=>(
      <div className="d-flex gap-1">
        <button className="btn btn-sm btn-outline-warning" title="Restore to this point"><i className="bi bi-clock-history"/></button>
        <button className="btn btn-sm btn-outline-secondary" title="Download"><i className="bi bi-download"/></button>
      </div>
    )},
  ]

  return (
    <>
      <ContentHeader title="Backup & Maintenance" breadcrumbs={[{label:'System'},{label:'Backup & Maintenance'}]} />

      {/* Storage Health */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <h6 className="fw-semibold mb-3">Storage Utilization</h6>
              {[
                { label:'Backup Storage', used:62, total:'100 GB', color:'primary' },
                { label:'Log Storage', used:34, total:'50 GB', color:'info' },
                { label:'Shadow Files', used:78, total:'200 GB', color:'warning' },
              ].map(s=>(
                <div className="mb-3" key={s.label}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small fw-semibold">{s.label}</span>
                    <span className="small text-muted">{s.used}% of {s.total}</span>
                  </div>
                  <div className="progress" style={{height:8}}>
                    <div className={`progress-bar bg-${s.color} ${s.used>75?'bg-danger':''}`} style={{width:`${s.used}%`}}/>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-6">
              <h6 className="fw-semibold mb-3">Quick Actions</h6>
              <div className="d-flex flex-column gap-2">
                <button
                  className={`btn btn-${runningBackup?'secondary':'primary'} d-flex align-items-center gap-2`}
                  disabled={runningBackup}
                  onClick={()=>{setRunningBackup(true);setTimeout(()=>setRunningBackup(false),3000)}}
                >
                  {runningBackup
                    ? <><span className="spinner-border spinner-border-sm"/>Running Backup...</>
                    : <><i className="bi bi-hdd"/>Run Full Backup Now</>
                  }
                </button>
                <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                  <i className="bi bi-camera"/>Create System Snapshot
                </button>
                <button className="btn btn-outline-warning d-flex align-items-center gap-2">
                  <i className="bi bi-trash"/>Purge Old Logs (90+ days)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Schedule */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 py-3">
          <h6 className="mb-0 fw-semibold">Backup Schedule</h6>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {[
              { label:'Full Backup', schedule:'Daily at 02:00', next:'2025-02-23 02:00', enabled:true },
              { label:'Incremental Backup', schedule:'Daily at 03:00', next:'2025-02-23 03:00', enabled:true },
              { label:'Weekly Archive', schedule:'Sunday at 01:00', next:'2025-03-01 01:00', enabled:true },
              { label:'Config Snapshot', schedule:'Monthly on 1st', next:'2025-03-01 22:00', enabled:false },
            ].map(s=>(
              <div className="col-md-6 col-lg-3" key={s.label}>
                <div className="card border h-100">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <span className="fw-semibold small">{s.label}</span>
                      <div className="form-check form-switch mb-0">
                        <input className="form-check-input" type="checkbox" defaultChecked={s.enabled}/>
                      </div>
                    </div>
                    <div className="text-muted mt-2" style={{fontSize:'0.78rem'}}>
                      <div><i className="bi bi-clock me-1"/>{s.schedule}</div>
                      <div className="mt-1"><i className="bi bi-arrow-right me-1"/>Next: {s.next}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <ul className="nav nav-tabs border-0 mb-0">
            <li className="nav-item">
              <button className={`nav-link ${tab==='backups'?'active fw-semibold':''}`} onClick={()=>setTab('backups')}>
                <i className="bi bi-hdd me-1"/>Backup Jobs
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab==='snapshots'?'active fw-semibold':''}`} onClick={()=>setTab('snapshots')}>
                <i className="bi bi-camera me-1"/>System Snapshots
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body p-0">
          {tab==='backups'
            ? <DataTable columns={backupCols} data={MOCK_BACKUPS} />
            : <DataTable columns={snapshotCols} data={MOCK_SNAPSHOTS} />
          }
        </div>
      </div>
    </>
  )
}
