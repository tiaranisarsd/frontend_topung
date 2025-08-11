import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Offcanvas, Button, Toast, Modal } from 'react-bootstrap';
import logo from '../logo.png';
import Sidebar from './SidebarAdmin';
import { LogOut } from "../features/authSlice";
import { IoLogOut } from "react-icons/io5";
import { FaBars, FaCheck } from "react-icons/fa";

const HeaderAdmin = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showToast, setShowToast] = useState(false); // Toast for logout success
  const [confirmLogout, setConfirmLogout] = useState(false); // For logout confirmation dialog
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    setConfirmLogout(true);
  };

  const handleConfirmLogout = () => {
    dispatch(LogOut())
      .then(() => {
        setConfirmLogout(false);
        setShowToast(true); // Tampilkan toast setelah logout berhasil
        setTimeout(() => {
          navigate("/login", { state: { message: "Logout berhasil!" } });
        }, 1000);
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  const handleCancelLogout = () => {
    setConfirmLogout(false);
  };

  return (
    <>
      <Navbar style={{ maxHeight: "80px" }} expand="lg" fixed="top" variant="light" className="bg-blue shadow-sm py-1">
        <Container>
          <Navbar.Brand href="/users">
            <img
              src={logo}
              width="55"
              height="55"
              className="logo-navbar d-inline-block align-top me-2"
              alt="Topung Logo"
            />
          </Navbar.Brand>

          <div className="d-flex"> 
            <Button variant="danger" onClick={logout} className="d-none d-lg-block rounded-pill px-4 ms-2">
              <IoLogOut className='me-1' /> Keluar
            </Button>
            
            <Button onClick={() => setShowSidebar(true)} className="d-lg-none border-0 bg-blue">
              <FaBars size={24} color="white" />
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Offcanvas for mobile menu */}
      <Offcanvas 
        id="offcanvasNavbar" 
        style={{width: "250px"}} 
        className="bg-blue shadow" 
        show={showSidebar} 
        onHide={() => setShowSidebar(false)} 
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='text-white fw-bold'>Menu Admin</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='my-1 p-1 d-flex flex-column justify-content-center'>
          <Sidebar isMobile={true} />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Toast for logout success */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
        }}
      >
        <Toast.Body className="text-white rounded text-center bg-success">
          <FaCheck /> Anda berhasil keluar dari akun Anda.
        </Toast.Body>
      </Toast>

      {/* Modal for logout confirmation */}
      <Modal
        show={confirmLogout}
        onHide={handleCancelLogout}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-blue fw-bold">Konfirmasi Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="text-blue">Apakah Anda yakin ingin keluar dari akun Anda?</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={handleCancelLogout}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Ya, Keluar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HeaderAdmin;
