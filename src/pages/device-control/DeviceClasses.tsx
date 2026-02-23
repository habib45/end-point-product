import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_CLASSES = [
  { id:'1', name:'USB_STORAGE', desc:'USB Storage Devices (flash drives, portable HDDs)', is_custom:false, devices:347, action:'BLOCK' },
  { id:'2', name:'USB_HID', desc:'USB Human Interface Devices (keyboards, mice)', is_custom:false, devices:1024, action:'ALLOW' },
  { id:'3', name:'CD_DVD', desc:'Optical disc drives (CD, DVD, Blu-ray)', is_custom:false, devices:23, action:'BLOCK' },
  { id:'4', name:'PRINTER', desc:'Printing devices (local and network)', is_custom:false, devices:89, action:'ALLOW' },
  { id:'5', name:'NETWORK_ADAPTER', desc:'Network interface cards and USB adapters', is_custom:false, devices:56, action:'READ_ONLY' },
  { id:'6', name:'BLUETOOTH', desc:'Bluetooth controllers and paired devices', is_custom:false, devices:412, action:'BLOCK' },
  { id:'7', name:'CARD_READER', desc:'Smart card and SD card readers', is_custom:false, devices:67, action:'READ_ONLY' },
  { id:'8', name:'SMARTPHONE', desc:'Smartphones and tablets (iOS, Android)', is_custom:false, devices:238, action:'BLOCK' },
  { id:'9', name:'EXTERNAL_HDD', desc:'External hard disk drives', is_custom:false, devices:45, action:'ENCRYPT' },
  { id:'10', name:'CAMERA', desc:'Digital cameras and webcams', is_custom:false, devices:34, action:'ALLOW' },
  { id:'11', name:'APPROVED_VENDORS', desc:'Custom class: approved vendor USB drives only', is_custom:true, devices:128, action:'ALLOW' },
  { id:'12', name:'ENCRYPTED_ONLY', desc:'Custom class: devices requiring encryption', is_custom:true, devices:56, action:'ENCRYPT' },
]

const ACTION_COLOR: Record<string,string> = { ALLOW:'success', BLOCK:'danger', READ_ONLY:'warning', ENCRYPT:'info' }

export default function DeviceClasses() {
  const [showModal, setShowModal] = useState(false)

  const columns = [
    { key:'name', label:'Class Name', sortable:true, render:(v:string, row:any)=>(
      <div className="d-flex align-items-center gap-2">
        {row.is_custom && <span className="badge bg-purple-subtle text-purple border" style={{fontSize:'0.65rem'}}>CUSTOM</span>}
        <code className="fw-bold text-dark" style={{fontSize:'0.82rem'}}>{v}</code>
      </div>
    )},
    { key:'desc', label:'Description', render:(v:string)=><span className="text-muted small">{v}</span> },
    { key:'devices', label:'Devices', sortable:true, render:(v:number)=>
      <span className="badge bg-secondary rounded-pill">{v.toLocaleString()}</span>
    },
    { key:'action', label:'Default Action', render:(v:string)=>
      <span className={`badge bg-${ACTION_COLOR[v]||'secondary'}`}>{v.replace('_',' ')}</span>
    },
    { key:'is_custom', label:'Type', render:(v:boolean)=>
      v ? <span className="badge bg-warning text-dark">Custom</span>
        : <span className="badge bg-light text-dark border">Built-in</span>
    },
    { key:'id', label:'Actions', render:(_:string, row:any)=>(
      <div className="d-flex gap-1">
        <button className="btn btn-sm btn-outline-primary" title="Edit Action"><i className="bi bi-pencil"/></button>
        {row.is_custom && <button className="btn btn-sm btn-outline-danger" title="Delete"><i className="bi bi-trash"/></button>}
      </div>
    )},
  ]

  return (
    <>
      <ContentHeader title="Device Classes" breadcrumbs={[{label:'Device Control'},{label:'Device Classes'}]} />

      <div className="row g-3 mb-4">
        {[
          { label:'Total Classes', value: MOCK_CLASSES.length, icon:'bi-tag', color:'primary' },
          { label:'Custom Classes', value: MOCK_CLASSES.filter(c=>c.is_custom).length, icon:'bi-plus-circle', color:'warning' },
          { label:'Blocked Classes', value: MOCK_CLASSES.filter(c=>c.action==='BLOCK').length, icon:'bi-slash-circle', color:'danger' },
          { label:'Total Devices', value: MOCK_CLASSES.reduce((s,c)=>s+c.devices,0).toLocaleString(), icon:'bi-usb-symbol', color:'info' },
        ].map(s=>(
          <div className="col-6 col-lg-3" key={s.label}>
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div className={`rounded-3 d-flex align-items-center justify-content-center bg-${s.color}-subtle`} style={{width:44,height:44}}>
                  <i className={`bi ${s.icon} text-${s.color} fs-5`}/>
                </div>
                <div>
                  <div className="small text-muted">{s.label}</div>
                  <div className="fw-bold fs-5">{s.value}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
          <h6 className="mb-0 fw-semibold">All Device Classes</h6>
          <button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}>
            <i className="bi bi-plus-lg me-1"/>Custom Class
          </button>
        </div>
        <div className="card-body p-0">
          <DataTable columns={columns} data={MOCK_CLASSES} searchable />
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Custom Device Class</h5>
                <button className="btn-close" onClick={()=>setShowModal(false)}/>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Class Name</label>
                    <input className="form-control font-monospace" placeholder="e.g. APPROVED_USB_ONLY"/>
                    <div className="form-text">Use uppercase with underscores</div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea className="form-control" rows={2}/>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Default Action</label>
                    <select className="form-select">
                      <option>ALLOW</option>
                      <option>BLOCK</option>
                      <option>READ_ONLY</option>
                      <option>ENCRYPT</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Classification Criteria</label>
                    <div className="row g-2">
                      <div className="col-4"><input className="form-control form-control-sm" placeholder="Vendor ID"/></div>
                      <div className="col-4"><input className="form-control form-control-sm" placeholder="Product ID"/></div>
                      <div className="col-4"><input className="form-control form-control-sm" placeholder="Serial Pattern"/></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={()=>setShowModal(false)}>Create Class</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
