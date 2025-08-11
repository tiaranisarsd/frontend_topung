import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'; 
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { IoMail, IoLockClosed } from "react-icons/io5";
import { LoginUser, reset } from "../features/authSlice";
import logo from '../logo.png';

const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, isError, isSuccess, message, isLoading } = useSelector(state => state.auth);

    const Auth = async (e) => {
        e.preventDefault();
        try {
            await dispatch(LoginUser({ email, password })).unwrap();
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            } 
        }
    };

    useEffect(() => {
        try {
            if (users || isSuccess) {
                if (users) {
                    navigate("/users");
                }
            }
        } catch (error) {
          if (error.response) {
          setMsg(error.response.data.msg);
        }
        }
        
        return () => {
            dispatch(reset());
        };
    }, [users, isSuccess, dispatch, navigate]);

    return (
        <div className="login-admin-container d-flex justify-content-center align-items-center vh-100">
            <div className="position-absolute mt-3 text-muted" style={{ top: '8%', left: '15%' }}>
                <p className="text-blue">
                    <Link to="/" className="text-blue" style={{ textDecoration: 'none' }}>
                        Beranda 
                    </Link>
                    &gt; <b>Masuk Admin</b>
                </p>
            </div>

            <Card className="bg-blue2 login-card shadow border-0 p-4 m-3 mt-4" style={{ width: "500px" }}>
                <Card.Body>
                    <div className="d-flex align-items-center w-auto h-auto">
                        <img
                            src={logo}
                            width="70"
                            height="70"
                            alt="Logo"
                            className="mr-3"
                        />
                        <div className="d-flex ms-lg-5 flex-column">
                            <h2 className="fw-bold text-blue fs-sm-4 ms-3">Masuk Admin</h2>
                        </div>
                    </div>
                    <hr className="border border-black border-1 opacity-25 w-100 mt-2" />

                    {(isError || msg) && (
                        <Alert variant="danger" className="mt-3 text-center py-2">
                            {msg || message}
                        </Alert>
                    )}

                    <Form onSubmit={Auth} className="mt-4">
                        <Form.Group className="mb-3">
                            <Form.Label className="d-flex text-blue align-items-center fw-bold">
                                <IoMail className="text-blue me-1" />
                                Email
                            </Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Masukkan Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ borderRadius: '0' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="d-flex text-blue align-items-center fw-bold">
                                <IoLockClosed className="text-blue me-1" />
                                Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ borderRadius: '0' }}
                            />
                        </Form.Group>

                        <div className="d-flex flex-column align-items-center mt-4">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    >
                        {isLoading ? <span>Loading...</span> : "Masuk"}
                    </Button>
                    </div>

                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default LoginAdmin;
