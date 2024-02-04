import { useEffect, useState } from "react";
import { Col, Container, Form, ListGroup, Row, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import axios from "axios";
import { addToCart } from "../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Meta from "../components/Meta";
import { redirect } from "react-router-dom";

const ProductPage = () => {
  const { id: productId } = useParams();
  const [Product, setProduct] = useState([]);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userState);

  const fetch = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/getproduct/${productId}`
    );
    setProduct(data);
    console.log(data);
  };
  useEffect(() => {
    setTimeout(fetch(), 5000);
    fetch();
  }, []);
  if (!user) return navigate("/login");

  const addCartHandler = () => {
    dispatch(addToCart({ ...Product, qty }));
    navigate("/cart");
  };

  const input = {
    rating,
    comment,
    userId: user._id,
  };
  console.log(input);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/review/${productId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: true,
          // body: JSON.stringify(input),
        }
      );
      // const data = await res.json();
      console.log(res);
      if (res.success === false) {
        return;
      }
      toast.success("thnks for Review");
      setTimeout(navigate("/login"), 4000);
    } catch (error) {
      toast.warning("you can't comment or review");
      console.log(error);
    }
  };

  return (
    <>
      <Container>
        <ToastContainer />
        <Meta title={Product.name} />
        <Row>
          <Col md={6} className="mt-3">
            <img src={Product.image} alt="" width={300} className="ml-24" />
          </Col>
          <Col md={3} className="mt-3">
            <ListGroup as="ul">
              <ListGroup.Item as="li" className="text-xl font-semibold">
                {Product.name}
              </ListGroup.Item>
              <ListGroup.Item as="li" className="flex space-x-1 items-center">
                <Rating
                  value={Product.rating}
                  className="text-yellow-500"
                  review={`${Product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item as="li">Price {Product.price}</ListGroup.Item>
              <ListGroup.Item as="li">
                Description {Product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3} className="mt-3">
            <ListGroup>
              <ListGroup.Item>Price {Product.price}</ListGroup.Item>
              <ListGroup.Item>
                Status: {Product.countInStock} InStock
              </ListGroup.Item>

              {Product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty : </Col>
                    <Col>
                      <Form>
                        <Form.Select
                          aria-label="Default select example"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(Product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Select>
                      </Form>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <button
                  onClick={addCartHandler}
                  className="px-3 py-1 text-white bg-blue-500 rounded-md"
                >
                  Cart
                </button>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>

        {/* review and Comment section */}

        <Row>
          <Col md={6}>
            <h2 className="my-2 font-bold text-2xl">Reviews</h2>
            {Product.numReviews === 0 ? (
              <p className="text-lg px-3 py-1 ring-1">No Reviews</p>
            ) : (
              ""
            )}
            {Product.reviews?.map((review) => (
              <ListGroup.Item
                key={review._id}
                className="flex flex-col space-y-2"
              >
                <strong>{review.name}</strong>
                <div className="flex">
                  <Rating value={review.rating} />
                </div>
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
                <hr />
              </ListGroup.Item>
            ))}

            <ListGroup.Item>
              <h2 className="mt-5 font-bold">Write a Customer Review</h2>
              {user ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group className="my-2" controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as="select"
                      required
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="my-2" controlId="comment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      row="3"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    className="text-blue-500"
                  >
                    Submit
                  </Button>
                </Form>
              ) : (
                <span>
                  Please <Link to="/login">sign in</Link> to write a review
                </span>
              )}
            </ListGroup.Item>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductPage;
