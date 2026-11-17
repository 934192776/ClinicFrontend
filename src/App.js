import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import api from './api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import MyNavbar from './components/Navbar';

import DoctorList from './pages/DoctorList';
import Login from './pages/Auth/Login';
import DoctorSlots from './pages/DoctorSlots';
import MyAppointments from './pages/Patient/MyAppointments';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminAppointments from './pages/Admin/AdminAppointments';
import Register from './pages/Auth/Register';
import AdminCreateDoctor from './pages/Admin/AdminCreateDoctor';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import AdminCreatePatient from './pages/Admin/AdminCreatePatient';

function MainApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDoctor, setIsDoctor] = useState(false);
    const location = useLocation();

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
            <MyNavbar
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
                isDoctor={isDoctor}
                handleLogout={handleLogout}
            />

            <Routes>
                <Route path="/" element={<DoctorList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/doctor/:id" element={<DoctorSlots />} />
                <Route path="/my-appointments" element={isLoggedIn ? <MyAppointments /> : <Navigate to="/" />} />
                <Route path="/doctor-dashboard" element={isDoctor ? <DoctorDashboard /> : <Navigate to="/" />} />
                <Route path="/admin-dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
                <Route path="/admin-create-doctor" element={isAdmin ? <AdminCreateDoctor /> : <Navigate to="/" />} />
                <Route path="/admin-appointments" element={isAdmin ? <AdminAppointments /> : <Navigate to="/" />} />
                <Route path="/admin-create-patient" element={isAdmin ? <AdminCreatePatient /> : <Navigate to="/" />} />
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