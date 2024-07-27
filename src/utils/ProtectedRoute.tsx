import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '../redux/store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // show unauthorized screen if no user is found in redux store
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }


  // returns child route elements
  return <>{children}</>
}
export default ProtectedRoute