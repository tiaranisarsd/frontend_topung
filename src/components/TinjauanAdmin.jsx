import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Toast, ToastContainer, Modal  } from 'react-bootstrap';
import axios from "axios";
import { FaTrash } from 'react-icons/fa';
import LoadingIndicator from './LoadingIndicator';

const Tinjauan = () => {
  const [tinjauan, setTinjauan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [tinjauanToDelete, setTinjauanToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getTinjauan();
  }, []);

  const getTinjauan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://145.79.8.133:5000/tinjauan');
      setTinjauan(response.data);
    } catch (err) {
      console.error('Error fetching tinjauan:', err);
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

    const handleDeleteClick = (tinjauanId) => {
    setTinjauanToDelete(tinjauanId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://145.79.8.133:5000/tinjauan/${tinjauanToDelete}`);
      setShowDeleteModal(false);
      setShowToast(true);
      getTinjauan ();
    } catch (err) {
      console.error('Error deleting ulasan:', err);
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
                    Jadwal Kegiatan berhasil dihapus!
                  </Toast.Body>
                </Toast>
              </ToastContainer>
        
              <Modal className='text-blue' show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header className='bg-light2' closeButton>
                  <Modal.Title className='fw-bold h3'>Konfirmasi Hapus</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Apakah Anda yakin ingin menghapus jadwal kegiatan ini?
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
      <h2 className="mt-5 text-blue fw-bold">Daftar Data Ulasan</h2>
      <div className="mt-3">
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <LoadingIndicator animation="border" role="status" style={{ width: "5rem", height: "5rem" }}>
              <span className="visually-hidden">Loading...</span>
            </LoadingIndicator>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className='text-center tinjauan-table'>
            <thead className='custom-table'>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Layanan</th>
                <th>Rating</th>
                <th>Isi Ulasan</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {tinjauan.map((tinjauan, index) => (
                <tr key={tinjauan.id}>
                  <td>{index + 1}</td>
                  <td>{tinjauan.nama}</td>
                  <td>{tinjauan.layanan}</td>
                  <td>{tinjauan.rating}</td>
                  <td>{tinjauan.tinjauan}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(tinjauan.id)}
                      className='me-2 mt-1 mb-lg-1'
                    >
                      <FaTrash />
                    </Button>
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

export default Tinjauan;