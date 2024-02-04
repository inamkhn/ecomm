import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';

import axios from "axios";

const CarouselScreen = () => {
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/topproducts"
        );
        setProducts(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  return (
    <div className="mx-10">
    <Carousel pause='hover' className='bg-primary mb-4 mt-2'>
      {Products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} className="h-96"  />
            <Carousel.Caption className='carousel-caption'>
              <h2 className='text-white text-right'>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
    </div>
  );
};

export default CarouselScreen;
