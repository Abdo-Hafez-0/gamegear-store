import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, LayoutDashboard, Search, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useQuery } from '@tanstack/react-query'
import { cartApi } from '../services/api.js'
import { useState } from 'react'

export default function Navbar() {
  const { isAuthed, isAdmin, user, logout } = useAuth()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.get(),
    enabled: isAuthed,
  })
  const itemCount = cartData?.data?.items?.reduce((s, i) => s + i.quantity, 0) || 0

  const onSearch = (e) => { e.preventDefault(); navigate(`/products?search=${encodeURIComponent(q)}`) }

  const linkClass = ({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition ${isActive ? 'text-brand-500' : 'text-slate-300 hover:text-white'}`

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="heading-display text-xl text-white flex items-center gap-2">
          <span className="text-brand-500">▲</span> GAMEGEAR
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-4">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Shop</NavLink>
          <NavLink to="/categories" className={linkClass}>Categories</NavLink>
        </nav>
        <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-md ml-4 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search gear..." className="input pl-9" />
        </form>
        <div className="ml-auto flex items-center gap-2">
          {isAuthed ? (
            <>
              <Link to="/cart" className="relative btn-ghost p-2">
                <ShoppingCart size={20} />
                {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-brand-500 text-slate-950 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{itemCount}</span>}
              </Link>
              {isAdmin && (
                <Link to="/admin" className="btn-ghost p-2" title="Admin">
                  <LayoutDashboard size={20} />
                </Link>
              )}
              <Link to="/profile" className="btn-ghost p-2" title={user?.name}><User size={20} /></Link>
              <button onClick={logout} className="btn-ghost p-2" title="Log out"><LogOut size={20} /></button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline hidden sm:inline-flex">Sign in</Link>
              <Link to="/register" className="btn-primary">Join</Link>
            </>
          )}
          <button className="md:hidden btn-ghost p-2" onClick={() => setOpen(!open)}>{open ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-800 px-4 py-3 space-y-2 bg-slate-950">
          <form onSubmit={onSearch} className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="input pl-9" />
          </form>
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" className={linkClass} onClick={() => setOpen(false)}>Shop</NavLink>
          <NavLink to="/categories" className={linkClass} onClick={() => setOpen(false)}>Categories</NavLink>
          {isAuthed && <NavLink to="/orders" className={linkClass} onClick={() => setOpen(false)}>My orders</NavLink>}
        </div>
      )}
    </header>
  )
}
