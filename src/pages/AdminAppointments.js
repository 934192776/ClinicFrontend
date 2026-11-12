import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Table, Button, Badge, Modal, ListGroup } from 'react-bootstrap';

function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);

    const fetchAllAppointments = async () => {
        try {
            const res = await api.get('appointments/');
            setAppointments(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAllAppointments();
    }, []);

    // 取消预约
    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to CANCEL this appointment for the patient?")) return;
        try {
            await api.post(`appointments/${id}/cancel/`);
            fetchAllAppointments();
        } catch (error) {
            alert("Failed to cancel");
        }
    };

    const handleEditClick = async (appt) => {
        setSelectedAppt(appt);
        setShowModal(true);
        try {
            const res = await api.get('slots/');
            const slotsForDoctor = res.data.filter(
                slot => slot.doctor.id === appt.time_slot.doctor.id && slot.is_available
            );
            setAvailableSlots(slotsForDoctor);
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfirmEdit = async (newSlotId) => {
        try {
            // 1. 取消旧预约
            await api.post(`appointments/${selectedAppt.id}/cancel/`);

            // 2. 创建新预约，并且必须传 patient_id，告诉后端是帮谁改的
            await api.post('appointments/', {
                time_slot_id: newSlotId,
                notes: selectedAppt.notes,
                patient_id: selectedAppt.patient.id
            });

            alert("Rescheduled successfully!");
            setShowModal(false);
            fetchAllAppointments();
        } catch (error) {
            console.error("Reschedule failed:", error.response?.data);
            alert("Failed to reschedule. Time slot may be taken.");
            setShowModal(false);
            fetchAllAppointments();
        }
    };

    return (
        <Container className="mt-4">
            <h2>Patient Bookings</h2>

            <Table striped bordered hover responsive className="mt-3">
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(app => (
                        <tr key={app.id}>
                            <td>{app.patient.username}</td>
                            <td>Dr. {app.time_slot.doctor.username}</td>
                            <td>{app.time_slot.date}</td>
                            <td>{app.time_slot.start_time}</td>
                            <td>
                                <Badge bg={app.status === 'Booked' ? 'success' : 'danger'}>
                                    {app.status}
                                </Badge>
                            </td>
                            <td>
                                {app.status !== 'Cancelled' && (
                                    <>
                                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(app)}>
                                            Edit
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleCancel(app.id)}>
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reschedule for {selectedAppt?.patient.username}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {availableSlots.length === 0 ? <p>No other available slots for this doctor.</p> : (
                        <ListGroup>
                            {availableSlots.map(slot => (
                                <ListGroup.Item key={slot.id} className="d-flex justify-content-between align-items-center">
                                    <span>{slot.date} at {slot.start_time}</span>
                                    <Button variant="success" size="sm" onClick={() => handleConfirmEdit(slot.id)}>
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

export default AdminAppointments;