import { useEffect, useState } from "react";
import { Table, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => state.userState);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/v1/order/`, {
        Authentication: `Brearer ${user.access_token}`,
      });
      setOrders(data);
      console.log(data);
    };
    fetch();
  }, []);

  const NoOrders = () => {
    return <p className="text-lg">No Orders</p>;
  };
  return (
    <div>
      <Container>
        <Row className="mt-6">
          <p className="py-1 text-2xl font-bold">Orders</p>
          <Col md={8}>
            <Table striped hover>
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
                {orders.length < 0 ? (
                  <NoOrders />
                ) : (
                  orders.map((item, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>{item._id}</td>
                          <td>{item.createdAt.substring(0, 10)}</td>
                          <td>
                            $
                            {item.orderItems.reduce(
                              (acc, item) => acc + item.price,
                              0
                            )}
                          </td>
                          <td>
                            {item.isPaid === false ? (
                              <p className="bg-red-400 px-1">NotPaid</p>
                            ) : (
                              <p className="bg-green-400 px-1">Paid</p>
                            )}
                          </td>
                          <td>
                            {item.isDelivered === false ? (
                              <p className="bg-red-400 px-1">NotDelivered</p>
                            ) : (
                              <p className="bg-green-400 px-1">Delivered</p>
                            )}
                          </td>
                          <td>
                            <Link to={`/order/${item._id}`}>Details</Link>
                          </td>
                        </tr>
                      </>
                    );
                  })
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderList;
