import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import HeaderAdmin from '../components/HeaderAdmin'
import Sidebar from '../components/SidebarAdmin'

const AdminLayout = ({children}) => {

  return (
    <React.Fragment>
            <div>
            <HeaderAdmin />
            <Container fluid className="mt-5">
                <Row>
                <Col lg={2} className="d-none d-lg-block bg-light2 shadow-sm">
                    <Sidebar isMobile={false} />
                </Col>
                <Col lg={10}>
                    {children}
                </Col>
                </Row>
            </Container>
            </div>
        
    </React.Fragment>
  )
}

export default AdminLayout