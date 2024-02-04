import { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  console.log(input);
  const { user } = useSelector((state) => state.userState);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        toast.success("Successfully toasted!");
        return;
      }
      toast.success('Successfully Register')
      setTimeout(navigate("/login"),4000)
    } catch (error) {
      toast.warning('Incorrect email or password')
      console.log(error);
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
        Register Page
      </h1>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Name </Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            name="name"
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email </Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
          />
        </Form.Group>
        <Form.Group
          className="mb-3"
          controlId="formBasicPassword"
          name="password"
          value={input.password}
          onChange={(e) => setInput({ ...input, password: e.target.value })}
        >
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <Button variant="primary" className="bg-blue-500" type="submit">
          Submit
        </Button>
      </Form>
      <span className="mt-2">
          Already account? <Link to="/login" className="text-blue-300 cursor-pointer">Login</Link>
        </span>
    </FormContainer>
  );
};

export default RegisterPage;
