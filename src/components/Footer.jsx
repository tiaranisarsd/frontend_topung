import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom"; 
import logo from '../logo.png';

const Footer = () => {
  return (
    <footer className="bg-footer mt-5 pt-5">
      <Container>
        <Row className="text-start text-blue">
          <Col md={3} className="mb-4 text-center text-md-start">
            <img src={logo} alt="Logo" width="80" className="mb-2" />
            <h6 className="fw-bold text-blue">Media Sosial</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3 mt-2">
              <a href="https://www.facebook.com/ktpitv" target="_blank" className="text-blue blue-hover" rel="noreferrer"><FaFacebookF size={20} /></a>
              <a href="https://www.instagram.com/ktpitv/#" target="_blank" className="text-blue blue-hover" rel="noreferrer"><FaInstagram size={20} /></a>
              <a href="https://www.youtube.com/ktpitv" target="_blank" className="text-blue blue-hover" rel="noreferrer"><FaYoutube size={20} /></a>
            </div>
          </Col>

          <Col md={3} className="mb-4">
            <h6 className="fw-bold text-blue">Layanan Kami</h6>
            <div className="border-2 border-top border-danger bottom-0" style={{width: "80px"}} />
            <ul className="list-unstyled mt-3">
              <li><Link to="/" className="text-blue blue-hover text-decoration-none">Beranda</Link></li>
              <li><Link to="/#edukasi" className="text-blue blue-hover text-decoration-none">Edukasi</Link></li>
              <li><Link to="/#pelayanan" className="text-blue blue-hover text-decoration-none">Pelayanan</Link></li>
              <li><Link to="/#jadwal" className="text-blue blue-hover text-decoration-none">Jadwal Kegiatan</Link></li>
              <li><Link to="/#tentang" className="text-blue blue-hover text-decoration-none">Kontak</Link></li>
            </ul>
          </Col>

          <Col md={3} className="mb-4">
            <h6 className="fw-bold text-blue footer-heading">Lainnya</h6>
            <div className="border-2 border-top border-danger bottom-0" style={{width: "50px"}} />
            <ul className="list-unstyled mt-3">
              <li><Link to="/terapis" className="text-blue blue-hover text-decoration-none">Terapis Kami</Link></li>
              <li><Link to="/tentang" className="text-blue blue-hover text-decoration-none">Tentang Kami</Link></li>
              <li><Link to="/#dokumentasi" className="text-blue blue-hover text-decoration-none">Dokumentasi</Link></li>
              <li><Link to="/#testimoni" className="text-blue blue-hover text-decoration-none">Testimoni</Link></li>
              <li><Link to="/#pertanyaan" className="text-blue blue-hover text-decoration-none">Pertanyaan Umum</Link></li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="fw-bold text-blue footer-heading">Lokasi Kami</h6>
            <div className="border-2 border-top border-danger bottom-0" style={{width: "70px"}} />
            <p className="mt-3 small">
                <Link to="https://maps.app.goo.gl/P4ePt8zqwtYziLn36" target="_blank" className="text-blue blue-hover text-decoration-none">
              Jl. Perumahan Jatijajar No.RT.3, RW.10, Blok A7 No.16, Jatijajar,<br />
              Kec. Tapos, Kota Depok, Jawa Barat 16457
              </Link>
            </p>
            <p className="small">
            <Link to="https://maps.app.goo.gl/A2nrXwiwi9nDYn4s6" target="_blank" className="text-blue blue-hover text-decoration-none">
              Jl. Pondok Duta Raya No.30, Tugu,<br />
              Kec. Cimanggis, Kota Depok, Jawa Barat 16451
              </Link>
            </p>
          </Col>
        </Row>

        <div className="text-center mt-4 pb-3 text-secondary small">
          © 2025 Komunitas Totok Punggung PD. Depok.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
