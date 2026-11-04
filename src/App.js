import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import api from './api/axios'; //axios 获取用户信息
import 'bootstrap/dist/css/bootstrap.min.css';

import DoctorList from './pages/DoctorList';
import Login from './pages/Login';
import DoctorSlots from './pages/DoctorSlots';
import MyAppointments from './pages/MyAppointments';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // 页面加载时，检查用户状态
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            // 去后端获取当前用户信息（看是不是 is_staff）
            api.get('current-user/')
                .then(res => {
                    setIsAdmin(res.data.is_staff); // 如果是管理员，设置 true
                })
                .catch(err => console.log("Error fetching user", err));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <Router>
            <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-3 mb-4">
                <Container fluid className="px-5">
                    <Navbar.Brand href="/" className="fw-bold fs-4 me-5">ClinicApp</Navbar.Brand>
                    <Nav className="me-auto gap-4">
                        <Nav.Link href="/">Doctors</Nav.Link>
                        {isLoggedIn && (
                            <Nav.Link href="/my-appointments">My Appointments</Nav.Link>
                        )}
                        {/* 👇 只有 isAdmin 为 true 时，才显示管理面板 */}
                        {isAdmin && (
                            <Nav.Link href="/admin-dashboard" style={{ color: '#f0ad4e' }}>
                                Admin
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {isLoggedIn ? (
                            <Nav.Link onClick={handleLogout} style={{ color: '#ff6b6b' }}>
                                Logout
                            </Nav.Link>
                        ) : (
                            <Nav.Link href="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Container>
            </Navbar>

            <Routes>
                <Route path="/" element={<DoctorList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/doctor/:id" element={<DoctorSlots />} />
                <Route path="/my-appointments" element={<MyAppointments />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<DoctorList />} />
            </Routes>
        </Router>
    );
}

export default App;