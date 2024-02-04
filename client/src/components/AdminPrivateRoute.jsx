import { useSelector } from 'react-redux'
import {Outlet,Navigate} from 'react-router-dom'

const AdminPrivateRoute = () => {
    const {user}= useSelector(state=>state.userState)
    
    return user && user.isAdmin  ? <Outlet/> : <Navigate to="/login" replace/>
}

export default AdminPrivateRoute