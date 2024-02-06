import { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signinFailure, signinStart, signinSuccess } from "../slices/userSlice";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [input,setInput] = useState({
    email:"",
    password:""
  })

  const { user } = useSelector((state) => state.userState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signinStart());
      const res = await fetch('http://localhost:5000/api/v1/login', {
        method: 'POST',
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
         "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH"
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signinFailure(data.message));
        return;
      }
      dispatch(signinSuccess(data));
      toast.success('Successfully Login')
      setTimeout(navigate('/'),4000)
    } catch (error) {
      toast.warning('Incorrect email or password')
      dispatch(signinFailure(error.message));
    }
  };
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [user]);

  return (
    <FormContainer>
      <ToastContainer />
      <h1 className="text-xl font-semibold text-center p-4 text-blue-500">
        Login Page
      </h1>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email </Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={input.email}
            onChange={(e) => setInput({...input,email:e.target.value})}
          />
        </Form.Group>
        <Form.Group
          className="mb-3"
          controlId="formBasicPassword"
          name="password"
          value={input.password}
            onChange={(e) => setInput({...input,password:e.target.value})}
        >
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" className="bg-blue-500" type="submit">
          Submit
        </Button>
      </Form>
      <span>Create account? <Link to="/register" className="text-blue-400 cursor-pointer">Register</Link></span>
    </FormContainer>
  );
};

export default LoginPage;
