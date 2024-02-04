import { useEffect } from "react";
import {  useDispatch,useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import axios from "axios";
import { AddOrderFailure, AddOrderStart, AddOrderSuccess } from "../slices/orderSlice";


const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cartState);
  const {user} = useSelector((state) => state.userState);
  const dispatch = useDispatch()
  const inputdata = {
    orderItems: cart.cartItems,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    userId:user._id,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
  };
  // console.log(inputdata)
  const OrderHandler = async () => {
      dispatch(AddOrderStart())
    try {
      const {data} = await axios.post("http://localhost:5000/api/v1/order", inputdata,{
        method: "post",
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        Authentication: `Brearer ${user.access_token}`,
        credentials: 'include',
      });
      // const result = await res.json()
      console.log(data);
      dispatch(AddOrderSuccess(data))
      toast.success("order successfully added")
      setInterval(function() {navigate(`/order/${data._id}`)},3000)
    } catch (error) {
      toast.warning("Order is not place occurred")
      dispatch(AddOrderFailure(error))
      console.log(error);
    }
  };

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

  return (
    <div>
      <ToastContainer/>
      <CheckoutSteps step1 step2 step3 step4 />

      <Container className="text-gray-400 mt-5">
        <Row>
          <Col md={8} className="space-y-3">
            <div className="space-y-2">
              <h1 className="text-xl font-medium">Shipping</h1>
              <ListGroup>
                <ListGroup.Item>
                  Address:{" "}
                  {`${cart.shippingAddress.address}, ${cart.shippingAddress.city}, ${cart.shippingAddress.postalCode}`}
                </ListGroup.Item>
              </ListGroup>
            </div>
            <div className="space-y-3">
              <h1 className="text-xl font-medium">PaymentMethod</h1>
              <ListGroup>
                <ListGroup.Item>Method: {cart.paymentMethod}</ListGroup.Item>
              </ListGroup>
            </div>

            <div className="space-y-3">
              <h1 className="text-xl font-medium">Order Items</h1>
              <ListGroup className="space-y-5">
                {cart.cartItems.map((items, index) => {
                  return (
                    <>
                      <div className="flex justify-between" key={index}>
                        <div>
                          <Image
                            src={items.image}
                            alt=""
                            width={50}
                            height={50}
                          />
                        </div>
                        <div>
                          <Link to={`/products/${items.product}`}>
                            {items.name}
                          </Link>
                        </div>
                        <div>
                          {items.qty} X ${items.price} = $
                          {items.qty * items.price}
                        </div>
                      </div>
                    </>
                  );
                })}
              </ListGroup>
            </div>
          </Col>
          <Col md={4}>
            <Card style={{ width: "18rem" }}>
              <Card.Body className="space-y-3">
                <Card.Title>Order Summary</Card.Title>
                <Card.Text>Items: ${cart.itemsPrice}</Card.Text>
                <Card.Text>Shipping: ${cart.shippingPrice}</Card.Text>
                <Card.Text>Tax: ${cart.taxPrice}</Card.Text>
                <Card.Text>Total: ${cart.totalPrice}</Card.Text>
                <Button
                  type="submit"
                  className="bg-blue-500"
                  onClick={OrderHandler}
                  disabled={cart.cartItems.length === 0}
                >
                  Place Order
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PlaceOrderPage;
