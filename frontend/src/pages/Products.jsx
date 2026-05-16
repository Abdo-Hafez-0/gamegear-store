import { useQuery } from '@tanstack/react-query'
import { categoryApi, productApi } from '../services/api.js'
import ProductCard from '../components/ProductCard.jsx'
import Spinner from '../components/Spinner.jsx'
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [filters, setFilters] = useState({
    search: params.get('search') || '',
    category: params.get('category') || '',
    brand: params.get('brand') || '',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
  })

  useEffect(() => {
    setFilters(f => ({ ...f,
      search: params.get('search') || '',
      category: params.get('category') || '',
    }))
  }, [params])

  const cats = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list })
  const query = Object.fromEntries(Object.entries(filters).filter(([,v]) => v !== ''))
  const prods = useQuery({ queryKey: ['products', query], queryFn: () => productApi.list(query) })

  const apply = (e) => {
    e?.preventDefault()
    const next = new URLSearchParams()
    Object.entries(filters).forEach(([k,v]) => v && next.set(k, v))
    setParams(next)
  }
  const reset = () => { setFilters({ search:'', category:'', brand:'', minPrice:'', maxPrice:'' }); setParams({}) }

  const items = prods.data?.data || prods.data?.products || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-[260px_1fr] gap-6">
      <aside className="card p-4 h-fit sticky top-20">
        <h3 className="heading-display mb-3">Filters</h3>
        <form onSubmit={apply} className="space-y-3">
          <div>
            <label className="label">Search</label>
            <input className="input" value={filters.search} onChange={e=>setFilters({...filters, search:e.target.value})}/>
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={filters.category} onChange={e=>setFilters({...filters, category:e.target.value})}>
              <option value="">All</option>
              {(cats.data?.data || []).map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Brand</label>
            <input className="input" value={filters.brand} onChange={e=>setFilters({...filters, brand:e.target.value})}/>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">Min $</label><input type="number" className="input" value={filters.minPrice} onChange={e=>setFilters({...filters, minPrice:e.target.value})}/></div>
            <div><label className="label">Max $</label><input type="number" className="input" value={filters.maxPrice} onChange={e=>setFilters({...filters, maxPrice:e.target.value})}/></div>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="btn-primary flex-1">Apply</button>
            <button type="button" onClick={reset} className="btn-outline">Reset</button>
          </div>
        </form>
      </aside>
      <section>
        <h1 className="heading-display text-2xl mb-4">Shop</h1>
        {prods.isLoading ? <Spinner/> : prods.error ? <p className="text-red-400">{prods.error.message}</p> : items.length === 0 ? (
          <p className="text-slate-400 text-sm">No products match these filters.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
