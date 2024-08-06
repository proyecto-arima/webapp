import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <div>
      <h2>Unauthorized</h2>
      <a href='/login'>Volver</a>
      <div>
      </div>
    </div>
  }

  return <>{children}</>
}
export default ProtectedRoute