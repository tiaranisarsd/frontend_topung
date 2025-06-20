import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimesCircle } from 'react-icons/fa';

const FormAddReservasi = () => {
    const [buktiPembayaran, setBuktiPembayaran] = useState(null);
    const [users, setUsers] = useState([]); 
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [formData, setFormData] = useState({
        userId: '',
        layanan: '',
        tanggal_waktu: '',
        nama: '',
        usia: '',
        no_telp: '',
        alamat: '',
        keluhan: '',
        pembayaran: '',
    });
    const [selectedTerapis, setSelectedTerapis] = useState(null);

    useEffect(() => {
        const fetchTerapis = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Gagal memuat data terapis:', error);
                setMsg("Gagal memuat data terapis.");
                setShowToast(true);
            }
        };
        fetchTerapis();
    }, []);

const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setShowToast(false);

    try {
        const userId = parseInt(formData.userId, 10); // Ensure userId is an integer
        const jadwalId = selectedTerapis?.jadwalId ? parseInt(selectedTerapis.jadwalId, 10) : null; // Ensure jadwalId is an integer or null

        if (formData.pembayaran === 'Transfer' && !buktiPembayaran) {
            setMsg("Mohon unggah bukti pembayaran untuk metode Transfer.");
            setShowToast(true);
            return;
        }

        if (!formData.nama || !formData.alamat|| !formData.no_telp || !formData.keluhan || !formData.tanggal_waktu || !formData.userId ) {
            setMsg("Semua bidang harus diisi.");
            setShowToast(true);
            return;
        }

        if (!formData.usia || formData.usia === '') {
            setMsg("Usia harus diisi.");
            setShowToast(true);
            return;
        }

        let noTelpToSubmit = formData.no_telp.trim();
        noTelpToSubmit = noTelpToSubmit.replace(/[^0-9]/g, ''); 
        if (!noTelpToSubmit.startsWith('62')) {
            noTelpToSubmit = '62' + noTelpToSubmit; 
        }

        setIsLoading(true);

        let payload;
        let headers;

        if (formData.pembayaran === 'Transfer') {
            payload = new FormData();
            payload.append('layanan', formData.layanan);
            payload.append('tanggal_waktu', formData.tanggal_waktu);
            payload.append('nama', formData.nama);
            payload.append('usia', formData.usia); 
            payload.append('no_telp', noTelpToSubmit);
            payload.append('alamat', formData.alamat);
            payload.append('keluhan', formData.keluhan);
            payload.append('pembayaran', formData.pembayaran); // Ensure this is a string
            payload.append('userId', userId); // Ensure userId is an integer
            payload.append('jadwalId', jadwalId); // Ensure jadwalId is an integer or null
            payload.append('status', 'pending');

            if (buktiPembayaran) {
                payload.append('bukti_pembayaran', buktiPembayaran);
            }

            headers = { 'Content-Type': 'multipart/form-data' };
        } else {
            payload = {
                layanan: formData.layanan,
                tanggal_waktu: formData.tanggal_waktu,
                nama: formData.nama,
                usia: formData.usia, 
                no_telp: noTelpToSubmit,
                alamat: formData.alamat,
                keluhan: formData.keluhan,
                pembayaran: formData.pembayaran, // Ensure this is a string
                userId: userId, // Ensure userId is an integer
                jadwalId: jadwalId, // Ensure jadwalId is an integer or null
                bukti_pembayaran: '',
                status: 'pending',
            };

            headers = { 'Content-Type': 'application/json' };
        }

        console.log("Payload being sent:", payload); 
        await axios.post(`http://localhost:5000/reservasi`, payload, { headers });

        setMsg("Reservasi berhasil dikirim!");
        setShowToast(true);

        setTimeout(() => {
            navigate("/reservasi");
        }, 2000);
    } catch (error) {
        console.error(error.response?.data || error.message);
        setMsg('Terjadi kesalahan saat mengirim reservasi: ' + (error.response?.data?.msg || error.message));
        setShowToast(true);
    } finally {
        setIsLoading(false);
    }
};


    const handleTerapisChange = (e) => {
        const selected = users.find(t => t.nama === e.target.value);
        setFormData({
            ...formData,
            namaTerapis: selected?.nama || '',
            userId: selected?.id || '',
            tanggal_waktu: '', 
        });
        setSelectedTerapis(selected);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'pembayaran') {
            if (value !== 'Transfer') { 
                setBuktiPembayaran(null);
            }
        }
    };

    const handleImageChange = (e) => {
        setBuktiPembayaran(e.target.files[0]);
    };

    const showBuktiPembayaranField = formData.pembayaran === 'Transfer';

    return (
        <div className="container mt-5">
            <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999, position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={4000}
                    autohide
                    bg={msg.includes("berhasil") ? "success" : "danger"}
                >
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Notifikasi</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">
                        {msg}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <h2 className="mb-4 text-blue fw-bold">Tambah Data Reservasi</h2>
            <div className="card border-none bg-blue2 m-lg-4 shadow">
                <div className="card-body text-blue fw-bold px-lg-5">
                    <Form className='my-1 p-1 text-blue' onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Terapis</Form.Label>
                            <Form.Select
                                value={formData.namaTerapis}
                                onChange={handleTerapisChange}
                            >
                                <option value="">-- Pilih Terapis --</option>
                                {users.map((terapis, index) => (
                                    <option key={index} value={terapis.nama}>{terapis.nama}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Pelayanan</Form.Label>
                            <Form.Select
                                name="layanan" 
                                value={formData.layanan}
                                onChange={handleChange}
                            >
                                <option value="">-- Pilih --</option>
                                <option value="Datang Langsung">Datang Langsung</option>
                                <option value="Datang ke Rumah">Datang ke Rumah</option>
                            </Form.Select>
                        </Form.Group>

                {selectedTerapis && selectedTerapis.jadwal_terapis && selectedTerapis.jadwal_terapis.length > 0 ? (
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Tanggal & Waktu</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedTerapis.jadwal_terapis.map((jadwal, idx) => {
                        const value = `${jadwal.hari}: ${jadwal.jam}`;
                        const isSelected = formData.tanggal_waktu === value;
                        return (
                          <Button
                            key={idx}
                            className={`rounded-pill blue-hover bgblue-hover px-3 py-1 fw-bold border-0 ${
                              isSelected ? 'bg-blue text-white ' : 'bg-white text-blue'
                            }`}
                            onClick={() =>
                              setFormData({ ...formData, tanggal_waktu: isSelected ? '' : value })
                            }
                          >
                            {value}
                          </Button>
                        );
                      })}
                    </div>
                  </Form.Group>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Tanggal & Waktu</Form.Label>
                    <div className="text-danger">Maaf, jadwal untuk terapis ini tidak tersedia saat ini. Silakan hubungi terapis untuk informasi lebih lanjut.</div>
                  </Form.Group>
                )}

                        <Form.Group className="mb-3">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                name="nama" 
                                value={formData.nama}
                                onChange={handleChange} 
                                placeholder="Masukkan Nama Anda"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Usia</Form.Label>
                            <Form.Control
                                name="usia" 
                                type="number"
                                value={formData.usia}
                                onChange={handleChange} 
                                placeholder="Masukkan Usia Anda"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>No. Telepon</Form.Label>
                            <div className="d-flex align-items-center">
                                <span className="me-2">+62</span>
                                <Form.Control
                                    name="no_telp" 
                                    type="number"
                                    value={formData.no_telp}
                                    onChange={handleChange} 
                                    placeholder="Masukkan Nomor telepon (cth: 8123456789)"
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Alamat</Form.Label>
                            <Form.Control
                                name="alamat" 
                                as="textarea"
                                rows={2}
                                value={formData.alamat}
                                onChange={handleChange} 
                                placeholder="Masukkan Alamat Lengkap"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Keluhan</Form.Label>
                            <Form.Control
                                name="keluhan" 
                                as="textarea"
                                rows={2}
                                value={formData.keluhan}
                                onChange={handleChange} 
                                placeholder="Jelaskan Keluhan Anda"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Metode Pembayaran</Form.Label>
                            <Form.Select
                                name="pembayaran"
                                value={formData.pembayaran}
                                onChange={handleChange}
                            >
                                <option value="">-- Pilih --</option>
                                <option value="Tunai">Tunai</option>
                                <option value="Transfer">Transfer</option>
                            </Form.Select>
                        </Form.Group>

                        {showBuktiPembayaranField && (
                            <Form.Group className="mb-3">
                                <Form.Label>Bukti Pembayaran (jika Transfer)</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="bukti_pembayaran"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Form.Group>
                        )}
                        <div className="d-flex justify-content-end">
                        <Button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/reservasi")}
                        >
                            <FaTimesCircle className="me-1" /> Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-success ms-2"
                        >
                            {isLoading ? (
                            <>
                                <Spinner 
                                animation="border" 
                                size="sm" 
                                className="me-1 align-middle" 
                                style={{ width: '16px', height: '16px' }} 
                                />
                                <span>Loading...</span>
                            </>
                            ) : (
                            <>
                                <FaSave className="me-1" />
                                <span>Simpan</span>
                            </>
                            )}
                        </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default FormAddReservasi;