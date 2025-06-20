import React from 'react';
import { Card, Col, Row, Container } from 'react-bootstrap';
import { FaClinicMedical, FaHouseUser } from "react-icons/fa";
import { Link } from 'react-router-dom';

const cardStyle = {
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    borderRadius: '50%', 
    width: '200px', 
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', 
    padding: '12px',
    margin: '0px auto',
    border: 'none'
  };

const cardHoverStyle = {
  transform: 'translateY(-5px)',
  boxShadow: '0 6px 12px #12175E',
};

const layananData = [
  {
    title: 'Datang ke Rumah',
    icon: <FaHouseUser className='text-blue' size={50} />,
    link: '/terapis',
  },
  {
    title: 'Datang Langsung',
    icon: <FaClinicMedical className='text-blue' size={50} />,
    link: '/tentang#lokasi',
  },
];

const PelayananComponent = () => {
  return (
    <div className="py-5 my-5 bg-light2" id='pelayanan'>
      <Container>
        <h2 className="text-center text-blue fw-bold mb-4">Pelayanan</h2>
        <Row className="justify-content-center">
          {layananData.map((layanan, index) => (
            <Col key={index} md={6} lg={4} className="mb-4 mt-3">
              <Link to={layanan.link} className="text-decoration-none">
                <Card
                  className="h-100 shadow-sm bgblue-opacity d-flex w-sm-75 flex-column align-items-center justify-content-center"
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = cardHoverStyle.transform;
                    e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <Card.Body className="text-center">
                    <div className="mb-3">{layanan.icon}</div>
                    <Card.Title className="mb-2 text-blue fw-bold h6 ">{layanan.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default PelayananComponent;
