import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Table, Button, Badge } from 'react-bootstrap';

function MyAppointments() {
    // 这里存放从后端拉取的预约数据
    const [appointments, setAppointments] = useState([]);

    // 页面加载时自动拉取数据
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            // 发送 GET 请求到 appointments 接口
            // 后端重写了 get_queryset，这里只返回当前登录用户的预约
            const response = await api.get('appointments/');
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    // 取消预约
    const handleCancel = async (appointmentId) => {
        // 弹出确认框，防止误点
        if (!window.confirm("Are you sure you want to cancel this appointment?")) {
            return;
        }

        try {
            // 发送 POST 请求到自定义 @action(cancel)
            // URL: /api/appointments/{id}/cancel/
            await api.post(`appointments/${appointmentId}/cancel/`);
            alert("Appointment cancelled successfully!");

            // 取消成功后，重新拉取数据刷新页面
            fetchAppointments();
        } catch (error) {
            console.error("Cancel failed:", error.response?.data);
            alert("Failed to cancel appointment.");
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
                                {/* 嵌套的序列化器就能直接拿到医生的名字 */}
                                <td>Dr. {appt.time_slot.doctor.username}</td>
                                <td>{appt.time_slot.date}</td>
                                <td>{appt.time_slot.start_time}</td>
                                <td>
                                    {/* 根据状态显示不同的颜色标签 */}
                                    <Badge bg={appt.status === 'Booked' ? 'success' : 'danger'}>
                                        {appt.status}
                                    </Badge>
                                </td>
                                <td>
                                    {/* 只有状态为 Booked 的预约，才显示取消按钮 */}
                                    {appt.status === 'Booked' && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleCancel(appt.id)}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

export default MyAppointments;