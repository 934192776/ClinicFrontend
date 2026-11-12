import React, { useState } from 'react';
import api from '../api/axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

function AdminCreateDoctor() {
    const [formData, setFormData] = useState({
        username: '', password: '', specialty: '', phone: '', bio: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');

        try {
            // 调用后端我们刚刚写好的接口
            await api.post('admin/create-doctor/', formData);
            setMessage('Doctor created successfully!');
            setFormData({ username: '', password: '', specialty: '', phone: '', bio: '' }); // 清空表单
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create doctor.');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4">Create New Doctor</h2>
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
                    <Form.Label>Specialty (e.g., 内科)</Form.Label>
                    <Form.Control type="text" name="specialty" value={formData.specialty} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control as="textarea" rows={2} name="bio" value={formData.bio} onChange={handleChange} />
                </Form.Group>
                <Button variant="warning" type="submit" className="w-100">Create Doctor</Button>
            </Form>
        </Container>
    );
}

export default AdminCreateDoctor;