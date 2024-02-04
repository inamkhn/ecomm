import { Table, Button,Container } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserList = () => {

    const [users,setUsers] = useState([])
    useEffect(() => {
        const fetch = async () => {
          const { data } = await axios.get(`http://localhost:5000/api/v1/allusers`);
          setUsers(data);
          console.log(data);
        };
        fetch();
      }, []);

  const deleteHandler = async (id) => {
    try {
        const config = {
          withCredentials: true,
        };
        await axios.delete(`http://localhost:5000/api/v1/deleteuser/${id}`, config);
        toast.success("User Delete Success")
      } catch (error) {
        toast.warning("User Can't Delete")
        console.log(error)
      }
  };

  return (
    <Container>
       <ToastContainer/>  
      <h1 className='text-xl m-3'>Users</h1>

        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {!user.isAdmin && (
                    <>
                      <Link
                        to={`/admin/edituser/${user._id}`}
                        style={{ marginRight: '10px' }}
                      >
                        <Button variant='light' className='btn-sm'>
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        variant='danger'
                        className='btn-sm bg-red-500'
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
    </Container>
  );
};

export default UserList;