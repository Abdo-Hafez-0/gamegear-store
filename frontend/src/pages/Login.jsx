import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
})

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      const user = await login(data)
      toast.success(`Welcome back, ${user.name}`)
      const to = loc.state?.from?.pathname || (user.role === 'admin' ? '/admin' : '/')
      nav(to, { replace: true })
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card p-8">
        <h1 className="heading-display text-2xl mb-1">Sign in</h1>
        <p className="text-sm text-slate-400 mb-6">Log in to access your cart and orders.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" {...register('email')} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" {...register('password')} />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="text-sm text-slate-400 mt-4">No account? <Link to="/register" className="text-brand-500 hover:underline">Create one</Link></p>
      </div>
    </div>
  )
}
