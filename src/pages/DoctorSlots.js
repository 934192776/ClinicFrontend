import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Container, ListGroup, Button, Alert } from 'react-bootstrap';

function DoctorSlots() {
    const { id } = useParams();
    const [slots, setSlots] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSlots();

        const interval = setInterval(() => {
            fetchSlots();
        }, 2000);

        return () => clearInterval(interval);
    }, [id]);

    const fetchSlots = async () => {
        try {
            const response = await api.get(`slots/?doctor_id=${id}`);
            setSlots(response.data);
        } catch (error) {
            console.error("Error fetching slots:", error);
            if (slots.length === 0) {
                setErrorMsg("Failed to load slots. Please login first.");
            }
        }
    };

    const bookAppointment = async (slotId) => {
        setErrorMsg('');
        try {
            await api.post('appointments/', {
                time_slot_id: slotId,
                notes: "Booked from React frontend"
            });
            alert("Booked successfully!");
            fetchSlots();
        } catch (error) {
            console.error("Booking failed:", error.response?.data);

            if (error.response && error.response.data) {
                const errorData = error.response.data;
                // 提取后端返回的 JSON 错误信息
                const realError = errorData.non_field_errors
                    ? errorData.non_field_errors[0]
                    : JSON.stringify(errorData);
                alert(`Failed to book: ${realError}`);
            } else {
                alert("Network error. Please check if the backend is running.");
            }

            fetchSlots();
        }
    };

    return (
        <Container className="mt-4">
            <h2>Doctor's Schedule</h2>
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            {slots.length === 0 ? (
                <Alert variant="info">No schedules for this doctor yet.</Alert>
            ) : (
                <ListGroup className="mt-3 shadow-sm">
                    {slots.map(slot => (
                        <ListGroup.Item key={slot.id} className="d-flex justify-content-between align-items-center py-3">
                            <span className="fs-5">
                                <strong>Date:</strong> {slot.date} | <strong>Time:</strong> {slot.start_time}
                            </span>

                            {slot.is_available ? (
                                <Button variant="success" onClick={() => bookAppointment(slot.id)}>
                                    Book Now
                                </Button>
                            ) : (
                                <Button variant="secondary" disabled>
                                    Not available
                                </Button>
                            )}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
            <Button variant="outline-secondary" className="mt-4" onClick={() => navigate('/')}>Back</Button>
        </Container>
    );
}

export default DoctorSlots;