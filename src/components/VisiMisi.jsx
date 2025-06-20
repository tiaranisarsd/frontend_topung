import React from 'react';
import { BsBinoculars, BsBullseye, BsHandThumbsUp } from 'react-icons/bs';
import { Container, Row, Col, Card } from 'react-bootstrap';

const VisiMisi = () => {
  return (
    <div className="bg-light2 py-5 px-0 m-0" id='visi-misi'>
      <Container fluid className="px-4">
        <h2 className='text-center text-blue fw-bold mb-4'>Visi Misi</h2>
        <Row className="mt-5">
          {/* Visi Section */}
          <Col sm={12} md={4} className="mb-4 d-flex justify-content-center">
            <Card className="border-0 shadow-sm card-hover bgblue-opacity" style={{ width: '80%' }}>
              <Card.Body className="text-center">
                <BsBinoculars size={50} className="text-blue mb-3" />
                <Card.Title className="text-blue fw-bold">Visi</Card.Title>
                <Card.Text className="text-blue mt-4">
                  Menuju Indonesia Sehat Islami & Sehat Alami
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Misi Section */}
          <Col sm={12} md={4} className="mb-4 d-flex justify-content-center">
            <Card className="border-0 shadow-sm card-hover bgblue-opacity" style={{ width: '80%' }}>
              <Card.Body className="text-center">
                <BsBullseye size={50} className="text-blue mb-3" />
                <Card.Title className="text-blue fw-bold">Misi</Card.Title>
                <Card.Text className="text-blue mt-4">
                  1. Melakukan dakwah Pengobatan Syare dan mencegah kemusyrikan
                  <br />
                  2. Membantu pemerintah dalam program menyembuhkan masyarakat
                  <br />
                  3. Mengenalkan Pengobatan Totok Punggung sebagai pengobatan alami; dan
                  <br />
                  4. Mensejahterakan penyembuh Totok Punggung (Kasbul Masiyah).
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Nilai Section */}
          <Col sm={12} md={4} className="mb-4 d-flex justify-content-center">
            <Card className="border-0 shadow-sm card-hover bgblue-opacity" style={{ width: '80%' }}>
              <Card.Body className="text-center">
                <BsHandThumbsUp size={50} className="text-blue mb-3" />
                <Card.Title className="text-blue fw-bold">Nilai</Card.Title>
                <Card.Text className="text-blue mt-4">
                  <ul className="list-unstyled" style={{ paddingLeft: '0' }}>
                    <li>Tauhid</li>
                    <li>Ikhlas</li>
                    <li>Sehat</li>
                    <li>Alami</li>
                    <li>Sejahtera</li>
                  </ul>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VisiMisi;
