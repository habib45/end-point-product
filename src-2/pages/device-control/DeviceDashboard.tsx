import { useState } from 'react'
import { Link } from 'react-router-dom'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_DEVICES = [
  { id: '1', name: 'Kingston DataTraveler 32GB', vendor_id: '0951', product_id: '1666', serial: 'KT32-ABC-001', class: 'USB_STORAGE', whitelisted: false, blacklisted: false, last_seen: '2025-02-22 09:12', action: 'BLOCK' },
  { id: '2', name: 'Samsung T7 Portable SSD', vendor_id: '04e8', product_id: '61f5', serial: 'ST7-XYZ-002', class: 'USB_STORAGE', whitelisted: true, blacklisted: false, last_seen: '2025-02-22 08:45', action: 'ALLOW' },
  { id: '3', name: 'Apple iPhone 15', vendor_id: '05ac', product_id: '12a8', serial: 'APL-iPH-003', class: 'SMARTPHONE', whitelisted: false, blacklisted: false, last_seen: '2025-02-22 08:30', action: 'ALLOW' },
  { id: '4', name: 'SanDisk Ultra 64GB', vendor_id: '0781', product_id: '5581', serial: 'SD64-DEF-004', class: 'USB_STORAGE', whitelisted: false, blacklisted: true, last_seen: '2025-02-22 07:58', action: 'BLOCK' },
  { id: '5', name: 'Logitech MX Keys', vendor_id: '046d', product_id: 'b35b', serial: 'LGT-KBD-005', class: 'USB_HID', whitelisted: true, blacklisted: false, last_seen: '2025-02-22 07:00', action: 'ALLOW' },
  { id: '6', name: 'WD Passport 2TB', vendor_id: '1058', product_id: '25a3', serial: 'WDP-2TB-006', class: 'USB_STORAGE', whitelisted: false, blacklisted: false, last_seen: '2025-02-21 16:30', action: 'READ_ONLY' },
]

export default function DeviceDashboard() {
  const columns = [
    { key: 'name', label: 'Device Name', sortable: true },
    { key: 'class', label: 'Class', sortable: true, render: (v: string) => <span className="badge bg-secondary">{v.replace('_', ' ')}</span> },
    { key: 'vendor_id', label: 'Vendor ID' },
    { key: 'serial', label: 'Serial Number' },
    { key: 'action', label: 'Last Action', render: (v: string) => {
      const map: Record<string,string> = { ALLOW: 'success', BLOCK: 'danger', READ_ONLY: 'warning', ENCRYPT: 'info' }
      return <span className={`badge bg-${map[v]||'secondary'}`}>{v}</span>
    }},
    { key: 'whitelisted', label: 'Allowlisted', render: (v: boolean) => v ? <i className="bi bi-check-circle-fill text-success"/> : <i className="bi bi-dash text-muted"/> },
    { key: 'blacklisted', label: 'Denylisted', render: (v: boolean) => v ? <i className="bi bi-slash-circle-fill text-danger"/> : <i className="bi bi-dash text-muted"/> },
    { key: 'last_seen', label: 'Last Seen', sortable: true },
    { key: 'id', label: 'Actions', render: (v: string, row: any) => (
      <div className="d-flex gap-1">
        <button className="btn btn-sm btn-outline-success" title="Allowlist"><i className="bi bi-check-circle"/></button>
        <button className="btn btn-sm btn-outline-danger" title="Denylist"><i className="bi bi-slash-circle"/></button>
        <button className="btn btn-sm btn-outline-secondary" title="Details"><i className="bi bi-info-circle"/></button>
      </div>
    )},
  ]

  return (
    <>
      <ContentHeader title="Device Control" breadcrumbs={[{label:'Home'},{label:'Device Control'}]} />

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Connected Today', value: '347', icon: 'bi-usb-symbol', color: 'primary' },
          { label: 'Blocked', value: '56', icon: 'bi-slash-circle', color: 'danger' },
          { label: 'Allowlisted', value: '128', icon: 'bi-check-circle', color: 'success' },
          { label: 'Denylisted', value: '23', icon: 'bi-ban', color: 'warning' },
        ].map(s => (
          <div className="col-6 col-lg-3" key={s.label}>
            <div className="card border-0 shadow-sm" style={{borderRadius:12}}>
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

      {/* Nav tabs for sub-sections */}
      <div className="card border-0 shadow-sm" style={{borderRadius:16}}>
        <div className="card-header bg-transparent border-0 pt-4 px-4">
          <ul className="nav nav-tabs card-header-tabs">
            {[
              {label:'All Devices', icon:'bi-usb-symbol', active:true, link:'/device-control'},
              {label:'Computers', icon:'bi-pc-display', link:'/device-control/computers'},
              {label:'Users', icon:'bi-people', link:'/device-control/users'},
              {label:'Groups', icon:'bi-collection', link:'/device-control/groups'},
              {label:'Classes', icon:'bi-tags', link:'/device-control/classes'},
            ].map(t => (
              <li className="nav-item" key={t.label}>
                <Link className={`nav-link d-flex align-items-center gap-1 ${t.active?'active':''}`} to={t.link||'#'}>
                  <i className={`bi ${t.icon}`}/> {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body p-4">
          <DataTable columns={columns} data={MOCK_DEVICES} title="Connected Devices" searchable sortable paginate />
        </div>
      </div>
    </>
  )
}
