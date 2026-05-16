import { useQuery } from '@tanstack/react-query'
import { categoryApi } from '../services/api.js'
import CategoryCard from '../components/CategoryCard.jsx'
import Spinner from '../components/Spinner.jsx'

export default function Categories() {
  const { data, isLoading, error } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list })
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="heading-display text-3xl mb-6">Categories</h1>
      {isLoading ? <Spinner/> : error ? <p className="text-red-400">{error.message}</p> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(data?.data || []).map(c => <CategoryCard key={c._id} category={c} />)}
        </div>
      )}
    </div>
  )
}
