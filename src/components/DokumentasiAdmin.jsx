import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Alert, Toast, ToastContainer, Modal } from 'react-bootstrap';
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import LoadingIndicator from './LoadingIndicator';
import { useSelector } from 'react-redux';

const DokumentasiAdmin = () => {
  const [dokumentasi, setDokumentasiAdmin] = useState([]);
  const { users } = useSelector((state) => state.auth); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [dokumentasiToDelete, setDokumentasiAdminToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false); 
  const [selectedMedia, setSelectedMedia] = useState({ url: '', isVideo: false });

  useEffect(() => {
    getDokumentasiAdmin();
  }, []);

  const getDokumentasiAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/dokumentasi');
      setDokumentasiAdmin(response.data);
    } catch (err) {
      console.error('Error fetching dokumentasi:', err);
      setError(err.message || "Terjadi kesalahan saat memuat data dokumentasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (dokumentasiId) => {
    setDokumentasiAdminToDelete(dokumentasiId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/dokumentasi/${dokumentasiToDelete}`);
      setShowDeleteModal(false);
      setToastMessage('Dokumentasi berhasil dihapus!');
      setToastVariant('success');
      setShowToast(true);
      getDokumentasiAdmin();
    } catch (err) {
      console.error('Error deleting dokumentasi:', err);
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
    const fullUrl = `/api${mediaUrl}`;
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
          Apakah Anda yakin ingin menghapus dokumentasi ini?
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
          <Modal.Title className="text-blue">Media Dokumentasi</Modal.Title>
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
                alt="Dokumentasi"
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

      <h2 className="mt-5 text-blue fw-bold">Daftar Data Dokumentasi</h2>
      <Link style={{ border: 'none' }} to="/dokumentasi/add" className="btn btn-primary btn-hover text-white mt-2">
        <FaPlus /> Tambah Dokumentasi
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
        ) : dokumentasi.length === 0 ? (
          <Alert variant="info" className="text-center">Tidak ada data dokumentasi yang tersedia.</Alert>
        ) : (
          <Table striped bordered hover responsive className='text-center dokumentasi-table'>
            <thead className='custom-table'>
              <tr>
                <th>No</th>
                <th>Judul</th>
                <th>Media</th>
                <th>Dibuat Oleh</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {dokumentasi.map((dokumentasi, index) => (
                <tr key={dokumentasi.id}>
                  <td>{index + 1}</td>
                  <td>{dokumentasi.judul}</td>
                  <td>
                    {dokumentasi.gambar ? (
                      <Button variant="link" onClick={() => handleMediaClick(dokumentasi.gambar)}>
                        {dokumentasi.gambar.endsWith('.mp4') || dokumentasi.gambar.endsWith('.webm') || dokumentasi.gambar.endsWith('.mov') 
                          ? 'Lihat Video' 
                          : 'Lihat Gambar'}
                      </Button>
                    ) : "Tidak Ada Media"}
                  </td>
                  <td>{dokumentasi.user?.nama || ''}</td>
                  <td>
                    {users && (users.role === "owner" || dokumentasi.userId === users.id) ? (
                      <>
                        <Link
                          to={`/dokumentasi/edit/${dokumentasi.id}`}
                          className="btn btn-sm btn-info me-2 text-white"
                        >
                          <FaEdit />
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(dokumentasi.id)}
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

export default DokumentasiAdmin;
