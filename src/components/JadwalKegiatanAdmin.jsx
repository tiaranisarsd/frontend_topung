import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Alert, Toast, ToastContainer, Modal } from 'react-bootstrap';
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import LoadingIndicator from './LoadingIndicator';
import { useSelector } from 'react-redux';

const JadwalKegiatan = () => {
  const [jadwalKegiatan, setJadwalKegiatan] = useState([]);
  const { users } = useSelector((state) => state.auth); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [jadwalKegiatanToDelete, setJadwalKegiatanToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getJadwalKegiatan();
  }, []);

  const getJadwalKegiatan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://145.79.8.133:5000/jadwalKegiatan');
      setJadwalKegiatan(response.data);
    } catch (err) {
      console.error('Error fetching jadwalKegiatan:', err);
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

    const handleDeleteClick = (jadwalKegiatanId) => {
    setJadwalKegiatanToDelete(jadwalKegiatanId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://145.79.8.133:5000/jadwalKegiatan/${jadwalKegiatanToDelete}`);
      setShowDeleteModal(false);
      setShowToast(true);
      getJadwalKegiatan ();
    } catch (err) {
      console.error('Error deleting jadwalKegiatan:', err);
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
      <h2 className="mt-5 text-blue fw-bold">Daftar Data Jadwal Kegiatan</h2>
      <Link style={{ border: 'none' }} to="/jadwalKegiatan/add" className="btn btn-primary btn-hover text-white mt-2">
        <FaPlus /> Tambah Jadwal Kegiatan
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
        ) : jadwalKegiatan.length === 0 ? (
           <Alert variant="info" className="text-center">Tidak ada data jadwal kegiatan.</Alert>
        ) : (
          <Table striped bordered hover responsive className='text-center jadwalKegiatan-table'>
            <thead className='custom-table'>
              <tr>
                <th>No</th>
                <th>Tanggal & Waktu</th>
                <th>Jenis Kegiatan</th>
                <th>Lokasi</th>
                <th>Deskripsi</th>
                <th>Dibuat Oleh</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {jadwalKegiatan.map((jadwalKegiatan, index) => (
                <tr key={jadwalKegiatan.id}>
                  <td>{index + 1}</td>
                  <td>
                    {new Date(jadwalKegiatan.tanggal_waktu).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  , {new Date(jadwalKegiatan.tanggal_waktu).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                    </td>
                  <td>{jadwalKegiatan.jenis_kegiatan}</td>
                  <td>{jadwalKegiatan.lokasi}</td>
                  <td>{jadwalKegiatan.deskripsi}</td>
                  <td>{jadwalKegiatan.user.nama}</td>
                  <td>
                   {users  && ( 
                     users.role === "owner" || jadwalKegiatan.userId === users.id ? (
                     <><Link
                                      to={`/jadwalKegiatan/edit/${jadwalKegiatan.id}`}
                                      className="btn btn-sm btn-info me-2 text-white"
                                  >
                                      <FaEdit />
                                  </Link><Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => handleDeleteClick(jadwalKegiatan.id)}
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

export default JadwalKegiatan;