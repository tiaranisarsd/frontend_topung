import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Alert, Toast, ToastContainer, Modal } from 'react-bootstrap';
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import LoadingIndicator from './LoadingIndicator';
import { useSelector } from 'react-redux';

const TestimoniAdmin = () => {
  const [testimoni, setTestimoniAdmin] = useState([]);
  const { users } = useSelector((state) => state.auth); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [testimoniToDelete, setTestimoniAdminToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false); 
  const [selectedMedia, setSelectedMedia] = useState({ url: '', isVideo: false });

  useEffect(() => {
    getTestimoniAdmin();
  }, []);

  const getTestimoniAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/testimoni');
      setTestimoniAdmin(response.data);
    } catch (err) {
      console.error('Error fetching testimoni:', err);
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (testimoniId) => {
    setTestimoniAdminToDelete(testimoniId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/testimoni/${testimoniToDelete}`);
      setShowDeleteModal(false);
      setToastMessage('Testimoni berhasil dihapus!');
      setToastVariant('success');
      setShowToast(true);
      getTestimoniAdmin();
    } catch (err) {
      console.error('Error deleting testimoni:', err);
      setToastMessage(err.message || "Terjadi kesalahan saat menghapus data.");
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMediaClick = (mediaUrl) => {
    const isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm') || mediaUrl.endsWith('.mov');
    // Tambahkan base URL server ke path file
    const fullUrl = `http://localhost:5000${mediaUrl}`;
    setSelectedMedia({ url: fullUrl, isVideo });
    setShowMediaModal(true);
  };

  const handleCloseMediaModal = () => {
    setShowMediaModal(false);
    setSelectedMedia({ url: '', isVideo: false });
  };

  return (
    <Container className="p-3">
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999, position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={3000} 
          autohide 
          bg={toastVariant}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Notifikasi</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
        
      <Modal className='text-blue' show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header className='bg-light2' closeButton>
          <Modal.Title className='fw-bold h3'>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus testimoni ini?
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

      <Modal show={showMediaModal} onHide={handleCloseMediaModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-blue">Media Testimoni</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedMedia.url ? (
            selectedMedia.isVideo ? (
              <video controls className="w-100" style={{ maxHeight: '70vh' }} onError={() => alert('Gagal memuat video.')}>
                <source src={selectedMedia.url} type="video/mp4" />
                Browser Anda tidak mendukung tag video.
              </video>
            ) : (
              <img
                src={selectedMedia.url}
                alt="Testimoni"
                className="img-fluid"
                style={{ maxHeight: '70vh', width: '100%', objectFit: 'contain' }}
                onError={() => alert('Gagal memuat gambar.')}
              />
            )
          ) : (
            <Alert variant="warning">Tidak ada media yang tersedia untuk ditampilkan.</Alert>
          )}
        </Modal.Body>
      </Modal>

      <h2 className="mt-5 text-blue fw-bold">Daftar Data Testimoni</h2>
      <Link style={{ border: 'none' }} to="/testimoni/add" className="btn btn-primary btn-hover text-white mt-2">
        <FaPlus /> Tambah Testimoni
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
        ) : testimoni.length === 0 ? (
          <Alert variant="info" className="text-center">Tidak ada data testimoni yang tersedia.</Alert>
        ) : (
          <Table striped bordered hover responsive className='text-center testimoni-table'>
            <thead className='custom-table'>
              <tr>
                <th>No</th>
                <th>Media Testimoni</th>
                <th>Dibuat Oleh</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {testimoni.map((testimoni, index) => (
                <tr key={testimoni.id}>
                  <td>{index + 1}</td>
                  <td>
                    {testimoni.media ? (
                      <Button variant="link" onClick={() => handleMediaClick(testimoni.media)}>
                        {testimoni.media.endsWith('.mp4') || testimoni.media.endsWith('.webm') || testimoni.media.endsWith('.mov') 
                          ? 'Lihat Video' 
                          : 'Lihat Gambar'}
                      </Button>
                    ) : "Tidak Ada Media"}
                  </td>
                  <td>{testimoni.user?.nama || ''}</td>
                  <td>
                    {users && (users.role === "owner" || testimoni.userId === users.id) ? (
                      <>
                        <Link
                          to={`/testimoni/edit/${testimoni.id}`}
                          className="btn btn-sm btn-info me-2 text-white"
                        >
                          <FaEdit />
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(testimoni.id)}
                          className='me-2 mt-1 mb-lg-1'
                        >
                          <FaTrash />
                        </Button>
                      </>
                    ) : (
                      ''
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

export default TestimoniAdmin;
