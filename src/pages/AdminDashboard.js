import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

function AdminDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // 表单状态
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('doctors/');
            setDoctors(response.data);
            if (response.data.length > 0) {
                setDoctorId(response.data[0].id); // 默认选中第一个医生
            }
        } catch (error) {
            console.error("Error fetching doctors", error);
        }
    };

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');

        try {
            // 向后端发送 POST 请求创建时间段
            await api.post('slots/', {
                doctor_id: parseInt(doctorId),
                date: date,
                start_time: startTime
            });
            setSuccessMsg('Time slot created successfully!');
            // 清空表单
            setDate('');
            setStartTime('');
        } catch (error) {
            console.error("Failed to create slot", error.response?.data);
            // 显示后端返回的具体错误（比如重复时间）
            setErrorMsg('Failed to create slot. It might already exist.');
        }
    };

    return (
        <Container className="mt-4">
            <h2>Admin</h2>

            <Row className="mt-4">
                <Col md={6}>
                    <Card>
                        <Card.Header as="h5">Create New Time Slot</Card.Header>
                        <Card.Body>
                            {successMsg && <Alert variant="success">{successMsg}</Alert>}
                            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

                            <Form onSubmit={handleCreateSlot}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Doctor</Form.Label>
                                    <Form.Select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                                        {doctors.map(doc => (
                                            <option key={doc.id} value={doc.id}>
                                                Dr. {doc.username} ({doc.specialty})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Start Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Create Slot
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminDashboard;