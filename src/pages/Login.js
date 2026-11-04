import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 登录请求不需要带 Token，所以直接用原生 axios
import { Form, Button, Container } from 'react-bootstrap';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // 用来做页面跳转

    const handleLogin = async (e) => {
        e.preventDefault(); // 阻止表单默认刷新
        try {
            // 向后端发送 POST 请求获取 Token
            const response = await axios.post(`${process.env.REACT_APP_API_URL}api-token-auth/`, {
                username: username,
                password: password
            });

            // 拿到 Token 后，存入浏览器的 localStorage
            localStorage.setItem('token', response.data.token);

            alert('Login successful!');
            navigate('/'); // 登录成功跳转到首页（医生列表）
            window.location.reload(); // 强制刷新一下，让 Axios 拦截器生效
        } catch (error) {
            console.error(error);
            alert('Invalid username or password');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h2>Login</h2>
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
                <Button variant="primary" type="submit">Login</Button>
            </Form>
        </Container>
    );
}

export default Login;