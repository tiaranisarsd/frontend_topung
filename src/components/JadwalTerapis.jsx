import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Container, Table, Button, Form, Alert, Toast, ToastContainer, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from "axios";
import { useSelector } from 'react-redux';
import LoadingIndicator from './LoadingIndicator';

const JadwalTerapis = () => {
    const [jadwal, setJadwal] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [msg, setMsg] = useState("");
    const [showToast, setShowToast] = useState(false);
    const { users } = useSelector((state) => state.auth);
    const [jadwalToDelete, setJadwalToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        if (selectedUserId) {
            getJadwalByUser(selectedUserId);
        } else {
            setJadwal([]);
            setLoading(false);
        }
    }, [selectedUserId]);

    const getUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:5000/users");
            setUsersList(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Gagal memuat data user. Silakan coba lagi.");
            setUsersList([]);
        } finally {
            setLoading(false);
        }
    };

    const getJadwalByUser = async (userId) => {
        if (!userId) {
            setError("User ID is missing");
            setJadwal([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/jadwalTerapis/users/${userId}`);
            setJadwal(response.data || []);
        } catch (error) {
            console.error("Error fetching jadwal by user:", error);
            setError("Gagal memuat data jadwal. Silakan coba lagi.");
            setJadwal([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (jadwalId) => {
        setJadwalToDelete(jadwalId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!jadwalToDelete) return;

        setIsDeleting(true);
        setError(null);
        try {
            await axios.delete(`http://localhost:5000/jadwalTerapis/${jadwalToDelete}`);
            setMsg("Jadwal berhasil dihapus!");
            setShowToast(true);
            setShowDeleteModal(false);
            getJadwalByUser(selectedUserId); // Refresh data setelah penghapusan
        } catch (error) {
            console.error("Error deleting jadwal:", error);
            setMsg(error.response ? error.response.data.msg : "Gagal menghapus jadwal. Silakan coba lagi.");
            setShowToast(true);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAddJadwalClick = () => {
        if (!selectedUserId) {
            setMsg("Silakan pilih terapis terlebih dahulu sebelum menambahkan jadwal.");
            setShowToast(true);
        } else {
            window.location.href = `/jadwalTerapis/add/${selectedUserId}`;
        }
    };

    const canEdit = users && (users.id === Number(selectedUserId));

    // Filter usersList berdasarkan role: owner melihat semua, non-owner hanya melihat dirinya sendiri
    const filteredUsersList = users && users.role === 'owner'
        ? usersList
        : usersList.filter(user => user.id === users?.id);

    // Secara otomatis pilih ID pengguna yang login jika bukan owner
    useEffect(() => {
        if (users && users.role !== 'owner' && filteredUsersList.length > 0) {
            setSelectedUserId(users.id.toString());
        }
    }, [users, filteredUsersList]);

    return (
        <Container className="p-3">
            <h2 className="mt-5 text-blue fw-bold">Daftar Jadwal Terapis</h2>

            {canEdit && (
                <Button
                    onClick={handleAddJadwalClick}
                    className="btn btn-primary btn-hover text-white mb-4 mt-2"
                    style={{ border: 'none' }}
                >
                    <FaPlus /> Tambah Jadwal
                </Button>
            )}

            <Form.Group className="mb-4" style={{ maxWidth: '300px' }}>
                <Form.Label className="fw-bold text-blue">Pilih Terapis</Form.Label>
                <Form.Select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="custom-select"
                    disabled={users && users.role !== 'owner'} 
                >
                    <option value="" disabled>Pilih Terapis</option>
                    {filteredUsersList.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.nama}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <LoadingIndicator animation="border" role="status" style={{ width: "5rem", height: "5rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </LoadingIndicator>
                </div>
            ) : error ? (
                <Alert variant="danger" className="text-center">{"Anda hanya dapat melihat jadwal Anda sendiri."}</Alert>
            ) : !selectedUserId ? (
                <Alert variant="info" className="text-center">
                    {users && users.role !== "owner"
                        ? "Anda hanya dapat melihat jadwal Anda sendiri. Silakan pilih nama Anda dari daftar."
                        : "Silakan pilih terapis untuk melihat jadwal."}
                </Alert>
            ) : (
                <Table bordered responsive className="text-center custom-table">
                    <thead className="custom-table text-blue">
                        <tr>
                            <th>No</th>
                            <th>Hari</th>
                            <th>Jam</th>
                            {canEdit && <th>Tindakan</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {jadwal && jadwal.length > 0 ? (
                            jadwal.map((jadwal, index) => (
                                <tr key={jadwal.id}>
                                    <td>{index + 1}</td>
                                    <td>{jadwal.hari}</td>
                                    <td>{jadwal.jam}</td>
                                    {canEdit && (
                                        <td>
                                            <Link to={`/jadwalTerapis/edit/users/${jadwal.userId}/${jadwal.id}`}
                                                className="btn btn-sm btn-info me-2 text-white"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(jadwal.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={canEdit ? 4 : 3} className="text-center">
                                    Tidak ada jadwal tersedia untuk terapis ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            {/* Modal Konfirmasi Hapus */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Konfirmasi Hapus</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Apakah Anda yakin ingin menghapus jadwal ini?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
                        Batal
                    </Button>
                    <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
                        {isDeleting ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                {' '}Menghapus...
                            </>
                        ) : (
                            'Hapus'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer
                position="bottom-end"
                className="p-3"
                style={{
                    zIndex: 9999,
                    position: "fixed",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            >
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={4000}
                    autohide
                    bg={msg && typeof msg === 'string' && msg.includes("berhasil") ? "success" : "danger"}
                >
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Notifikasi</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{msg}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default JadwalTerapis;
