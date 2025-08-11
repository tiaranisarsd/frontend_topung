import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import terapisImage from '../hero-image.jpeg';

const TentangKami = () => {
  return (
    <div className="container py-5">
      {/* Header Section */}
      <div
        className="position-relative w-100 mx-auto my-3 rounded overflow-hidden"
        style={{
          backgroundImage: `url(${terapisImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px',
        }}
      >
        <div
          className="position-absolute text-blue bottom-0 w-100 d-flex justify-content-center align-items-center"
          style={{
            height: '35%',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(3px)',
          }}
        >
          <h2 className="fw-bold text-blue m-0">Tentang Kami</h2>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mt-5 ms-3">
        <p className="text-blue mb-0">
          <Link to="/" className="text-blue text-decoration-none">Beranda</Link>
          &nbsp;&gt;&nbsp;
          <b>Tentang Kami</b>
        </p>
      </div>

      {/* Informasi tentang Totok Punggung */}
      <Container className='my-5 py-5'>
        <Row className="d-flex justify-content-center">
          <Col md={6} lg={5} className="mb-4 d-flex justify-content-end">
            <Card className="border-0 shadow-sm" style={{ backgroundColor: '#E9ECEF', width: '100%', height: 'fit-content' }}>
              <Card.Body>
                <Card.Text className="text-center text-blue" style={{ fontWeight: 'bold' }}>
                  Totok Punggung adalah metode terapi alami yang efektif untuk membantu penyembuhan berbagai penyakit, dari gangguan ringan hingga kronis.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={5} className="d-flex justify-content-start">
            <Card className="mt-2 mt-lg-5 border-0 shadow-sm" style={{ backgroundColor: '#E9ECEF', width: '100%'}}>
              <Card.Body>
                <Card.Text className="text-center text-blue" style={{ fontWeight: 'bold' }}>
                  Melalui website ini, Anda dapat mengakses informasi terapi, layanan, edukasi, dokumentasi, reservasi, serta pelatihan resmi. Temukan manfaat totok punggung dan rasakan sendiri khasiatnya!
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TentangKami;
