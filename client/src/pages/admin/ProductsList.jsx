import { Table, Button, Row, Col,Container } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { useParams } from 'react-router-dom';
// import Message from '../../components/Message';
// import Loader from '../../components/Loader';
// import Paginate from '../../components/Paginate';

const ProductsList = () => {
//   const { pageNumber } = useParams();
     const [products,setProducts] = useState([])


useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/v1/getallproducts/`, {
      });
      setProducts(data);
      console.log(data);
    };
    fetch();
  }, []);

  const deleteHandler = async (id) => {
    try {
      const config = {
        withCredentials: true,
      };
      const res =  await axios.delete(`http://localhost:5000/api/v1/deleteproduct/${id}`, config);
      console.log(res)
      toast.success("Product Delete Success")
    } catch (error) {
      toast.warning("Product Can't Delete")
      console.log(error)
    }
  };

  const createProductHandler = async () => {
    // if (window.confirm('Are you sure you want to create a new product?')) {
    //   try {
    //     await createProduct();
    //     refetch();
    //   } catch (err) {
    //     toast.error(err?.data?.message || err.error);
    //   }
    // }
  };

  return (
    <Container>
      <ToastContainer/>
      <Row className='align-items-center'>
        <Col>
        <p className="py-1 text-2xl font-bold">Products</p>
        </Col>
        <Col className='text-end'>
          <Button className='my-3 text-sm bg-blue-500' onClick={createProductHandler}>
            <FaPlus />Create Product
          </Button>
        </Col>
      </Row>

          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Link to={`/admin/product/${product._id}`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </Link>
                    <Button
                      variant='danger'
                      className='btn-sm bg-red-500'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* <Paginate pages={data.pages} page={data.page} isAdmin={true} /> */}

    </Container>
  );
};

export default ProductsList;