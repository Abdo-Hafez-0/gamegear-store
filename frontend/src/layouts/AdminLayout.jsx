import { NavLink, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { LayoutDashboard, Package, Tag, ShoppingBag } from 'lucide-react'

const links = [
  { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="card p-3 h-fit sticky top-20">
          <div className="heading-display text-sm text-slate-400 px-2 mb-2">ADMIN</div>
          <nav className="flex flex-col gap-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${isActive ? 'bg-brand-500/10 text-brand-500' : 'text-slate-300 hover:bg-slate-800'}`}>
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section><Outlet /></section>
      </div>
    </div>
  )
}
