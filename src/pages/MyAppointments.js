import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Table, Button, Badge, Modal, ListGroup } from 'react-bootstrap';

function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    // 控制弹窗显示和数据
    const [showModal, setShowModal] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);

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

    // 取消预约
    const handleCancel = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            await api.post(`appointments/${appointmentId}/cancel/`);
            alert("Appointment cancelled successfully!");
            fetchAppointments();
        } catch (error) {
            console.error("Cancel failed:", error.response?.data);
            alert("Failed to cancel appointment.");
        }
    };

    // 点击 Edit 按钮，打开弹窗准备改时间
    const handleEditClick = async (appt) => {
        setSelectedAppt(appt);
        setShowModal(true);
        try {
            // 去后端拉取所有可用的时间段
            const response = await api.get('slots/');
            // 过滤出属于同一个医生，且可用的时间段
            const slotsForDoctor = response.data.filter(
                slot => slot.doctor.id === appt.time_slot.doctor.id && slot.is_available
            );
            setAvailableSlots(slotsForDoctor);
        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };

    // 确认修改（取消旧的 + 预约新的）
    const handleConfirmEdit = async (newSlotId) => {
        try {
            //  取消旧预约
            await api.post(`appointments/${selectedAppt.id}/cancel/`);

            // 创建新预约
            await api.post('appointments/', {
                time_slot_id: newSlotId,
                notes: selectedAppt.notes
            });

            alert("Rescheduled successfully!");
            setShowModal(false);
            fetchAppointments(); // 刷新列表
        } catch (error) {
            console.error("Reschedule failed:", error.response?.data);
            alert("Failed to reschedule. Time slot may be taken.");
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">My Appointments</h2>

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

            {/* 修改时间的弹窗 */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Select New Time for Dr. {selectedAppt?.time_slot.doctor.username}</Modal.Title>
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