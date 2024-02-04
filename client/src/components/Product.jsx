import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";
import axios from "axios";

const Product = ({ Product }) => {
    
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const data = res.json()
        setProducts(data);
        console.log(data);
      } catch (error) {
        console.log(error)
      }
    }
    fetch();
  }, [Products]);

  const {_id, name, image, brand, rating, price, numReviews } = Product;
  return (
    <>
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={image} className="h-60" />
        <Card.Body>
          <Link to={`/product/${_id}`}>
            <Card.Title>{name}</Card.Title>
          </Link>
        </Card.Body>
        <Card.Body>
          <Card.Text className="flex space-x-1 items-center">
            <Rating className="bg-yellow-400" value={rating} review={`${numReviews}reviews`} />
          </Card.Text>
          <Card.Link href="#">Price ${price}</Card.Link>
        </Card.Body>
      </Card>
    </>
  );
};

export default Product;
