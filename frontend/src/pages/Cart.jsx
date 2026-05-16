import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi, resolveImage } from '../services/api.js'
import Spinner from '../components/Spinner.jsx'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../components/Modal.jsx'
import { useState } from 'react'

export default function Cart() {
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery({ queryKey: ['cart'], queryFn: cartApi.get })
  const [clearOpen, setClearOpen] = useState(false)

  const upd = useMutation({ mutationFn: ({ id, qty }) => cartApi.update(id, qty), onSuccess: () => qc.invalidateQueries({ queryKey:['cart'] }), onError: e => toast.error(e.message) })
  const rm  = useMutation({ mutationFn: (id) => cartApi.remove(id), onSuccess: () => { toast.success('Removed'); qc.invalidateQueries({ queryKey:['cart'] }) }, onError: e => toast.error(e.message) })
  const clr = useMutation({ mutationFn: () => cartApi.clear(), onSuccess: () => { toast.success('Cart cleared'); qc.invalidateQueries({ queryKey:['cart'] }); setClearOpen(false) }, onError: e => toast.error(e.message) })

  if (isLoading) return <Spinner/>
  if (error) return <p className="max-w-7xl mx-auto p-6 text-red-400">{error.message}</p>
  const items = data?.data?.items || []
  const total = items.reduce((s,i) => s + (i.product?.price || 0) * i.quantity, 0)

  if (items.length === 0) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="heading-display text-3xl mb-2">Your cart is empty</h1>
      <p className="text-slate-400 mb-6">Time to add some gear.</p>
      <Link to="/products" className="btn-primary">Shop products</Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-[1fr_360px] gap-6">
      <div className="space-y-3">
        {items.map(i => {
          const p = i.product || {}
          return (
            <div key={p._id} className="card p-4 flex gap-4 items-center">
              <div className="w-20 h-20 bg-slate-800 rounded overflow-hidden flex-shrink-0">
                {p.images?.[0] && <img src={resolveImage(p.images[0])} alt="" className="w-full h-full object-cover"/>}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${p._id}`} className="font-semibold hover:text-brand-500 line-clamp-1">{p.title}</Link>
                <div className="text-sm text-slate-400">${Number(p.price).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-ghost p-1" disabled={i.quantity <= 1} onClick={() => upd.mutate({id:p._id, qty:i.quantity-1})}><Minus size={14}/></button>
                <span className="w-8 text-center">{i.quantity}</span>
                <button className="btn-ghost p-1" onClick={() => upd.mutate({id:p._id, qty:i.quantity+1})}><Plus size={14}/></button>
              </div>
              <div className="w-24 text-right font-semibold">${(p.price * i.quantity).toFixed(2)}</div>
              <button className="btn-ghost p-2 text-red-400" onClick={() => rm.mutate(p._id)}><Trash2 size={16}/></button>
            </div>
          )
        })}
        <button onClick={() => setClearOpen(true)} className="btn-outline">Clear cart</button>
      </div>
      <aside className="card p-6 h-fit sticky top-20">
        <h3 className="heading-display text-xl mb-4">Order summary</h3>
        <div className="flex justify-between text-sm mb-1"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm mb-1"><span>Shipping</span><span>Free</span></div>
        <div className="border-t border-slate-800 my-3"/>
        <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-brand-500">${total.toFixed(2)}</span></div>
        <Link to="/checkout" className="btn-primary w-full mt-5">Checkout</Link>
      </aside>

      <Modal open={clearOpen} onClose={() => setClearOpen(false)} title="Clear cart?" footer={
        <>
          <button className="btn-outline" onClick={() => setClearOpen(false)}>Cancel</button>
          <button className="btn-danger" onClick={() => clr.mutate()} disabled={clr.isPending}>Clear all</button>
        </>
      }>
        <p className="text-slate-400">This will remove all items from your cart.</p>
      </Modal>
    </div>
  )
}
