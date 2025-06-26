import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Nav, Button, Toast, Modal } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from "../features/authSlice";
import { IoLogOut } from "react-icons/io5";
import { FaUsers, FaCalendarAlt, FaBook, FaComments, FaCheck, FaClipboardList, FaPhotoVideo, FaRegCommentDots, FaQuestionCircle } from 'react-icons/fa';
import { FaUserDoctor } from "react-icons/fa6";

function Sidebar({ isMobile }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const location = useLocation();

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

  const navItems = [
    { path: "/users", icon: <FaUsers className="me-1" />, label: "Users" },
    { path: "/reservasi", icon: <FaClipboardList className="me-1" />, label: "Reservasi" },
    { path: "/edukasi", icon: <FaBook className="me-1" />, label: "Edukasi" },
    { path: "/jadwalKegiatan", icon: <FaCalendarAlt size={14} className="me-1" />, label: "Kegiatan" },
    { path: "/jadwalTerapis", icon: <FaUserDoctor size={14} className="me-1" />, label: "Jadwal" },
    { path: "/dokumentasi", icon: <FaPhotoVideo className="me-1" />, label: "Dokumentasi" },
    { path: "/testimoni", icon: <FaRegCommentDots className="me-1" />, label: "Testimoni" },
    { path: "/ulasan", icon: <FaComments className="me-1" />, label: "Ulasan" },
    { path: "/pertanyaan", icon: <FaQuestionCircle className="me-1" />, label: "Pertanyaan" }
  ];

  return (
    <>
      <div className='ms-lg-2' style={{ width: '200px', height: '100vh' }}>
        <Nav className="flex-column ms-lg-2 ms-4 justify-content-center align-items-center h-100 me-lg-4 list-group">
          {navItems.map((item) => (
            <Nav.Item key={item.path} className={`w-100 my-1`}>
              <Nav.Link
                as={Link}
                to={item.path}
                className={`list-group-item text-blue list-group-item-action text-white text-center rounded-pill ${location.pathname === item.path ? 'bgblue-opacity50 bgblue-hover50' : 'bg-blue bgblue-hover50'}`}
              >
                {item.icon} {item.label}
              </Nav.Link>
            </Nav.Item>
          ))}

          {isMobile && (
            <Button variant="danger" className="mt-5 w-75" onClick={logout}>
              <IoLogOut className='me-1' /> Keluar
            </Button>
          )}
        </Nav>

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
      </div>
    </>
  );
}

export default Sidebar;
