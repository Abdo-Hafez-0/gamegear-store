import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '../../services/api.js'
import Spinner from '../../components/Spinner.jsx'
import { useState } from 'react'
import toast from 'react-hot-toast'

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered']

export default function AdminOrders() {
  const [page, setPage] = useState(1)
  const limit = 10
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery({ queryKey: ['admin','orders', page], queryFn: () => orderApi.all({ page, limit }) })
  const upd = useMutation({
    mutationFn: ({ id, status }) => orderApi.updateStatus(id, status),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['admin','orders'] }) },
    onError: e => toast.error(e.message),
  })
  if (isLoading) return <Spinner/>
  if (error) return <p className="text-red-400">{error.message}</p>
  const orders = data?.data || data?.orders || []
  const totalPages = data?.totalPages || data?.pages || 1
  return (
    <div>
      <h1 className="heading-display text-2xl mb-6">Orders</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400 border-b border-slate-800">
            <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Payment</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-b border-slate-800 last:border-none">
                <td className="p-3">
                  <div className="font-medium">#{o._id?.slice(-8)}</div>
                  <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="p-3">{o.user?.name || o.user?.email || '—'}</td>
                <td className="p-3">${Number(o.totalPrice || 0).toFixed(2)}</td>
                <td className="p-3">{o.paymentMethod}</td>
                <td className="p-3">
                  <select value={o.orderStatus} disabled={upd.isPending} onChange={e=>upd.mutate({id:o._id, status:e.target.value})} className="input py-1">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-500">No orders yet</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 text-sm">
        <button className="btn-outline" disabled={page <= 1} onClick={()=>setPage(p=>p-1)}>← Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button className="btn-outline" disabled={page >= totalPages} onClick={()=>setPage(p=>p+1)}>Next →</button>
      </div>
    </div>
  )
}
