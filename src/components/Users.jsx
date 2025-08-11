/* eslint-disable no-self-compare */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Alert, Toast, ToastContainer, Modal } from 'react-bootstrap';
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import LoadingIndicator from './LoadingIndicator';
import { useSelector } from 'react-redux';

const Users = () => {
  const [user, setUser ] = useState([]);
  const { users } = useSelector((state) => state.auth); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [showToast, setShowToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getUser ();
  }, []);

  const getUser  = async () => {
    setLoading(true);
    setError(null); 
    try {
      const response = await axios.get('http://145.79.8.133:5000/users');
      setUser (response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  // Function to show delete confirmation modal
  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  // Function to delete user after confirmation
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://145.79.8.133:5000/users/${userToDelete}`);
      setShowDeleteModal(false);
      setShowToast(true);
      getUser ();
    } catch (err) {
      console.error('Error deleting user:', err);
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
            User berhasil dihapus!
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal className='text-blue' show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header className='bg-light2' closeButton>
          <Modal.Title className='fw-bold h3'>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus user ini?
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

      <h2 className="mt-5 text-blue fw-bold">Daftar Akun</h2>
      {users && users.role === "owner" && ( 
        <Link style={{ border: 'none' }} to="/users/add" className="btn btn-primary btn-hover text-white mt-2">
          <FaPlus /> Tambah Akun
        </Link>
      )}
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
          <Table border={1} bordered responsive className='text-center custom-table'>
            <thead className='custom-table'>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Dibuat oleh</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {user.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.nama}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.nama}</td>
                  <td>
                  {users  && ( 
                    users.role === "owner" || user.id === users.id ? (
                    <Link
                      to={`/users/edit/${user.id}`}
                      className="btn btn-sm btn-primary me-2 text-white"
                    >
                      <FaEdit />
                    </Link>
                    ) : null
                    )}
                    {users && users.role === "owner" && ( 
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(user.id)}
                        className='me-2 mt-1 mb-lg-1'
                      >
                        <FaTrash />
                      </Button>
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

export default Users;
