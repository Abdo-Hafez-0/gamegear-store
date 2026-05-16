import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi, resolveImage } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { ShoppingCart, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function ProductCard({ product }) {
  const { isAuthed } = useAuth()
  const qc = useQueryClient()
  const add = useMutation({
    mutationFn: () => cartApi.add(product._id),
    onSuccess: () => { toast.success('Added to cart'); qc.invalidateQueries({ queryKey: ['cart'] }) },
    onError: (e) => toast.error(e.message),
  })
  const img = product.images?.[0]
  return (
    <motion.div whileHover={{ y: -4 }} className="card overflow-hidden group">
      <Link to={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-slate-800">
        {img ? (
          <img src={resolveImage(img)} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition" loading="lazy" onError={(e)=>{e.currentTarget.style.display='none'}}/>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No image</div>
        )}
        {product.stock <= 0 && <span className="absolute top-2 left-2 chip bg-red-900 text-red-200">Out of stock</span>}
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>{product.brand}</span>
          {product.rating ? (<><span>·</span><span className="flex items-center gap-1"><Star size={12} className="fill-yellow-400 stroke-yellow-400"/>{product.rating}</span></>) : null}
        </div>
        <Link to={`/products/${product._id}`} className="font-semibold text-slate-100 hover:text-brand-500 line-clamp-1">{product.title}</Link>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-brand-500">${Number(product.price).toFixed(2)}</span>
          <button
            disabled={!product.stock || add.isPending}
            onClick={() => isAuthed ? add.mutate() : toast.error('Please sign in')}
            className="btn-primary px-3 py-2"
          ><ShoppingCart size={16}/></button>
        </div>
      </div>
    </motion.div>
  )
}
