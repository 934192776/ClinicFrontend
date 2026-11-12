import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Row, Col, Form, Button, Card, Alert, Table, Badge, Tab, Nav } from 'react-bootstrap';

function DoctorDashboard() {
    const [mySlots, setMySlots] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');

    useEffect(() => {
        fetchMySlots();
        fetchAppointments();
    }, []);

    const fetchMySlots = async () => {
        try {
            const res = await api.get('slots/');
            setMySlots(res.data);
        } catch (error) { console.error(error); }
    };

    const fetchAppointments = async () => {
        try {
            const res = await api.get('appointments/');
            setAppointments(res.data);
        } catch (error) { console.error(error); }
    };

    // 创建时间段
    const handleCreateSlot = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        try {
            await api.post('slots/', {
                date: date,
                start_time: startTime
            });
            setSuccessMsg('Time slot created successfully!');
            setDate('');
            setStartTime('');
            fetchMySlots();
        } catch (error) {
            console.error("详细报错:", error.response?.data);

            if (error.response && error.response.data) {
                const errorData = error.response.data;
                const realError = errorData.error || errorData.non_field_errors || JSON.stringify(errorData);
                setErrorMsg(`Failed: ${realError}`);
            } else {
                setErrorMsg('Failed to create slot.');
            }
        }
    };

    // 删除时间段（如果预约了，自动取消预约）
    const handleDeleteSlot = async (id) => {
        if (!window.confirm("Delete this time slot? If booked, the patient's appointment will be cancelled.")) return;
        try {
            await api.delete(`slots/${id}/`);
            alert("Slot deleted!");
            fetchMySlots();
            fetchAppointments();
        } catch (error) {
            alert("Failed to delete slot.");
        }
    };

    // 取消患者预约
    const handleCancelAppt = async (id) => {
        if (!window.confirm("Cancel this patient's appointment?")) return;
        try {
            await api.post(`appointments/${id}/cancel/`);
            alert("Appointment cancelled.");
            fetchAppointments();
            fetchMySlots();
        } catch (error) { alert("Failed to cancel"); }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Doctor Panel</h2>

            <Tab.Container defaultActiveKey="appointments">
                <Nav variant="tabs" className="mb-4">
                    <Nav.Item>
                        <Nav.Link eventKey="appointments" className="fw-bold">Patient Appointments</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="schedule" className="fw-bold">My Schedule</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="appointments">
                        <Card>
                            <Card.Header as="h5">Patient Appointments</Card.Header>
                            <Card.Body>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr><th>Patient</th><th>Date</th><th>Time</th><th>Status</th><th>Action</th></tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map(appt => (
                                            <tr key={appt.id}>
                                                <td>{appt.patient.username}</td>
                                                <td>{appt.time_slot.date}</td>
                                                <td>{appt.time_slot.start_time}</td>
                                                <td>
                                                    <Badge bg={appt.status === 'Booked' ? 'success' : 'danger'}>
                                                        {appt.status}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    {appt.status === 'Booked' && (
                                                        <Button variant="danger" size="sm" onClick={() => handleCancelAppt(appt.id)}>
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Tab.Pane>

                    <Tab.Pane eventKey="schedule">
                        <Row>
                            <Col md={5}>
                                <Card className="mb-4">
                                    <Card.Header as="h5">Create New TimeSlot</Card.Header>
                                    <Card.Body>
                                        {successMsg && <Alert variant="success">{successMsg}</Alert>}
                                        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                                        <Form onSubmit={handleCreateSlot}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Date</Form.Label>
                                                <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Start Time</Form.Label>
                                                <Form.Control type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                                            </Form.Group>
                                            <Button variant="primary" type="submit">Create Slot</Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={7}>
                                <Card>
                                    <Card.Header as="h5">My TimeSlots</Card.Header>
                                    <Card.Body>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr><th>Date</th><th>Time</th><th>Status</th><th>Action</th></tr>
                                            </thead>
                                            <tbody>
                                                {mySlots.map(slot => (
                                                    <tr key={slot.id}>
                                                        <td>{slot.date}</td>
                                                        <td>{slot.start_time}</td>
                                                        <td>
                                                            {slot.is_available ? <Badge bg="success">Available</Badge> : <Badge bg="secondary">Booked</Badge>}
                                                        </td>
                                                        <td>
                                                            <Button variant="danger" size="sm" onClick={() => handleDeleteSlot(slot.id)}>
                                                                Delete
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );
}

export default DoctorDashboard;