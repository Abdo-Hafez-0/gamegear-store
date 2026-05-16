import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi, categoryApi, resolveImage } from '../../services/api.js'
import Spinner from '../../components/Spinner.jsx'
import Modal from '../../components/Modal.jsx'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

function ProductForm({ initial, categories, onSubmit, submitting }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    price: initial?.price || '',
    stock: initial?.stock || '',
    brand: initial?.brand || '',
    category: initial?.category?._id || initial?.category || '',
    description: initial?.description || '',
    rating: initial?.rating || '',
    specifications: initial?.specifications ? JSON.stringify(initial.specifications, null, 2) : '{\n  "connectivity": "Wireless",\n  "rgb": true\n}',
  })
  const [files, setFiles] = useState([])
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    let specs = {}
    try { specs = form.specifications ? JSON.parse(form.specifications) : {} } catch { toast.error('Invalid specs JSON'); return }
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'specifications') return
      if (v !== '' && v != null) fd.append(k, v)
    })
    fd.append('specifications', JSON.stringify(specs))
    Array.from(files).forEach(f => fd.append('images', f))
    onSubmit(fd)
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><label className="label">Title</label><input className="input" value={form.title} onChange={e=>set('title', e.target.value)} required/></div>
        <div><label className="label">Price</label><input type="number" step="0.01" className="input" value={form.price} onChange={e=>set('price', e.target.value)} required/></div>
        <div><label className="label">Stock</label><input type="number" className="input" value={form.stock} onChange={e=>set('stock', e.target.value)} required/></div>
        <div><label className="label">Brand</label><input className="input" value={form.brand} onChange={e=>set('brand', e.target.value)}/></div>
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.category} onChange={e=>set('category', e.target.value)} required>
            <option value="">Select</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div><label className="label">Rating</label><input type="number" step="0.1" min="0" max="5" className="input" value={form.rating} onChange={e=>set('rating', e.target.value)}/></div>
      </div>
      <div><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={e=>set('description', e.target.value)}/></div>
      <div><label className="label">Specifications (JSON)</label><textarea className="input font-mono text-xs" rows={5} value={form.specifications} onChange={e=>set('specifications', e.target.value)}/></div>
      <div>
        <label className="label">Images</label>
        <input type="file" accept="image/*" multiple onChange={e=>setFiles(e.target.files)} className="input"/>
        {files.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {Array.from(files).map((f,i) => <img key={i} src={URL.createObjectURL(f)} alt="" className="w-16 h-16 object-cover rounded card"/>)}
          </div>
        )}
      </div>
      <button disabled={submitting} className="btn-primary w-full">{submitting ? 'Saving...' : 'Save'}</button>
    </form>
  )
}

export default function AdminProducts() {
  const qc = useQueryClient()
  const prods = useQuery({ queryKey: ['products'], queryFn: () => productApi.list() })
  const cats = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list })
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)
  const [removing, setRemoving] = useState(null)

  const invalidate = () => qc.invalidateQueries({ queryKey: ['products'] })
  const create = useMutation({ mutationFn: productApi.create, onSuccess: () => { toast.success('Product created'); invalidate(); setCreating(false) }, onError: e => toast.error(e.message) })
  const update = useMutation({ mutationFn: ({id, fd}) => productApi.update(id, fd), onSuccess: () => { toast.success('Updated'); invalidate(); setEditing(null) }, onError: e => toast.error(e.message) })
  const remove = useMutation({ mutationFn: productApi.remove, onSuccess: () => { toast.success('Deleted'); invalidate(); setRemoving(null) }, onError: e => toast.error(e.message) })

  if (prods.isLoading || cats.isLoading) return <Spinner/>
  const items = prods.data?.data || prods.data?.products || []
  const categories = cats.data?.data || []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="heading-display text-2xl">Products</h1>
        <button className="btn-primary" onClick={()=>setCreating(true)}><Plus size={16}/> New product</button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400 border-b border-slate-800">
            <tr><th className="p-3">Product</th><th className="p-3">Brand</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p._id} className="border-b border-slate-800 last:border-none">
                <td className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded overflow-hidden">{p.images?.[0] && <img src={resolveImage(p.images[0])} alt="" className="w-full h-full object-cover"/>}</div>
                  <span className="font-medium">{p.title}</span>
                </td>
                <td className="p-3">{p.brand}</td>
                <td className="p-3">${Number(p.price).toFixed(2)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 text-right">
                  <button className="btn-ghost p-2" onClick={()=>setEditing(p)}><Pencil size={14}/></button>
                  <button className="btn-ghost p-2 text-red-400" onClick={()=>setRemoving(p)}><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-500">No products yet</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={creating} onClose={()=>setCreating(false)} title="New product">
        <ProductForm categories={categories} onSubmit={(fd)=>create.mutate(fd)} submitting={create.isPending}/>
      </Modal>
      <Modal open={!!editing} onClose={()=>setEditing(null)} title="Edit product">
        {editing && <ProductForm initial={editing} categories={categories} onSubmit={(fd)=>update.mutate({id:editing._id, fd})} submitting={update.isPending}/>}
      </Modal>
      <Modal open={!!removing} onClose={()=>setRemoving(null)} title="Delete product?" footer={
        <>
          <button className="btn-outline" onClick={()=>setRemoving(null)}>Cancel</button>
          <button className="btn-danger" onClick={()=>remove.mutate(removing._id)} disabled={remove.isPending}>Delete</button>
        </>
      }>
        <p className="text-slate-400">Delete "{removing?.title}"? This cannot be undone.</p>
      </Modal>
    </div>
  )
}
