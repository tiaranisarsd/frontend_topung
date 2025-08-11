import React, { useState } from 'react';
import { Container, Form, Button, Alert, Toast, ToastContainer, InputGroup, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { FcSearch } from "react-icons/fc";

const CheckReservasiStatus = () => {
    const [inputValue, setInputValue] = useState('');
    const [reservasi, setReservasi] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastBg, setToastBg] = useState('success');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setReservasi(null); 

        try {
            const response = await axios.get(`http://145.79.8.133:5000/status`, {
                params: { query: inputValue }
            });
            if (response.data.length > 0) {
                setReservasi(response.data[0]);
                setToastMessage('Status berhasil ditemukan!');
                setToastBg('success');
            } else {
                setToastMessage('Tidak ada reservasi ditemukan dengan informasi tersebut.');
                setToastBg('warning');
            }
            setShowToast(true);
        } catch (err) {
            console.error('Error fetching reservasi:', err);
            setError('Gagal menemukan reservasi. Silakan coba lagi.');
            setToastMessage('Gagal menemukan reservasi.');
            setToastBg('danger');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="p-3 my-5">
            <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999, position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                <Toast 
                    onClose={() => setShowToast(false)} 
                    show={showToast} 
                    delay={2000} 
                    autohide 
                    bg={toastBg}
                >
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Notifikasi</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <fieldset className="mt-2 bgblue-opacity border rounded-3 p-3">
            <legend className="float-none w-auto px-2 fw-bold text-blue fs-4"><FcSearch /> Cek Status Reservasi</legend>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                <Form.Label>Masukkan Nama atau No. Telepon</Form.Label>
                <InputGroup>
                    <Form.Control
                    type="text"
                    placeholder="Contoh: Budi / 081234567890"
                    value={inputValue}
                    onChange={handleInputChange}
                    required
                    />
                    <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Cek Status'}
                    </Button>
                </InputGroup>
                </Form.Group>
            </Form>
            </fieldset>

            {reservasi && (
            <div className="mt-4">
                <h5 className="mb-3 fw-semibold text-blue text-center">Detail Reservasi</h5>
                <div className="shadow-sm w-100 w-lg-50 mx-auto text-blue border rounded p-4 bg-light">
                <Row className="mb-2">
                    <Col xs={5}><strong>Nama Terapis:</strong></Col>
                    <Col xs={7} className="text-break">{reservasi.users.nama}</Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={5}><strong>Layanan:</strong></Col>
                    <Col xs={7} className="text-break">{reservasi.layanan}</Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={5}><strong>Tanggal & Waktu:</strong></Col>
                    <Col xs={7} className="text-break">{reservasi.tanggal_waktu}</Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={5}><strong>Nama:</strong></Col>
                    <Col xs={7} className="text-break">{reservasi.nama}</Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={5}><strong>Usia:</strong></Col>
                    <Col xs={7}>{reservasi.usia}</Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={5}><strong>No Telp:</strong></Col>
                    <Col xs={7} className="text-break">{reservasi.no_telp}</Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={5}><strong>Alamat:</strong></Col>
                    <Col xs={7} className="text-break">{reservasi.alamat}</Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={5}><strong>Pembayaran:</strong></Col>
                    <Col xs={7} className="text-break">{reservasi.pembayaran}</Col>
                </Row>
                <Row className="mt-3 align-items-center">
                    <Col xs={5}><strong>Status:</strong></Col>
                    <Col xs={7}>
                    <span className={`badge px-3 py-2 fs-6 fw-semibold text-white 
                        ${reservasi.status === 'Menunggu' ? 'bg-warning' : 
                        reservasi.status === 'Disetujui' ? 'bg-info' : 
                        reservasi.status === 'Dibatalkan' ? 'bg-danger' : 
                        'bg-success'}`}>
                        {reservasi.status}
                    </span>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                    <Button variant="outline-secondary" size="sm" onClick={() => {setReservasi(null); setInputValue('');}}>
                    Tutup Data
                    </Button>
                </div>
                </div>
            </div>
            )}

            {error && (
                <Alert variant="danger" className="mt-3">
                    {error}
                </Alert>
            )}
        </Container>
    );
};

export default CheckReservasiStatus;
