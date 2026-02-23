import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const toggleSidebar = () => setSidebarOpen(prev => !prev)

  return (
    <div className={`app-wrapper ${sidebarOpen ? '' : 'sidebar-collapse'}`}>
      {/* Sidebar — sits as a flex child on the left */}
      <Sidebar />

      {/* Right column: navbar + content + footer */}
      <div className="app-body">
        <Navbar onToggleSidebar={toggleSidebar} />

        <main className="app-main">
          <div className="container-fluid py-3">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
