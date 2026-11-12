import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import api from './api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// 导入页面组件
import DoctorList from './pages/DoctorList';
import Login from './pages/Login';
import DoctorSlots from './pages/DoctorSlots';
import MyAppointments from './pages/MyAppointments';
import AdminDashboard from './pages/AdminDashboard';
import AdminAppointments from './pages/AdminAppointments';
import Register from './pages/Register';
import AdminCreateDoctor from './pages/AdminCreateDoctor';
import DoctorDashboard from './pages/DoctorDashboard';

function MainApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = useState(false);    // 超级管理员
    const [isDoctor, setIsDoctor] = useState(false);  // 医生
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('current-user/')
                .then(res => {
                    setIsAdmin(res.data.is_superuser);
                    setIsDoctor(res.data.is_staff && !res.data.is_superuser);
                })
                .catch(err => {
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                });
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.replace('/');
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-3 mb-4">
                <Container fluid className="px-5">
                    <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 me-5">ClinicApp</Navbar.Brand>
                    <Nav className="me-auto gap-4">
                        <Nav.Link as={Link} to="/" className="text-light fw-bold fs-6">Doctors</Nav.Link>

                        {/* 患者看自己的预约 */}
                        {isLoggedIn && !isAdmin && !isDoctor && (
                            <Nav.Link as={Link} to="/my-appointments" className="text-light fw-bold fs-6">My Appointments</Nav.Link>
                        )}

                        {isAdmin && (
                            <Nav.Link as={Link} to="/admin-dashboard" className="text-warning fw-bold fs-6">
                                Admin Dashboard
                            </Nav.Link>
                        )}
                        {isDoctor && (
                            <Nav.Link as={Link} to="/doctor-dashboard" className="text-warning fw-bold fs-6">
                                Doctor Panel
                            </Nav.Link>
                        )}

                    </Nav>

                    <Nav>
                        {isLoggedIn ? (
                            <Nav.Link onClick={handleLogout} className="text-danger fw-bold fs-6">Logout</Nav.Link>
                        ) : (
                            <>
                                {/* 未登录时显示登录和注册 */}
                                <Nav.Link as={Link} to="/login" className="text-light fw-bold fs-6">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="text-success fw-bold fs-6">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Container>
            </Navbar>

            <Routes>
                <Route path="/" element={<DoctorList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/doctor/:id" element={<DoctorSlots />} />

                {/* 患者专属路由 */}
                <Route path="/my-appointments" element={isLoggedIn ? <MyAppointments /> : <Navigate to="/" />} />

                <Route path="/doctor-dashboard" element={isDoctor ? <DoctorDashboard /> : <Navigate to="/" />} />

                {/* Admin 专属路由：只有 Admin 能进 */}
                <Route path="/admin-dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
                <Route path="/admin-create-doctor" element={isAdmin ? <AdminCreateDoctor /> : <Navigate to="/" />} />
                <Route path="/admin-appointments" element={isAdmin ? <AdminAppointments /> : <Navigate to="/" />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <MainApp />
        </Router>
    );
}

export default App;