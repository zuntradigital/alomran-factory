import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main role="main" className="flex-1 pt-[68px]">
        <div key={pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
