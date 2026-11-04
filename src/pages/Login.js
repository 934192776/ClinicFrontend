import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap'; // 引入 Alert 用于显示错误
import api from '../api/axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(''); // 显示后端的报错
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg(''); // 清空旧错误

        try {
            // 这里直接写死线上的后端完整地址
            const response = await api.post('api-token-auth/', {
                username: username,
                password: password
            });

            localStorage.setItem('token', response.data.token);
            alert('Login successful!');

            // 使用 window.location.href 确保强制跳转并刷新页面
            window.location.href = '/';

        } catch (error) {
            console.error("Login error details:", error.response?.data);
            // 把后端的真实报错显示在页面上，方便排查
            setErrorMsg('Invalid username or password. Please try again.');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4">Login</h2>

            {/* 如果有错误，显示红色的提示框 */}
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
                <Button variant="primary" type="submit" className="w-100">
                    Login
                </Button>
            </Form>
        </Container>
    );
}

export default Login;