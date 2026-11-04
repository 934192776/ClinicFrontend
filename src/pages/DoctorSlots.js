import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Container, ListGroup, Button } from 'react-bootstrap';

function DoctorSlots() {
    // 从 URL 里拿到医生的 ID (比如 医生1)
    const { id } = useParams();
    const [slots, setSlots] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            // 请求特定医生的时间段
            const response = await api.get('slots/');
            // 过滤出属于这个医生，并且是空闲（is_available === true）的时间段
            const doctorSlots = response.data.filter(
                slot => slot.doctor.id === parseInt(id) && slot.is_available === true
            );
            setSlots(doctorSlots);
        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };

    const handleBook = (slotId) => {
        // 点击预约，跳转到确认页面，或者直接发送 POST 请求
        // 这里为了简单直接发送请求
        bookAppointment(slotId);
    };

    const bookAppointment = async (slotId) => {
        try {
            // 发送 POST 请求创建预约
            await api.post('appointments/', {
                time_slot_id: slotId,
                notes: "Booked from React frontend"
            });
            alert("Booked successfully!");
            fetchSlots(); // 重新加载时间段，被约掉的那个就会消失
        } catch (error) {
            // 这里把后端的真实错误打印出来
            console.error("Booking failed:", error.response?.data);
            alert("Failed to book. It might be already booked.");
        }
    };

    return (
        <Container className="mt-4">
            <h2>Available Time Slots</h2>
            {slots.length === 0 ? (
                <p>No available slots for this doctor.</p>
            ) : (
                <ListGroup>
                    {slots.map(slot => (
                        <ListGroup.Item key={slot.id} className="d-flex justify-content-between align-items-center">
                            <span><strong>Date:</strong> {slot.date} | <strong>Time:</strong> {slot.start_time}</span>
                            <Button variant="success" onClick={() => handleBook(slot.id)}>
                                Book Now
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
            <Button variant="secondary" className="mt-3" onClick={() => navigate('/')}>Back to Doctors</Button>
        </Container>
    );
}

export default DoctorSlots;