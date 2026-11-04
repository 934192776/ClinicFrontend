import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Table, Badge } from 'react-bootstrap';

function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAllAppointments();
    }, []);

    const fetchAllAppointments = async () => {
        try {

            const response = await api.get('appointments/');
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">All Patient Appointments - Admin</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((app) => (
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
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default AdminAppointments;