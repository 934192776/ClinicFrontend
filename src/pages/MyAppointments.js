import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Container, Table, Button, Badge, Modal, ListGroup, Alert } from 'react-bootstrap';

function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const modalTimerRef = useRef(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('appointments/');
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    const handleCancel = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            await api.post(`appointments/${appointmentId}/cancel/`);
            alert("Appointment cancelled successfully!");
            fetchAppointments();
        } catch (error) {
            alert("Failed to cancel appointment.");
        }
    };

    const fetchAvailableSlots = async (appt) => {
        try {
            const response = await api.get('slots/');
            const slotsForDoctor = response.data.filter(
                slot => slot.doctor.id === appt.time_slot.doctor.id && slot.is_available
            );
            setAvailableSlots(slotsForDoctor);
        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };

    const handleEditClick = (appt) => {
        setSelectedAppt(appt);
        setShowModal(true);
        setErrorMsg('');
        fetchAvailableSlots(appt);

        if (modalTimerRef.current) clearInterval(modalTimerRef.current);
        modalTimerRef.current = setInterval(() => fetchAvailableSlots(appt), 2000);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (modalTimerRef.current) clearInterval(modalTimerRef.current);
    };

    const handleConfirmEdit = async (newSlotId) => {
        setErrorMsg('');
        try {
            await api.post(`appointments/${selectedAppt.id}/cancel/`);
            await api.post('appointments/', {
                time_slot_id: newSlotId,
                notes: selectedAppt.notes
            });
            alert("Rescheduled successfully!");
            handleCloseModal();
            fetchAppointments();
        } catch (error) {
            setErrorMsg("Failed to reschedule. Time slot may be taken by someone else.");
            handleCloseModal();
            fetchAppointments();
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">My Appointments (Patient)</h2>
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            {appointments.length === 0 ? (
                <p>You have no appointments yet.</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appt) => (
                            <tr key={appt.id}>
                                <td>Dr. {appt.time_slot.doctor.username}</td>
                                <td>{appt.time_slot.date}</td>
                                <td>{appt.time_slot.start_time}</td>
                                <td>
                                    <Badge bg={appt.status === 'Booked' ? 'success' : 'danger'}>
                                        {appt.status}
                                    </Badge>
                                </td>
                                <td>
                                    {appt.status === 'Booked' && (
                                        <>
                                            <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(appt)}>
                                                Reschedule
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleCancel(appt.id)}>
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Select New Time</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {availableSlots.length === 0 ? <p>No other available slots.</p> : (
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

export default MyAppointments;