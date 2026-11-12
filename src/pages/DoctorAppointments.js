import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Card, Table, Button, Badge } from 'react-bootstrap';

function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('appointments/');
            setAppointments(res.data);
        } catch (error) { console.error(error); }
    };

    const handleCancelAppt = async (id) => {
        if (!window.confirm("Cancel this patient's appointment?")) return;
        try {
            await api.post(`appointments/${id}/cancel/`);
            alert("Appointment cancelled.");
            fetchAppointments();
        } catch (error) { alert("Failed to cancel"); }
    };

    return (
        <div>
            <h3 className="mb-4">Patient Appointments</h3>
            <Card>
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
        </div>
    );
}

export default DoctorAppointments;