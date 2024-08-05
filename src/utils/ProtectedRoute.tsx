import { useSelector } from 'react-redux'
import logo_not_auth from '../assets/images/not_auth.jpg'
import { RootState } from '../redux/store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <div>
      <h2>Unauthorized</h2>
      <a href='/login'>🔙 Go back</a>
      <div>
      <img src={logo_not_auth} alt="not-auth-log" />
      </div>
    </div>
  }

  return <>{children}</>
}
export default ProtectedRoute