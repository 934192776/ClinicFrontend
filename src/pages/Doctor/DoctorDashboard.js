import React from 'react';
import { Container, Tab, Nav } from 'react-bootstrap';
import DoctorAppointments from './DoctorAppointments';
import DoctorSlotsManage from './DoctorSlotsManage';

function DoctorDashboard() {
    return (
        <Container className="mt-4">
            <h2 className="mb-4">Doctor Panel</h2>

            <Tab.Container defaultActiveKey="appointments">
                <Nav variant="tabs" className="mb-4">
                    <Nav.Item>
                        <Nav.Link eventKey="appointments" className="fw-bold">Patient Appointments</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="schedule" className="fw-bold">My Schedule</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="appointments">

                        <DoctorAppointments />
                    </Tab.Pane>

                    <Tab.Pane eventKey="schedule">

                        <DoctorSlotsManage />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );
}

export default DoctorDashboard;