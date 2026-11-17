import React, { useState } from 'react';
import api from '../../api/axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function AdminCreatePatient() {
    const [formData, setFormData] = useState({ username: '', password: '', phone: '', email: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            await api.post('admin/create-patient/', formData);
            setMessage('Patient created successfully!');
            setFormData({ username: '', password: '', phone: '', email: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create patient.');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4">Create New Patient</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                </Form.Group>
                <Button variant="success" type="submit" className="w-100 mb-2">Create Patient</Button>
                <Link to="/admin-dashboard" className="btn btn-secondary w-100">Back to Dashboard</Link>
            </Form>
        </Container>
    );
}

export default AdminCreatePatient;