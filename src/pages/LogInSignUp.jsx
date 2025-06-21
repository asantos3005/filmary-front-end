import React from "react";
import { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';


export default function LogInSignUp() {
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [logEmail, setLogEmail] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  

  // Function called when register is submitted (submit button clicked)
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://4.237.58.241:3000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: regEmail, password: regPassword }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setRegistrationMessage(data.message); // "User created"
        setRegEmail('');
        setRegPassword('');

      } else {
        setRegistrationMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      setRegistrationMessage("An error occurred. Please try again.");
    }
  };

  // Function called when login is submitted (submit button clicked)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://4.237.58.241:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: logEmail, password: logPassword }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const jwt = data.bearerToken.token;
        const refresh = data.refreshToken.token;
      
        login({ email: logEmail, token: jwt, refreshToken: refresh });
        navigate('/');
      } 
      else {
        setLoginMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setLoginMessage("An error occurred. Please try again.");
    }
  };

  return (
    <main className="page-wrapper">
        <div className="auth-forms-container">
          <div className="login-form">
            <h2 className="auth-headings">Login</h2>
            <Form onSubmit={handleLogin}>
              <FormGroup className="mb-5">
                <Label for="exampleEmail" >
                  Email
                </Label>
                <Input
                  id="exampleEmail"
                  name="email"
                  placeholder="Enter an email"
                  type="email"
                  value={logEmail}
                  onChange={(e) => setLogEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup className="mb-5">
                <Label for="examplePassword">
                  Password
                </Label>
                <Input
                  id="examplePassword"
                  name="password"
                  placeholder="Enter a password"
                  type="password"
                  value={logPassword}
                  onChange={(e) => setLogPassword(e.target.value)}
                />
              </FormGroup>
              <Button>
                Submit
              </Button>
                {loginMessage && (
                  <div className="login-feedback">
                    {loginMessage}
                  </div>
                )}
            </Form>
          </div>

          <div className="divider"></div> 

          <div className="registration-form">
            <h2 className="auth-headings">Register</h2>
            <Form onSubmit={handleRegister}>
              <FormGroup className="mb-5">
                <Label for="exampleEmail" className="email-input">Email</Label>
                <Input
                  id="exampleEmail"
                  name="email"
                  placeholder="Enter an email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup className="mb-5">
                <Label for="examplePassword">Password</Label>
                <Input
                  id="examplePassword"
                  name="password"
                  placeholder="Enter a password"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
              </FormGroup>
              <Button type="submit">Submit</Button>
            </Form>
            {registrationMessage && (
              <div className="registration-feedback">
                {registrationMessage}
              </div>
            )}
          </div>
        </div>
    </main>
  );
}