import { useEffect, useState } from "react";
// import Products from '../Products'
import { Col, Container, Row } from "react-bootstrap";
import Product from "../components/Product";
import axios from "axios";
import CarouselScreen from "../components/Carousel";
import { useParams } from "react-router-dom";
import Meta from "../components/Meta";
import { useQuery } from "@tanstack/react-query";

// const retrieveData = async ( maxPrice, sort, category) => {
//   const response = await axios.get(
//     `http://localhost:5000/api/v1/getallproducts?keyword=&price=${maxPrice}&sort=${sort}&category=`
//   );
//   return response.data;
// };

const retrieveCategories = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/v1/getproducts",
  );
  return response.data;
};

const HomePage = () => {
  const [Products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const { keyword } = useParams("");

  const {
    data: categories,
  } = useQuery({ queryKey: ['categories'], queryFn: retrieveCategories })

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/getAllProducts?keyword=&price=${maxPrice}&sort=${sort}&category=${category}`);
        // const data  = res.json()
        setProducts(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, [keyword,maxPrice,sort,category]);

  return (
    <>
      <CarouselScreen />
      <Container>
        <Meta />
        <div className="flex justify-between items-center py-3">
          <p className="text-2xl mt-3 font-semibold">Latest Products</p>

          <div className="flex items-center space-x-5">
            <select
              className="select select-bordered w-full max-w-xs"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option selected value="">
                ALL
              </option>
              {categories?.map((item,index) => {
                // eslint-disable-next-line react/jsx-key
                return <option value={item} key={index} >{item.toUpperCase()}</option>
              })}
            </select>

            <input
              type="range"
              min={0}
              max="1000"
              value={maxPrice}
              className="range"
              name="price"
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />

            <select
              className="select select-bordered w-full max-w-xs"
              name="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option disabled selected value="">
                sort
              </option>
              <option value="asc">Price (Low to High)</option>
              <option value="dsc">Price (High to low)</option>
            </select>
          </div>
        </div>

        <Row>
          {Products?.map((item) => {
            return (
              <>
                <Col sm={12} md={6} lg={4} xl={3} className=" p-2">
                  <Product key={item._id} Product={...item} />
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
