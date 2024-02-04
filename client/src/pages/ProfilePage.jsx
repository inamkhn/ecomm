import { useEffect, useState } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => state.userState);

  const submitHandler =async (e) => {
    e.preventDefault();
    // try {
    //   dispatch({ type: 'updateProfileRequest' });
  
    //   const { data } = await axios.put(
    //     `${server}/updateprofile`,
    //     {
    //       name,
    //       email,
    //     },
    //     {
    //       headers: {
    //         'Content-type': 'application/json',
    //       },

    //       withCredentials: true,
    //     }
    //   );
    //   dispatch({ type: 'updateProfileSuccess', payload: data.message });
    // } catch (error) {
    //   dispatch({
    //     type: 'updateProfileFail',
    //     payload: error.response.data.message,
    //   });
    // }
  };

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/v1/mine/${user._id}`,
        {
          Authentication: `Brearer ${user.access_token}`,
        }
      );
      setOrders(data);
      console.log(data);
    };
    fetch();
  }, []);

  const NoOrders = ()=>{
    return <p className="text-lg">No Orders</p>
  }

  return (
    <div className="ml-14 mt-3">
      <Row>
        <Col md={3}>
          <h2 className="text-center">User Profile</h2>

          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="bg-blue-400">
              Update
            </Button>
          </Form>
        </Col>

        <Col md={7}>
          <Table striped  hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                orders.length < 0 ? <NoOrders/> :
                orders.map((item,index)=>{
                  return(<>
                <tr key={index}>
                <td>{item._id}</td>
                <td>{item.createdAt.substring(0,10)}</td>
                <td>${item.orderItems.reduce((acc, item) => acc + item.price, 0)}</td>
                <td>{item.isPaid === false ? <p className="bg-red-400 px-1">NotPaid</p> : <p className="bg-green-400 px-1">Paid</p>}</td>
                <td>{item.isDelivered === false ? <p className="bg-red-400 px-1">NotDelivered</p> : <p className="bg-green-400 px-1">Delivered</p>}</td>
                <td><Link to={`/order/${item._id}`}>Details</Link></td>
              </tr>
                  </>)
                })
              }
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
