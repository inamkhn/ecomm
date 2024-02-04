import { useSelector } from 'react-redux'
import {Outlet,Navigate} from 'react-router-dom'

const ProtectedRoute = () => {
    const {user}= useSelector(state=>state.userState)
  return user ? <Outlet/> : <Navigate to="/login" replace/>
}

export default ProtectedRoute