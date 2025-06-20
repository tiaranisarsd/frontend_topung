import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Alert, Toast, ToastContainer, Modal } from 'react-bootstrap';
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import LoadingIndicator from './LoadingIndicator';
import { useSelector } from 'react-redux';

const Pertanyaan = () => {
  const [pertanyaan, setPertanyaan] = useState([]);
  const { users } = useSelector((state) => state.auth); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [pertanyaanToDelete, setPertanyaanToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getPertanyaan();
  }, []);

  const getPertanyaan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/pertanyaan');
      setPertanyaan(response.data);
    } catch (err) {
      console.error('Error fetching pertanyaan:', err);
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

    const handleDeleteClick = (pertanyaanId) => {
    setPertanyaanToDelete(pertanyaanId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/pertanyaan/${pertanyaanToDelete}`);
      setShowDeleteModal(false);
      setShowToast(true);
      getPertanyaan ();
    } catch (err) {
      console.error('Error deleting pertanyaan:', err);
      setError(err.message || "Terjadi kesalahan saat menghapus data.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Container className="p-3">
              <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999, position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                <Toast 
                  onClose={() => setShowToast(false)} 
                  show={showToast} 
                  delay={2000} 
                  autohide 
                  bg="success"
                >
                  <Toast.Header closeButton={false}>
                    <strong className="me-auto">Notifikasi</strong>
                  </Toast.Header>
                  <Toast.Body className="text-white">
                    Pertanyaan berhasil dihapus!
                  </Toast.Body>
                </Toast>
              </ToastContainer>
        
              <Modal className='text-blue' show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header className='bg-light2' closeButton>
                  <Modal.Title className='fw-bold h3'>Konfirmasi Hapus</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Apakah Anda yakin ingin menghapus pertanyaan ini?
                </Modal.Body>
                <Modal.Footer className='border-0 mt-0'>
                  <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}> 
                    Batal
                  </Button>
                  <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}> 
                    {isDeleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        {' '}Loading...
                      </>
                    ) : (
                      'Hapus'
                    )}
                  </Button>
                </Modal.Footer>
              </Modal>
      <h2 className="mt-5 text-blue fw-bold">Daftar Data Pertanyaan</h2>
      <Link style={{ border: 'none' }} to="/pertanyaan/add" className="btn btn-primary btn-hover text-white mt-2">
        <FaPlus /> Tambah Pertanyaan
      </Link>
      <div className="mt-3">
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <LoadingIndicator animation="border" role="status" style={{ width: "5rem", height: "5rem" }}>
              <span className="visually-hidden">Loading...</span>
            </LoadingIndicator>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : Pertanyaan.length === 0 ? (
          <Alert variant="info" className="text-center">Tidak ada data pertanyaan.</Alert>
        ) : (
          <Table striped bordered hover responsive className='text-center pertanyaan-table'>
            <thead className='custom-table'>
              <tr>
                <th>No</th>
                <th>Judul Pertanyaan</th>
                <th>Isi Pertanyaan</th>
                <th>Dibuat Oleh</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {pertanyaan.map((pertanyaan, index) => (
                <tr key={pertanyaan.id}>
                  <td>{index + 1}</td>
                  <td>{pertanyaan.judul_pertanyaan}</td>
                  <td>{pertanyaan.isi_pertanyaan}</td>
                  <td>{pertanyaan.user.nama}</td>
                  <td>
                   {users  && ( 
                     users.role === "owner" || pertanyaan.userId === users.id ? (
                     <><Link
                                      to={`/pertanyaan/edit/${pertanyaan.id}`}
                                      className="btn btn-sm btn-info me-2 text-white"
                                  >
                                      <FaEdit />
                                  </Link><Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => handleDeleteClick(pertanyaan.id)}
                                      className='me-2 mt-1 mb-lg-1'
                                  >
                                          <FaTrash />
                                      </Button></>
                   ) : null
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
};

export default Pertanyaan;