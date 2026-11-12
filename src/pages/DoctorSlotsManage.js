import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Row, Col, Form, Button, Card, Alert, Table, Badge } from 'react-bootstrap';

function DoctorSlotsManage() {
    const [mySlots, setMySlots] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');

    useEffect(() => {
        fetchMySlots();
    }, []);

    const fetchMySlots = async () => {
        try {
            const res = await api.get('slots/');
            setMySlots(res.data);
        } catch (error) { console.error(error); }
    };

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        try {
            await api.post('slots/', { date: date, start_time: startTime });
            setSuccessMsg('Time slot created successfully!');
            setDate('');
            setStartTime('');
            fetchMySlots();
        } catch (error) {
            setErrorMsg('Failed to create slot. It might already exist.');
        }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm("Delete this time slot? If booked, the patient's appointment will be cancelled.")) return;
        try {
            await api.delete(`slots/${id}/`);
            alert("Slot deleted!");
            fetchMySlots();
        } catch (error) { alert("Failed to delete slot."); }
    };

    return (
        <div>
            <h3 className="mb-4">Manage My Schedule</h3>
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
        </div>
    );
}

export default DoctorSlotsManage;