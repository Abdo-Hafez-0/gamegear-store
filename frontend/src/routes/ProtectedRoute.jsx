import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, admin = false }) {
  const { isAuthed, isAdmin } = useAuth()
  const location = useLocation()
  if (!isAuthed) return <Navigate to="/login" state={{ from: location }} replace />
  if (admin && !isAdmin) return <Navigate to="/" replace />
  return children
}
