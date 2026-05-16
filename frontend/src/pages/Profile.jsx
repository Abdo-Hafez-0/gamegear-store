import { useAuth } from '../context/AuthContext.jsx'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '../services/api.js'
import Spinner from '../components/Spinner.jsx'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { logout } = useAuth()
  const { data, isLoading, error } = useQuery({ queryKey: ['profile'], queryFn: authApi.profile })
  if (isLoading) return <Spinner/>
  if (error) return <p className="max-w-3xl mx-auto p-6 text-red-400">{error.message}</p>
  const u = data.user
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="card p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-500/20 border border-brand-500 flex items-center justify-center heading-display text-2xl text-brand-500">{u.name?.[0]?.toUpperCase()}</div>
          <div>
            <h1 className="heading-display text-2xl">{u.name}</h1>
            <p className="text-sm text-slate-400">{u.email} · <span className="chip">{u.role}</span></p>
          </div>
        </div>
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div><dt className="text-slate-400">Phone</dt><dd>{u.phone || '—'}</dd></div>
          <div><dt className="text-slate-400">Address</dt><dd>{u.address || '—'}</dd></div>
          <div><dt className="text-slate-400">Member since</dt><dd>{new Date(u.createdAt).toLocaleDateString()}</dd></div>
        </dl>
        <div className="mt-8 flex gap-3">
          <Link to="/orders" className="btn-outline">My orders</Link>
          <button onClick={logout} className="btn-danger">Log out</button>
        </div>
      </div>
    </div>
  )
}
