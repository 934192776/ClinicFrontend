import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // 导入我们刚才写的 axios
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

function DoctorList() {
    // 状态管理：存放从后端获取的医生数据
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();
    // 当页面加载时，自动执行获取数据
    useEffect(() => {
        fetchDoctors();
    }, []);


    const fetchDoctors = async () => {
        try {
            // 发送 GET 请求到 /doctors/
            const response = await api.get('doctors/');
            // 把返回的数据存入 state
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            alert("Failed to load doctors. Status: " + (error.response?.status || error.message));
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Our Doctors</h2>
            <Row>
                {/* 遍历医生列表生成卡片 */}
                {doctors.map((doctor) => (
                    <Col md={4} key={doctor.id} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>Dr. {doctor.username}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Specialty: {doctor.specialty}
                                </Card.Subtitle>
                                <Card.Text>
                                    Phone: {doctor.phone}
                                </Card.Text>
                                {/* 这个按钮用来跳转预约页面 */}
                                <Button variant="primary" onClick={() => navigate(`/doctor/${doctor.id}`)}>
                                    View Slots
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default DoctorList;