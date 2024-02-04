import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button,Container } from 'react-bootstrap';
import FormContainer from '../../components/FormContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// import {useSelector} from 'react-redux'

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [user,setUser] = useState([])

  const navigate = useNavigate();
  // const {user} = useSelector(state=>state.userState)

  const input = {name,email,isAdmin}
  console.log(input)
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/v1/updateuser/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        return;
      }
      toast.success('User Update success')
      setTimeout(navigate("/login"),4000)
    } catch (error) {
      toast.warning("Can't Update")
      console.log(error);
    }
  };


  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/v1/profile/${userId}`);
      setUser(data);
      console.log(data);
    };
    fetch();
  }, []);



  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  return (
    <Container>
    <ToastContainer/>
      <Link to='/admin/users' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1 className='text-center text-lg font-bold my-2'>Edit User</h1>

          <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='isadmin'>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary' className='bg-blue-500'>
              Update
            </Button>
          </Form>
      </FormContainer>
    </Container>
  );
};

export default UserEditScreen;