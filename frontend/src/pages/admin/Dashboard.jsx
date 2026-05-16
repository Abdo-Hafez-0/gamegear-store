import { useQuery } from '@tanstack/react-query'
import { productApi, categoryApi, orderApi } from '../../services/api.js'
import { Package, Tag, ShoppingBag } from 'lucide-react'

export default function AdminDashboard() {
  const p = useQuery({ queryKey: ['products'], queryFn: () => productApi.list() })
  const c = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list })
  const o = useQuery({ queryKey: ['admin','orders'], queryFn: () => orderApi.all({ page:1, limit:5 }) })
  const cards = [
    { i: Package, l: 'Products', v: (p.data?.data || p.data?.products || []).length },
    { i: Tag, l: 'Categories', v: (c.data?.data || []).length },
    { i: ShoppingBag, l: 'Recent orders', v: (o.data?.data || o.data?.orders || []).length },
  ]
  return (
    <div>
      <h1 className="heading-display text-2xl mb-6">Overview</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map(({i:Icon,l,v}) => (
          <div key={l} className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center"><Icon/></div>
            <div><div className="text-2xl font-bold">{v}</div><div className="text-sm text-slate-400">{l}</div></div>
          </div>
        ))}
      </div>
    </div>
  )
}
