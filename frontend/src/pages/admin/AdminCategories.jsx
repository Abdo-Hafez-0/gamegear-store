import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryApi, resolveImage } from '../../services/api.js'
import Spinner from '../../components/Spinner.jsx'
import Modal from '../../components/Modal.jsx'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

function CategoryForm({ initial, onSubmit, submitting }) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(initial?.image ? resolveImage(initial.image) : '')

  const handleFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return
    setImage(f); setPreview(URL.createObjectURL(f))
  }
  const submit = (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', name); fd.append('description', description)
    if (image) fd.append('image', image)
    onSubmit(fd)
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div><label className="label">Name</label><input className="input" value={name} onChange={e=>setName(e.target.value)} required/></div>
      <div><label className="label">Description</label><textarea className="input" value={description} onChange={e=>setDescription(e.target.value)} rows={3}/></div>
      <div><label className="label">Image</label><input type="file" accept="image/*" onChange={handleFile} className="input"/></div>
      {preview && <img src={preview} alt="" className="w-32 h-32 object-cover rounded card"/>}
      <button disabled={submitting} className="btn-primary w-full">{submitting ? 'Saving...' : 'Save'}</button>
    </form>
  )
}

export default function AdminCategories() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list })
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)
  const [removing, setRemoving] = useState(null)

  const invalidate = () => qc.invalidateQueries({ queryKey: ['categories'] })
  const create = useMutation({ mutationFn: categoryApi.create, onSuccess: () => { toast.success('Category created'); invalidate(); setCreating(false) }, onError: e => toast.error(e.message) })
  const update = useMutation({ mutationFn: ({id, fd}) => categoryApi.update(id, fd), onSuccess: () => { toast.success('Updated'); invalidate(); setEditing(null) }, onError: e => toast.error(e.message) })
  const remove = useMutation({ mutationFn: categoryApi.remove, onSuccess: () => { toast.success('Deleted'); invalidate(); setRemoving(null) }, onError: e => toast.error(e.message) })

  if (isLoading) return <Spinner/>
  const items = data?.data || []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="heading-display text-2xl">Categories</h1>
        <button className="btn-primary" onClick={()=>setCreating(true)}><Plus size={16}/> New</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(c => (
          <div key={c._id} className="card p-4">
            <div className="aspect-video bg-slate-800 rounded mb-3 overflow-hidden">
              {c.image && <img src={resolveImage(c.image)} alt="" className="w-full h-full object-cover"/>}
            </div>
            <h3 className="font-semibold">{c.name}</h3>
            <p className="text-sm text-slate-400 line-clamp-2">{c.description}</p>
            <div className="flex gap-2 mt-3">
              <button className="btn-outline flex-1" onClick={()=>setEditing(c)}><Pencil size={14}/> Edit</button>
              <button className="btn-danger" onClick={()=>setRemoving(c)}><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={creating} onClose={()=>setCreating(false)} title="New category">
        <CategoryForm onSubmit={(fd)=>create.mutate(fd)} submitting={create.isPending}/>
      </Modal>
      <Modal open={!!editing} onClose={()=>setEditing(null)} title="Edit category">
        {editing && <CategoryForm initial={editing} onSubmit={(fd)=>update.mutate({id:editing._id, fd})} submitting={update.isPending}/>}
      </Modal>
      <Modal open={!!removing} onClose={()=>setRemoving(null)} title="Delete category?" footer={
        <>
          <button className="btn-outline" onClick={()=>setRemoving(null)}>Cancel</button>
          <button className="btn-danger" onClick={()=>remove.mutate(removing._id)} disabled={remove.isPending}>Delete</button>
        </>
      }>
        <p className="text-slate-400">Are you sure you want to delete "{removing?.name}"?</p>
      </Modal>
    </div>
  )
}
