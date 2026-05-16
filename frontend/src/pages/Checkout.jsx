import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi, orderApi } from '../services/api.js'
import Spinner from '../components/Spinner.jsx'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const { user } = useAuth()
  const nav = useNavigate()
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['cart'], queryFn: cartApi.get })
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { shippingAddress: user?.address || '', paymentMethod: 'Cash' }
  })

  const create = useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => { toast.success('Order placed!'); qc.invalidateQueries({ queryKey:['cart'] }); qc.invalidateQueries({ queryKey:['orders'] }); nav('/orders') },
    onError: e => toast.error(e.message),
  })

  if (isLoading) return <Spinner/>
  const items = data?.data?.items || []
  const total = items.reduce((s,i) => s + (i.product?.price || 0) * i.quantity, 0)

  const onSubmit = (vals) => create.mutate(vals)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-[1fr_360px] gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
        <h1 className="heading-display text-2xl mb-2">Checkout</h1>
        <div>
          <label className="label">Shipping address</label>
          <textarea className="input" rows={3} {...register('shippingAddress', { required: true })}/>
        </div>
        <div>
          <label className="label">Payment method</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer card p-3">
              <input type="radio" value="Cash" {...register('paymentMethod')} defaultChecked/> Cash on delivery
            </label>
            <label className="flex items-center gap-2 opacity-50 cursor-not-allowed card p-3">
              <input type="radio" disabled/> Credit Card <span className="chip ml-auto">Coming soon</span>
            </label>
            <label className="flex items-center gap-2 opacity-50 cursor-not-allowed card p-3">
              <input type="radio" disabled/> PayPal <span className="chip ml-auto">Coming soon</span>
            </label>
          </div>
        </div>
        <button disabled={isSubmitting || create.isPending || items.length === 0} className="btn-primary w-full">{create.isPending ? 'Placing order...' : 'Place order'}</button>
      </form>
      <aside className="card p-6 h-fit">
        <h3 className="heading-display text-xl mb-4">Summary</h3>
        <ul className="space-y-1 text-sm">
          {items.map(i => (
            <li key={i.product?._id} className="flex justify-between">
              <span className="truncate pr-2">{i.product?.title} × {i.quantity}</span>
              <span>${((i.product?.price||0) * i.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-slate-800 my-3"/>
        <div className="flex justify-between font-bold"><span>Total</span><span className="text-brand-500">${total.toFixed(2)}</span></div>
      </aside>
    </div>
  )
}
