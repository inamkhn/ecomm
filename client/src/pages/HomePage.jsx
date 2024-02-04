import { useEffect, useState } from "react";
// import Products from '../Products'
import { Col, Container, Row } from "react-bootstrap";
import Product from "../components/Product";
import axios from "axios";
import CarouselScreen from "../components/Carousel";
import { useParams } from "react-router-dom";
import Meta from "../components/Meta";


const HomePage = () => {

    const [Products, setProducts] = useState([]);
    const {keyword} = useParams()
    const param = keyword ? `http://localhost:5000/api/v1/getallproducts?keyword=${keyword}` : 'http://localhost:5000/api/v1/getallproducts?keyword='
    console.log(keyword)
    useEffect(()=>{
      const fetchdata = async()=>{
        try {
          const res = await axios.get(param)
          // const data  = res.json()
        setProducts(res.data)
        console.log(res.data)
        } catch (error) {
          console.log(error)
        }
      }
      fetchdata()
    },[keyword])
 
    
    
    return (
    <>
    <CarouselScreen/>
      <Container >
      <Meta/>
        <p className="text-2xl mt-3 font-semibold">Latest Products</p>
        <Row>
          {Products.map((item) => {
            return (
              <>
                <Col sm={12} md={6} lg={4} xl={3} className=" p-2">
                  <Product key={item._id} Product={item} />
                </Col>
              </>
            );
          })}
          {/* {
            !Products ? <p>No Products Found</p> : ""
          } */}
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
