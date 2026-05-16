import { Link } from 'react-router-dom'
import { resolveImage } from '../services/api.js'

export default function CategoryCard({ category }) {
  return (
    <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="card overflow-hidden group block">
      <div className="aspect-[4/3] bg-slate-800 overflow-hidden">
        {category.image ? (
          <img src={resolveImage(category.image)} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition" onError={(e)=>{e.currentTarget.style.display='none'}}/>
        ) : <div className="w-full h-full flex items-center justify-center heading-display text-2xl text-slate-700">{category.name}</div>}
      </div>
      <div className="p-4">
        <h3 className="heading-display text-white">{category.name}</h3>
        <p className="text-sm text-slate-400 line-clamp-2 mt-1">{category.description}</p>
      </div>
    </Link>
  )
}
