import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(6, 'Phone required'),
  address: z.string().min(2, 'Address required'),
})

export default function Register() {
  const { register: signUp } = useAuth()
  const nav = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      const user = await signUp(data)
      toast.success(`Welcome, ${user.name}!`)
      nav(user.role === 'admin' ? '/admin' : '/', { replace: true })
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card p-8">
        <h1 className="heading-display text-2xl mb-1">Create account</h1>
        <p className="text-sm text-slate-400 mb-6">Join GameGear in under a minute.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { n: 'name', l: 'Full name' },
            { n: 'email', l: 'Email', t: 'email' },
            { n: 'password', l: 'Password', t: 'password' },
            { n: 'phone', l: 'Phone' },
            { n: 'address', l: 'Address' },
          ].map(({ n, l, t = 'text' }) => (
            <div key={n}>
              <label className="label">{l}</label>
              <input className="input" type={t} {...register(n)} />
              {errors[n] && <p className="text-red-400 text-xs mt-1">{errors[n].message}</p>}
            </div>
          ))}
          <button disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? 'Creating...' : 'Create account'}</button>
        </form>
        <p className="text-sm text-slate-400 mt-4">Already have an account? <Link to="/login" className="text-brand-500 hover:underline">Sign in</Link></p>
      </div>
    </div>
  )
}
