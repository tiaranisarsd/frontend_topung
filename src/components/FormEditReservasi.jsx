import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Toast, ToastContainer, Spinner } from 'react-bootstrap'; 
import { useNavigate, useParams } from "react-router-dom"; 
import { FaSave, FaTimesCircle } from 'react-icons/fa';

const FormEditReservasi = () => {
    const [terapisList, setTerapisList] = useState([]);
    const [buktiPembayaran, setBuktiPembayaran] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { id } = useParams(); 

    const [formData, setFormData] = useState({
        layanan: '',
        tanggal_waktu: '',
        nama: '',
        usia: '',
        no_telp: '',
        alamat: '',
        keluhan: '',
        pembayaran: '',
        userId: '',
        jadwalId: '', 
        bukti_pembayaran_url: '' 
    });
    const [selectedTerapis, setSelectedTerapis] = useState(null);

    useEffect(() => {
        const fetchTerapis = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users');
                setTerapisList(response.data);
            } catch (error) {
                console.error('Gagal memuat data terapis:', error);
                setMsg("Gagal memuat data terapis.");
                setShowToast(true);
            }
        };
        fetchTerapis();
    }, []);

useEffect(() => {
    const getReservasiById = async () => {
        if (!id) {
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:5000/reservasi/${id}`);
            const data = response.data;

            setFormData({
                layanan: data.layanan,
                tanggal_waktu: data.jadwal_terapis,
                nama: data.nama,
                usia: data.usia,
                no_telp: data.no_telp.startsWith('62') ? data.no_telp.substring(2) : data.no_telp,
                alamat: data.alamat,
                keluhan: data.keluhan,
                pembayaran: data.pembayaran,
                userId: data.userId, 
                bukti_pembayaran_url: data.bukti_pembayaran || ""
            });

            const foundUser = terapisList.find(t => t.id === data.terapisId);
            if (foundUser) {
                setSelectedTerapis(foundUser);
                setFormData(prevData => ({ ...prevData, namaTerapis: foundUser.nama }));
            }

        } catch (error) {
            console.error('Gagal memuat data reservasi:', error);
            setMsg("Gagal memuat data reservasi.");
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (id && terapisList.length > 0) {
        getReservasiById();
    }
}, [id, terapisList]);

const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setShowToast(false);

    if (formData.pembayaran === 'Transfer' && !buktiPembayaran && !formData.bukti_pembayaran_url) {
        setMsg("Mohon unggah bukti pembayaran untuk metode Transfer.");
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
        payload.append('pembayaran', formData.pembayaran);
        payload.append('userId', formData.userId);
        payload.append('status', 'Menunggu');

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
            pembayaran: formData.pembayaran,
            userId: formData.userId,
            bukti_pembayaran: '',
            status: 'Menunggu',
        };

        headers = { 'Content-Type': 'application/json' };
    }

    try {
        console.log("Payload being sent:", payload);
        await axios.patch(`http://localhost:5000/reservasi/${id}`, payload, { headers });

        setMsg("Reservasi berhasil diperbarui!");
        setShowToast(true);

        setTimeout(() => {
            navigate("/reservasi");
        }, 2000);
    } catch (error) {
        console.error(error.response?.data || error.message);
        setMsg('Terjadi kesalahan saat memperbarui reservasi: ' + (error.response?.data?.msg || error.message));
        setShowToast(true);
    } finally {
        
    }
};


    const handleTerapisChange = (e) => {
        const selected = terapisList.find(t => t.nama === e.target.value);
        setFormData({
            ...formData,
            namaTerapis: selected?.nama || '',
            terapisId: selected?.id || '',
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
                setFormData(prevData => ({ ...prevData, bukti_pembayaran_url: '' })); // Clear existing image URL
            }
        }
    };

    const handleImageChange = (e) => {
        setBuktiPembayaran(e.target.files[0]);
        setFormData(prevData => ({ ...prevData, bukti_pembayaran_url: '' }));
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

            <h2 className="mb-4 text-blue fw-bold">Edit Data Reservasi</h2>
            <div className="card border-none bg-blue2 m-lg-4 shadow">
                <div className="card-body text-blue fw-bold px-lg-5">
                    <Form className='my-1 mx-0 p-1 text-blue' onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Terapis</Form.Label>
                            <Form.Select
                                name="userId"
                                value={formData.userId} 
                                onChange={handleTerapisChange}
                            >
                                <option value="">-- Pilih Terapis --</option>
                                {terapisList.map((item) => ( 
                                    <option key={item.id} value={item.id}>{item.nama}</option> 
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

                        {selectedTerapis && selectedTerapis.jadwal && (
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Tanggal & Waktu</Form.Label>
                                <div className="d-flex flex-wrap gap-2">
                                    {selectedTerapis.jadwal.split(',').map((slot, idx) => {
                                        const value = slot.trim();
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
                                    type="text" // Changed to text to better handle phone numbers
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
                            <Form.Label className="fw-bold">Bukti Pembayaran (jika Transfer)</Form.Label>
                            {formData.bukti_pembayaran_url && !buktiPembayaran && (
                                    <div className="mb-2">
                                        <img 
                                            src={formData.bukti_pembayaran_url} 
                                            alt="Bukti Pembayaran Saat Ini" 
                                            className="shadow-sm"
                                            style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                                        />
                                    </div>
                            )}
                            {buktiPembayaran && (
                                <div className="mt-2">
                                    <p>File baru terpilih: {buktiPembayaran.name}</p>
                                    <p className="text-danger">Gambar lama akan diganti dengan yang baru.</p>
                                    <div className="mb-2">
                                        <img 
                                            src={URL.createObjectURL(buktiPembayaran)} 
                                            alt="Preview Bukti Pembayaran Baru" 
                                            style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                                        />
                                    </div>
                                </div>
                            )}
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
                                <span>Perbarui</span>
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

export default FormEditReservasi;