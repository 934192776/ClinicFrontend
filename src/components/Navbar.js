import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MyNavbar({ isLoggedIn, isAdmin, isDoctor, handleLogout }) {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-3 mb-4">
            <Container fluid className="px-5">
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 me-5">ClinicApp</Navbar.Brand>
                <Nav className="me-auto gap-4">
                    <Nav.Link as={Link} to="/" className="text-light fw-bold fs-6">Doctors</Nav.Link>

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
                            <Nav.Link as={Link} to="/login" className="text-light fw-bold fs-6">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register" className="text-success fw-bold fs-6">Register</Nav.Link>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}

export default MyNavbar;