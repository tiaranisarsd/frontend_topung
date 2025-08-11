import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import lokasi1 from '../Lokasi1.jpg';
import lokasi2 from '../Lokasi2.jpg';
import { Link } from "react-router-dom"; 

const Lokasi = () => {
  return (
    <Container className="py-5 my-5" id='lokasi'>
      <h2 className="text-center fw-bold text-blue mb-5">Lokasi</h2>
      <Row className="d-flex justify-content-center">
        <Col sm={12} md={6} lg={4} className="mb-4">
        <Link to="https://maps.app.goo.gl/P4ePt8zqwtYziLn36" target="_blank" className="text-blue blue-hover text-decoration-none">
          <Card className="border-0 card-hover shadow-sm">
            <Card.Img variant="top" src={lokasi1} alt="Lokasi 1" style={{ height: '250px', objectFit: 'cover' }}  />
            <Card.Body className="text-center">
              <Card.Text className="text-blue fw-normal">
                Jl. Perumahan Jatijajar No.RT.3, RW.10, Blok A7 No.16, Jatijajar, Kec. Tapos, Kota Depok, Jawa Barat 16457
              </Card.Text>
            </Card.Body>
          </Card>
          </Link>
        </Col>

        <Col sm={12} md={6} lg={4} className="mb-4">
        <Link to="https://maps.app.goo.gl/A2nrXwiwi9nDYn4s6" target="_blank" className="text-blue blue-hover text-decoration-none">
          <Card className="border-0 card-hover shadow-sm fw-normal">
            <Card.Img variant="top" src={lokasi2} alt="Lokasi 2" style={{ height: '250px', objectFit: 'cover' }} />
            <Card.Body className="text-center">
              <Card.Text className="text-blue">
                Jl. Pondok Duta Raya No.30, Tugu, Kec. Cimanggis, Kota Depok, Jawa Barat 16451
              </Card.Text>
            </Card.Body>
          </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Lokasi;
