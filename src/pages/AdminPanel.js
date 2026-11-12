import React, { useState } from 'react';
import api from '../api/axios'; // 带 Token 的 axios
import { Form, Button, Container } from 'react-bootstrap';

function AdminPanel() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');

    const handleCreateDoctor = async (e) => {
        e.preventDefault();
        try {
            // 调用后端的 Admin 专属接口
            await api.post('admin/create-doctor/', {
                username: username,
                password: password,
                specialty: specialty,
                phone: phone,
                bio: bio
            });
            alert('Doctor created successfully!');
            // 清空表单
            setUsername(''); setPassword(''); setSpecialty(''); setPhone(''); setBio('');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || 'Failed to create doctor. Are you an admin?');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '500px' }}>
            <h2>Admin Panel: Create Doctor</h2>
            <Form onSubmit={handleCreateDoctor}>
                <Form.Group className="mb-3">
                    <Form.Label>Username (for doctor login)</Form.Label>
                    <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Specialty (e.g., 内科)</Form.Label>
                    <Form.Control type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control as="textarea" rows={2} value={bio} onChange={(e) => setBio(e.target.value)} />
                </Form.Group>
                <Button variant="warning" type="submit" className="w-100">Create Doctor</Button>
            </Form>
        </Container>
    );
}

export default AdminPanel;