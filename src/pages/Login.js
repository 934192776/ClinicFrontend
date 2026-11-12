import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 引入 Link
import { Form, Button, Container, Alert } from 'react-bootstrap';
import api from '../api/axios';
import axios from "axios";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api-token-auth/', {
                username: username,
                password: password
            });

            localStorage.setItem('token', response.data.token);
            alert('Login successful!');

            // 跳转并刷新页面
            window.location.href = '/';

        } catch (error) {
            console.error("Login error details:", error.response?.data);
            setErrorMsg('Invalid username or password. Please try again.');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4">Login</h2>

            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mb-3">
                    Login
                </Button>

                {/* 去注册页面的链接 */}
                <div className="text-center">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
            </Form>
        </Container>
    );
}

export default Login;