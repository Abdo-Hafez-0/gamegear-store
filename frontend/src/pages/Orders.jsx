import { useQuery } from '@tanstack/react-query'
import { orderApi } from '../services/api.js'
import Spinner from '../components/Spinner.jsx'

const STATUS = {
  Pending: 'bg-yellow-900 text-yellow-300',
  Processing: 'bg-blue-900 text-blue-300',
  Shipped: 'bg-purple-900 text-purple-300',
  Delivered: 'bg-green-900 text-green-300',
}

export default function Orders() {
  const { data, isLoading, error } = useQuery({ queryKey: ['orders'], queryFn: orderApi.mine })
  if (isLoading) return <Spinner/>
  if (error) return <p className="max-w-5xl mx-auto p-6 text-red-400">{error.message}</p>
  const orders = data?.data || data?.orders || []
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="heading-display text-3xl mb-6">My orders</h1>
      {orders.length === 0 ? <p className="text-slate-400">You haven't placed any orders yet.</p> : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <div className="text-xs text-slate-400">Order #{o._id?.slice(-8)}</div>
                  <div className="text-sm">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <span className={`chip ${STATUS[o.orderStatus] || ''}`}>{o.orderStatus}</span>
              </div>
              <ul className="text-sm space-y-1">
                {(o.items || o.products || []).map((it, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{it.product?.title || it.title || 'Product'} × {it.quantity}</span>
                    <span>${((it.price ?? it.product?.price ?? 0) * it.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-slate-800 mt-3 pt-3 flex justify-between text-sm">
                <span className="text-slate-400">{o.paymentMethod} · {o.shippingAddress}</span>
                <span className="font-bold">Total: <span className="text-brand-500">${Number(o.totalPrice || 0).toFixed(2)}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
