import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Row, Col, Form, Button, Card, Alert, Table, Modal, Badge, ListGroup } from 'react-bootstrap';
import { Link } from "react-router-dom";

function AdminDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [slots, setSlots] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUsername, setCurrentUsername] = useState('');

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // 创建 Slot 的状态
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');

    // 弹窗状态
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);

    const [showSlotModal, setShowSlotModal] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);

    const [showApptModal, setShowApptModal] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);

    useEffect(() => {
        api.get('current-user/')
            .then(res => {
                setIsAdmin(res.data.is_superuser);
                setCurrentUsername(res.data.username);
            })
            .catch(err => console.log(err));

        fetchDoctors();
        fetchPatients();
        fetchSlots();
        fetchAppointments();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('doctors/');
            setDoctors(response.data);
            if (response.data.length > 0) setDoctorId(response.data[0].id);
        } catch (error) { console.error(error); }
    };

    const fetchPatients = async () => {
        try {
            const response = await api.get('patients/');
            setPatients(response.data);
        } catch (error) { console.error(error); }
    };

    const fetchSlots = async () => {
        try {
            const response = await api.get('slots/');
            setSlots(response.data);
        } catch (error) { console.error(error); }
    };

    const fetchAppointments = async () => {
        try {
            const res = await api.get('appointments/');
            setAppointments(res.data);
        } catch (error) { console.error(error); }
    };

    const handleEditDoctorClick = (doctor) => {
        setEditingDoctor({ ...doctor, password: '' });
        setShowEditModal(true);
    };

    const handleUpdateDoctor = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`doctors/${editingDoctor.id}/`, editingDoctor);
            alert("Doctor updated successfully!");
            setShowEditModal(false);
            fetchDoctors();
        } catch (error) { alert("Failed to update doctor."); }
    };

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        setSuccessMsg(''); setErrorMsg('');
        try {
            await api.post('slots/', { doctor_id: parseInt(doctorId), date, start_time: startTime });
            setSuccessMsg('Time slot created successfully!');
            setDate(''); setStartTime('');
            fetchSlots();
        } catch (error) { setErrorMsg('Failed to create slot. It might already exist.'); }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm("Delete this time slot?")) return;
        try {
            await api.delete(`slots/${id}/`);

            setSlots(prev => prev.filter(slot => slot.id !== id));

            fetchSlots();
            fetchAppointments();
        } catch (error) {
            console.error(error);
            fetchSlots();
        }
    };

    const handleEditSlotClick = (slot) => {
        const formattedTime = slot.start_time.substring(0, 5);
        setEditingSlot({ ...slot, start_time: formattedTime });
        setShowSlotModal(true);
    };

    const handleUpdateSlot = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`slots/${editingSlot.id}/`, { date: editingSlot.date, start_time: editingSlot.start_time });
            alert("Time slot updated successfully!");
            setShowSlotModal(false);
            fetchSlots();
        } catch (error) { alert("Failed to update slot."); }
    };

    const handleDeleteDoctor = async (id) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) return;
        try {
            await api.delete(`doctors/${id}/`);


            setDoctors(prev => prev.filter(doc => doc.id !== id));

            fetchDoctors();
        } catch (error) {
            console.error(error);
            fetchDoctors();
        }
    };

    const handleDeletePatient = async (id) => {
        if (!window.confirm("Are you sure you want to delete this patient?")) return;
        try {
            await api.delete(`patients/${id}/`);

            setPatients(prev => prev.filter(p => p.id !== id));

            fetchPatients();
            fetchAppointments();
            fetchSlots();

        } catch (error) {
            console.error("Delete patient failed:", error);
            fetchPatients();
        }
    };


    const handleCancelAppt = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await api.post(`appointments/${id}/cancel/`);


            setAppointments(prev => prev.filter(app => app.id !== id));

            fetchAppointments();
            fetchSlots();
        } catch (error) {
            console.error("Cancel failed:", error);
            fetchAppointments();
        }
    };

    const handleEditApptClick = async (appt) => {
        setSelectedAppt(appt);
        setShowApptModal(true);
        try {
            const res = await api.get('slots/');
            const slotsForDoctor = res.data.filter(
                slot => slot.doctor.id === appt.time_slot.doctor.id && slot.is_available
            );
            setAvailableSlots(slotsForDoctor);
        } catch (error) { console.error(error); }
    };

    const handleConfirmEditAppt = async (newSlotId) => {
        try {
            await api.post(`appointments/${selectedAppt.id}/cancel/`);
            await api.post('appointments/', {
                time_slot_id: newSlotId,
                notes: selectedAppt.notes,
                patient_id: selectedAppt.patient.id
            });
            alert("Rescheduled successfully!");
            setShowApptModal(false);
            fetchAppointments();
            fetchSlots();
        } catch (error) {
            alert("Failed to reschedule. Time slot may be taken.");
            setShowApptModal(false);
            fetchAppointments();
            fetchSlots();
        }
    };

    return (
        <Container className="mt-4">
            <h2>{isAdmin ? "Admin Panel" : "Doctor Panel"}</h2>

            {isAdmin && (
                <Link to="/admin-create-doctor" className="btn btn-warning mb-3">
                     + Add New Doctor
                </Link>)}

            {/* 创建时间段 和 管理时间段 */}
            <Row className="mt-4">
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Header as="h5">Create New TimeSlot</Card.Header>
                        <Card.Body>
                            {successMsg && <Alert variant="success">{successMsg}</Alert>}
                            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                            <Form onSubmit={handleCreateSlot}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Doctor</Form.Label>
                                    <Form.Select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                                        {doctors.map(doc => (
                                            <option key={doc.id} value={doc.id}>Dr. {doc.username} ({doc.specialty})</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
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

                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Header as="h5">Manage TimeSlots</Card.Header>
                        <Card.Body style={{ maxHeight: '350px', overflowY: 'auto' }}>
                            <Table striped bordered hover responsive size="sm">
                                <thead>
                                    <tr><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {slots.map(slot => (
                                        <tr key={slot.id}>
                                            <td>Dr. {slot.doctor.username}</td>
                                            <td>{slot.date}</td>
                                            <td>{slot.start_time}</td>
                                            <td>
                                                {slot.is_available ? <Badge bg="success">Available</Badge> : <Badge bg="secondary">Booked</Badge>}
                                            </td>
                                            <td>
                                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditSlotClick(slot)}>Edit</Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteSlot(slot.id)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col md={12}>
                    <Card className="mb-4">
                        <Card.Header as="h5">Patient Bookings</Card.Header>
                        <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <Table striped bordered hover responsive size="sm">
                                <thead>
                                    <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {appointments.map(app => (
                                        <tr key={app.id}>
                                            <td>{app.patient.username}</td>
                                            <td>Dr. {app.time_slot.doctor.username}</td>
                                            <td>{app.time_slot.date}</td>
                                            <td>{app.time_slot.start_time}</td>
                                            <td>
                                                <Badge bg={app.status === 'Booked' ? 'success' : 'danger'}>{app.status}</Badge>
                                            </td>
                                            <td>
                                                {app.status !== 'Cancelled' && (
                                                    <>
                                                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditApptClick(app)}>Edit</Button>
                                                        <Button variant="danger" size="sm" onClick={() => handleCancelAppt(app.id)}>Cancel</Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                {isAdmin && (
                    <Col md={6}>
                        <Card>
                            <Card.Header as="h5">Manage Doctors</Card.Header>
                            <Card.Body>
                                <Table striped bordered hover responsive size="sm">
                                    <thead><tr><th>Name</th><th>Specialty</th><th>Action</th></tr></thead>
                                    <tbody>
                                        {doctors.map(doc => (
                                            <tr key={doc.id}>
                                                <td>Dr. {doc.username}</td>
                                                <td>{doc.specialty}</td>
                                                <td>
                                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditDoctorClick(doc)}>Edit</Button>
                                                    <Button variant="danger" size="sm" onClick={() => handleDeleteDoctor(doc.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {isAdmin && (
                    <Col md={6}>
                        <Card>
                            <Card.Header as="h5">Manage Patients</Card.Header>
                            <Card.Body>
                                <Table striped bordered hover responsive size="sm">
                                    <thead><tr><th>Username</th><th>Phone</th><th>Action</th></tr></thead>
                                    <tbody>
                                        {patients.map(patient => (
                                            <tr key={patient.id}>
                                                <td>{patient.username}</td>
                                                <td>{patient.email || 'N/A'}</td>
                                                <td>
                                                    <Button variant="danger" size="sm" onClick={() => handleDeletePatient(patient.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            {/* 医生窗 */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton><Modal.Title>Edit Doctor</Modal.Title></Modal.Header>
                <Modal.Body>
                    {editingDoctor && (
                        <Form onSubmit={handleUpdateDoctor}>
                            <Form.Group className="mb-3"><Form.Label>Username</Form.Label><Form.Control type="text" value={editingDoctor.username || ''} onChange={(e) => setEditingDoctor({...editingDoctor, username: e.target.value})} /></Form.Group>
                            <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={editingDoctor.email || ''} onChange={(e) => setEditingDoctor({...editingDoctor, email: e.target.value})} /></Form.Group>
                            <Form.Group className="mb-3"><Form.Label>Specialty</Form.Label><Form.Control type="text" value={editingDoctor.specialty || ''} onChange={(e) => setEditingDoctor({...editingDoctor, specialty: e.target.value})} /></Form.Group>
                            <Form.Group className="mb-3"><Form.Label>Phone</Form.Label><Form.Control type="text" value={editingDoctor.phone || ''} onChange={(e) => setEditingDoctor({...editingDoctor, phone: e.target.value})} /></Form.Group>
                            <Button variant="primary" type="submit" className="w-100">Save Changes</Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            {/* 时间段窗 */}
            <Modal show={showSlotModal} onHide={() => setShowSlotModal(false)}>
                <Modal.Header closeButton><Modal.Title>Edit TimeSlot</Modal.Title></Modal.Header>
                <Modal.Body>
                    {editingSlot && (
                        <Form onSubmit={handleUpdateSlot}>
                            <Form.Group className="mb-3"><Form.Label>Date</Form.Label><Form.Control type="date" value={editingSlot.date || ''} onChange={(e) => setEditingSlot({...editingSlot, date: e.target.value})} required /></Form.Group>
                            <Form.Group className="mb-3"><Form.Label>Start Time</Form.Label><Form.Control type="time" value={editingSlot.start_time || ''} onChange={(e) => setEditingSlot({...editingSlot, start_time: e.target.value})} required /></Form.Group>
                            <Button variant="primary" type="submit" className="w-100">Save Changes</Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={showApptModal} onHide={() => setShowApptModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reschedule for {selectedAppt?.patient.username}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {availableSlots.length === 0 ? <p>No other available slots for this doctor.</p> : (
                        <ListGroup>
                            {availableSlots.map(slot => (
                                <ListGroup.Item key={slot.id} className="d-flex justify-content-between align-items-center">
                                    <span>{slot.date} at {slot.start_time}</span>
                                    <Button variant="success" size="sm" onClick={() => handleConfirmEditAppt(slot.id)}>
                                        Confirm
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default AdminDashboard;