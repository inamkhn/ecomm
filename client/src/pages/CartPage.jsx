
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsTrashFill } from "react-icons/bs";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import axios from 'axios'

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems,shippingAddress,paymentMethod,itemsPrice,shippingPrice,taxPrice,totalPrice } = useSelector((state) => state.cartState);
  const navigate = useNavigate();

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };
  const removeItemHandler = async (id) => {
    dispatch(removeFromCart(id));
  };
  const data = {orderItems:cartItems,shippingAddress,paymentMethod,itemsPrice,shippingPrice,taxPrice,totalPrice}
  const checkoutHandler = async() => {
    try {
      const response = await axios.post("http://localhost:5000/api/v1/addorder",{data})
      const result = response.json()
      console.log(result)
    } catch (error) {
      console.log(error)
    }
    navigate("/shipping");
  };

  return (
    <>
      <div>
        <Container>
          <Row>
            {cartItems.length === 0 ? (
              <h3 className="mt-4">
                Your Cart is Empty{" "}
                <Link to="/">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded-lg">
                    Go Back
                  </button>
                </Link>
              </h3>
            ) : (
              <Col md={8} className="mt-3">
                <h1 className="p-3 text-xl font-semibold text-gray-500">
                  Shopping Cart
                </h1>
                <ListGroup>
                  {cartItems.map((item) => {
                    return (
                      <>
                        <ListGroup.Item>
                          <Row>
                            <Col>
                              <Image src={item.image} alt="" />
                            </Col>
                            <Col>
                              <span>{item.name}</span>
                            </Col>
                            <Col>${item.price}</Col>
                            <Col>
                              <Form>
                                <Form.Select
                                  aria-label="Default select example"
                                  value={item.qty}
                                  onChange={(e) =>
                                    addToCartHandler(
                                      item,
                                      Number(e.target.value)
                                    )
                                  }>
                                  {[...Array(item.countInStock).keys()].map(
                                    (x) => (
                                      <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                      </option>
                                    )
                                  )}
                                </Form.Select>
                              </Form>
                            </Col>
                            <Col>
                              <div onClick={() => removeItemHandler(item._id)}>
                                <BsTrashFill className="text-xl mt-2" />
                              </div>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      </>
                    );
                  })}
                </ListGroup>
              </Col>
            )}

            <Col md={4} className="mt-20">
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>
                    SubTotal{" "}
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)} Items
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    $
                    {cartItems.reduce(
                      (acc, item) => acc + item.price * item.qty, 0
                    )}
                  </Card.Subtitle>
                  <Button onClick={checkoutHandler} className="bg-blue-500">
                    Proceed to Checkout
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default CartPage;
