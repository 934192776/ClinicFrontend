import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import api from './api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import DoctorList from './pages/DoctorList';
import Login from './pages/Login';
import DoctorSlots from './pages/DoctorSlots';
import MyAppointments from './pages/MyAppointments';
import AdminDashboard from './pages/AdminDashboard';
import AdminAppointments from './pages/AdminAppointments';

function MainApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('current-user/')
                .then(res => {
                    setIsAdmin(res.data.is_staff);
                })
                .catch(err => {
                    console.log("Error fetching user", err);
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                });
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const goTo = (path) => {
        window.location.href = path;
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-3 mb-4">
                <Container fluid className="px-5">
                    {/* 用 onClick + window.location 代替 Link */}
                    <Navbar.Brand onClick={() => goTo('/')} className="fw-bold fs-4 me-5" style={{cursor: 'pointer'}}>ClinicApp</Navbar.Brand>

                    <Nav className="me-auto gap-4">
                        <Nav.Link onClick={() => goTo('/')} className="text-light fw-bold fs-6">Doctors</Nav.Link>

                        {isLoggedIn && (
                            <Nav.Link onClick={() => goTo('/my-appointments')} className="text-light fw-bold fs-6">My Appointments</Nav.Link>
                        )}


                        {isAdmin && (
                            <>
                                <Nav.Link onClick={() => goTo('/admin-dashboard')} className="text-warning fw-bold fs-6">
                                    Admin Dashboard
                                </Nav.Link>
                                <Nav.Link onClick={() => goTo('/admin-appointments')} className="text-warning fw-bold fs-6">
                                    All Bookings
                                </Nav.Link>
                            </>
                        )}


                    </Nav>

                    <Nav>
                        {isLoggedIn ? (
                            <Nav.Link onClick={handleLogout} className="text-danger fw-bold fs-6">Logout</Nav.Link>
                        ) : (
                            <Nav.Link onClick={() => goTo('/login')} className="text-light fw-bold fs-6">Login</Nav.Link>
                        )}
                    </Nav>
                </Container>
            </Navbar>

            <Routes>
                <Route path="/" element={<DoctorList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/doctor/:id" element={<DoctorSlots />} />

                <Route path="/my-appointments" element={isLoggedIn ? <MyAppointments /> : <Navigate to="/" />} />
                <Route path="/admin-dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
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