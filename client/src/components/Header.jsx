import {
  Badge,
  Container,
  Dropdown,
  Nav,
  Navbar,
} from "react-bootstrap";
import { FaShoppingCart, FaUserAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { signOutFailure, signOutStart, signOutSuccess } from "../slices/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchBox from "./SearchBox";


const Header = () => {
  const { cartItems } = useSelector((state) => state.cartState);
  const { user } = useSelector((state) => state.userState);

  const dispatch=  useDispatch()
  const logoutHandler = async()=>{
    try {
      dispatch(signOutStart());
      const res = await fetch("http://localhost:5000/api/v1/logout", {
        method: "POST",
        Authentication: `Brearer ${user.access_token}`,
      });
      if (res.success === false) {
        toast.warning("Logout Failed")
        dispatch(signOutFailure(res.message));
        return;
      }
      toast.success("Logout Successful")
      dispatch(signOutSuccess());
      // setUpdateSuccess(true);
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  }

  return (
    <div>
      <ToastContainer />
      <Navbar expand="lg" className="bg-slate-400 mt-0">
        <Container>
          <Link to="/">
            <Navbar.Brand
              href="#home"
              className=" hover:text-amber-800 text-gray-500 text-2xl font-semibold"
            >
              UI Mart
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <SearchBox/>
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end">
            <Nav className="me-20">
              <Nav.Link
                href="/cart"
                className="flex items-center space-x-2 hover:text-amber-800 text-gray-500 text-lg"
              >
                <FaShoppingCart className="text-xl" />
                <>
                  {cartItems.length > 0 && (
                    <Badge bg="secondary" >
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                  Cart
                </>
              </Nav.Link>
              {!user ? (
                <Nav.Link
                  href="/login"
                  className="flex items-center space-x-2 hover:text-amber-800 text-gray-500 text-lg"
                >
                  <FaUserAlt />
                  <p>User</p>
                </Nav.Link>
              ) : (
                <Dropdown>
                  <Dropdown.Toggle  className="ml-3 mt-1 text-lg font-semibold hover:bg-slate-300 border-0" id="dropdown-basic">
                   Hi! {user.name}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                    <Dropdown.Item href="#/action-2" onClick={logoutHandler} >  
                    
                      logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
          
              )}

              {
                user && user.isAdmin ? (
                  <Dropdown>
                  <Dropdown.Toggle  className="ml-3 mt-1 text-lg font-semibold hover:bg-slate-300 border-0" id="dropdown-basic">
                   Admin
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {/* <Dropdown.Item href="/profile">Profile</Dropdown.Item> */}
                    <Dropdown.Item href="/orderlist" >  
                      Order
                    </Dropdown.Item>
                    <Dropdown.Item href="/productlist" >  
                      Products
                    </Dropdown.Item>
                    <Dropdown.Item href="/admin/users" >  
                      Users
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                ):
                ""
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
