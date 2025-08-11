/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import { Card, Table, Accordion, Modal, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import { MdLocationPin, MdEvent, MdPictureAsPdf } from 'react-icons/md';
import terapisImage from '../terapis.png';
import { Link } from 'react-router-dom';
import LoadingIndicator from './LoadingIndicator';
import axios from 'axios';

const TerapisKamiPage = () => {
  const [users, setUsers] = useState([]);
  const [availableJadwal, setAvailableJadwal] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showBuktiModal, setShowBuktiModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showNoRekeningModal, setShowNoRekeningModal] = useState(false);
  const [buktiPembayaran, setBuktiPembayaran] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [msg, setMsg] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    layanan: '',
    tanggal_waktu: '',
    nama: '',
    usia: '',
    no_telp: '',
    harga: '',
    alamat: '',
    keluhan: '',
    pembayaran: '',
    bank: '',
    no_rekening: '',
    userId: '',
    jadwalId: '',
  });
  const [selectedTerapis, setSelectedTerapis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerapis = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://145.79.8.133:5000/users');
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Gagal memuat data users:', error);
        setError('Gagal memuat data terapis. Silakan coba lagi nanti.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchAvailableJadwal = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://145.79.8.133:5000/availableJadwalTerapis");
        setAvailableJadwal(response.data);
      } catch (error) {
        console.error("Error fetching available jadwal:", error);
        setError("Gagal memuat jadwal yang tersedia.");
      } finally {
        setLoading(false);
      }
    };

    fetchTerapis();
    fetchAvailableJadwal();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSuccessMessage('');
  setCountdown(0);

  try {
    const userId = parseInt(formData.userId, 10);
    const jadwalId = formData.jadwalId ? parseInt(formData.jadwalId, 10) : 0; // Ensure jadwalId is not null
    
    if (formData.pembayaran === 'Transfer' && !buktiPembayaran) {
      setMsg("Mohon unggah bukti pembayaran untuk metode Transfer.");
      setShowToast(true);
      setIsSubmitting(false);
      return;
    }

    if (!formData.userId || formData.layanan === '' || formData.tanggal_waktu === '' || formData.nama === '' || formData.no_telp === '' || formData.alamat === '' || formData.keluhan === '' || formData.pembayaran === '') {
      setMsg("Semua bidang harus diisi.");
      setShowToast(true);
      setIsSubmitting(false);
      return;
    }

    if (!formData.usia || formData.usia === '') {
      setMsg("Usia harus diisi.");
      setShowToast(true);
      setIsSubmitting(false);
      return;
    }

    if (!formData.jadwalId || formData.jadwalId === '') {
      setMsg("Silakan pilih jadwal terapis.");
      setShowToast(true);
      setIsSubmitting(false);
      return;
    }

    let noTelpToSubmit = formData.no_telp.trim(); 
    noTelpToSubmit = noTelpToSubmit.replace(/[^0-9+]/g, '');

    if (noTelpToSubmit.startsWith('+')) {
      noTelpToSubmit = noTelpToSubmit.substring(1);
    }

    if (noTelpToSubmit.startsWith('0')) {
      noTelpToSubmit = noTelpToSubmit.substring(1);
    }

    if (!noTelpToSubmit.startsWith('62')) {
      noTelpToSubmit = '62' + noTelpToSubmit;
    }

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
      payload.append('userId', userId); 
      payload.append('jadwalId', jadwalId);
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
        usia: formData.usia || '',
        no_telp: noTelpToSubmit || '',
        alamat: formData.alamat,
        keluhan: formData.keluhan,
        pembayaran: formData.pembayaran,
        userId: userId,
        jadwalId: jadwalId,
        status: 'Menunggu',
      };

      headers = { 'Content-Type': 'application/json' };
    }

    // Send the POST request
    await axios.post('http://145.79.8.133:5000/reservasi', payload, { headers });

    setSuccessMessage('Reservasi berhasil dikirim! Anda akan diarahkan ke WhatsApp dalam');
    
    const currentTerapis = selectedTerapis;
    const currentFormDataForWhatsapp = { ...formData, no_telp: noTelpToSubmit }; 
    
    let timeLeft = 3;
    setCountdown(timeLeft);
    
    const countdownInterval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        
        kirimKeWhatsapp(currentTerapis, currentFormDataForWhatsapp); 
        
        setFormData({
          namaTerapis: '',
          layanan: '',
          tanggal_waktu: '',
          nama: '',
          usia: '',
          no_telp: '',
          alamat: '',
          keluhan: '',
          pembayaran: '',
          bank: '',
          no_rekening: '',
          userId: '', 
          bukti_pembayaran: '',
          jadwalId: ''
        });
    
        setBuktiPembayaran(null); 
        setSelectedTerapis(null);
        setShowModal(false); 
        setSuccessMessage('');
        setCountdown(0);
      }
    }, 1000);
  } catch (error) {
    console.error(error.response?.data || error.message);
    // Check if the error is due to a 400 status code
    if (error.response && error.response.status === 400) {
      setMsg(error.response.data.msg || "Maaf, jadwal yang Anda pilih sudah dipesan oleh pelanggan lain dan sedang dalam Disetujui. Silakan pilih jadwal lain.");
    } else {
      setMsg('Terjadi kesalahan saat mengirim reservasi: ' + (error.response?.data?.msg || error.message));
    }
    setShowToast(true);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'pembayaran') {
      if (value === 'Transfer') {
        setShowBuktiModal(true);
        setShowBankModal(true);
        setShowNoRekeningModal(true);
      } else {
        setShowBuktiModal(false);
        setShowBankModal(false);
        setShowNoRekeningModal(false);
        setBuktiPembayaran(null);
      }
    }
  };

const handleOpenModal = (user) => {
  setSelectedTerapis(user);
  setFormData((prev) => ({
    ...prev,
    namaTerapis: user.nama,
    userId: user.id.toString(),
    layanan: '',
    tanggal_waktu: '',
    jadwalId: '',
    bank: user.bank || '', 
    no_rekening: user.no_rekening || '',
    harga: user.harga || ''
  }));
  setShowModal(true);
};


  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      layanan: '',
      tanggal_waktu: '',
      nama: '',
      usia: '',
      no_telp: '',
      harga: '',
      alamat: '',
      keluhan: '',
      pembayaran: '',
      bank: '',
      no_rekening: '',
      userId: '',
      jadwalId: '',
    });
    setShowBankModal(false);
    setShowNoRekeningModal(false);
    setShowBuktiModal(false);
    setBuktiPembayaran(null);
    
    setSelectedTerapis(null);
    
    setShowModal(false);
  };

  const handleImageChange = (e) => {
    setBuktiPembayaran(e.target.files[0]);
  };

  const handleViewCV = (cvUrl) => {
    if (cvUrl) {
      window.open(cvUrl, '_blank', 'noopener,noreferrer');
    } else {
      setMsg('CV tidak tersedia untuk terapis ini.');
      setShowToast(true);
    }
  };

  const kirimKeWhatsapp = (user = selectedTerapis, formDataParam = formData) => {
    if (!user) {
      console.error('Data user tidak tersedia');
      alert('Terjadi kesalahan: Data user tidak ditemukan');
      return;
    }

    let nomorWhatsApp = user.no_whatsapp || user.no_telp || user.whatsapp || '';
    nomorWhatsApp = nomorWhatsApp.replace(/[\s\-\(\)]/g, '');

    if (nomorWhatsApp.startsWith('0')) {
      nomorWhatsApp = '62' + nomorWhatsApp.substring(1);
    } else if (nomorWhatsApp.startsWith('+62')) {
      nomorWhatsApp = nomorWhatsApp.substring(1);
    } else if (!nomorWhatsApp.startsWith('62')) {
      nomorWhatsApp = '62' + nomorWhatsApp;
    }

    if (!nomorWhatsApp || nomorWhatsApp === '62') {
      nomorWhatsApp = '6287872721210';
      console.warn('Menggunakan nomor WhatsApp default karena nomor user tidak valid');
    }

    const pesan = `Halo, saya sudah melakukan reservasi dengan user ${formDataParam.namaTerapis} untuk layanan ${formDataParam.layanan}. Mohon konfirmasinya. Terima kasih.`;
    const url = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error membuka WhatsApp:', error);
      alert(`Gagal membuka WhatsApp. Silakan buka manual: ${url}`);
    }
  };

  // Filter jadwal yang tersedia berdasarkan terapis yang dipilih
const getAvailableJadwalForTerapis = () => {
  if (!selectedTerapis || !Array.isArray(availableJadwal)) return [];
  return availableJadwal.filter(jadwal => jadwal.userId === selectedTerapis.id);
};

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div
        className="position-relative w-100 mx-auto my-3 rounded overflow-hidden"
        style={{
          backgroundImage: `url(${terapisImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px',
        }}
      >
        <div
          className="position-absolute text-blue bottom-0 w-100 d-flex justify-content-center align-items-center"
          style={{
            height: '35%',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(3px)',
          }}
        >
          <h2 className="fw-bold text-blue m-0">Terapis Kami</h2>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mt-5 ms-3">
        <p className="text-blue mb-0">
          <Link to="/" className="text-blue text-decoration-none">Beranda</Link>
          &nbsp;&gt;&nbsp;
          <b>Terapis Kami</b>
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="d-flex justify-content-center text-blue my-5">
          <LoadingIndicator animation="border" role="status" style={{ width: "5rem", height: "5rem" }}>
            <span className="visually-hidden">Loading...</span>
          </LoadingIndicator>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center my-5" role="alert">
          {error}
        </div>
      ) : (
        <>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((item) => (
              <Card key={item.id} className="my-5 border-0 p-3 rounded bgblue-opacity shadow-sm card-hover">
                <Card.Body className="d-flex flex-column flex-md-row align-items-start gap-4 p-4">
                  <div className="text-center">
                    <img
                      src={item.gambar ? `http://145.79.8.133:5000/uploads/users/${item.gambar}` : ''}
                      alt={item.nama}
                      className="rounded-circle"
                      style={{ objectFit: 'cover' }} 
                      width="100"
                      height="100"
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="fw-bold text-blue mb-1">{item.nama}</h5>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <MdLocationPin size={18} className="me-2 text-blue"/> {item.alamat || 'Alamat tidak tersedia'}
                      <div>
                        <Button className="btn-reservasi rounded-pill px-3 px-lg-4 py-1 me-1 fw-bold fs-16" onClick={() => handleOpenModal(item)}>
                          Reservasi
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          className="rounded-pill px-3 px-lg-4 py-1 me-1 fw-bold fs-16" 
                          onClick={() => handleViewCV(item.cv_pdf ? `http://145.79.8.133:5000/uploads/users/${item.cv_pdf}` : '')}
                        >
                          <MdPictureAsPdf className="me-1" /> Lihat CV
                        </Button>
                      </div>
                    </div>

                    <Accordion className='p-0'>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header><MdEvent className="me-2 text-blue" />Lihat Jadwal</Accordion.Header>
                        <Accordion.Body className='p-0'>
                          <Table striped bordered hover size="sm" className="mb-0 text-center text-blue bg-blue2">
                            <thead>
                              <tr>
                                <th>Hari</th>
                                <th>Jam</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.jadwal_terapis && item.jadwal_terapis.length > 0 ? (
                                item.jadwal_terapis.map((jadwal, i) => (
                                  <tr key={i}>
                                    <td>{jadwal.hari}</td>
                                    <td>{jadwal.jam}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="2">Jadwal tidak tersedia</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="text-center my-5 text-blue">Tidak ada data terapis yang tersedia.</div>
          )}

          {/* Modal Reservasi */}
          <Modal size='lg' show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header className='text-white bg-blue' closeButton>
              <Modal.Title className='fw-bold text-white mx-auto me-2'>Reservasi</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-blue2 fw-bold'>
              <Form className='my-1 p-1 text-blue'>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Terapis</Form.Label>
                  <Form.Control value={selectedTerapis?.nama || ''} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Pelayanan</Form.Label>
                  <Form.Select
                    value={formData.layanan}
                    onChange={(e) => setFormData({ ...formData, layanan: e.target.value })}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Datang Langsung">Datang Langsung</option>
                    <option value="Datang ke Rumah">Datang ke Rumah</option>
                  </Form.Select>
                </Form.Group>

                {selectedTerapis && getAvailableJadwalForTerapis().length > 0 ? (
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Tanggal & Waktu</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {getAvailableJadwalForTerapis().map((jadwal, idx) => {
                        const value = `${jadwal.hari}: ${jadwal.jam}`;
                        const isSelected = formData.tanggal_waktu === value;
              return (
                <Button
                  key={idx}
                  className={`rounded-pill blue-hover bgblue-hover px-3 py-1 fw-bold border-0 ${
                    isSelected ? 'bg-blue text-white ' : 'bg-white text-blue'
                  }`}
                  onClick={() =>
                    setFormData({ 
                      ...formData, 
                      tanggal_waktu: isSelected ? '' : value,
                      jadwalId: isSelected ? '' : jadwal.id.toString()
                    })
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
          <div className="text-danger fw-normal">Maaf, jadwal untuk terapis ini tidak tersedia saat ini. Silakan hubungi terapis untuk informasi lebih lanjut.</div>
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Nama</Form.Label>
        <Form.Control
          value={formData.nama}
          placeholder="Masukkan Nama Anda"
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Usia</Form.Label>
        <Form.Control
          type="number"
          value={formData.usia || ''}
          placeholder="Masukkan Usia Anda"
          onChange={(e) => setFormData({ ...formData, usia: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>No. Telepon</Form.Label>
        <div className="d-flex align-items-center">
          <span className="me-2">+62</span>
          <Form.Control
            type="number"
            value={formData.no_telp || ''}
            onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })}
            placeholder="Masukkan Nomor telepon (cth: 8123456789)"
          />
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Alamat</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={formData.alamat}
          placeholder="Masukkan Alamat Lengkap"
          onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Keluhan</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={formData.keluhan}
          placeholder="Jelaskan Keluhan Anda"
          onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Harga</Form.Label>
          <p className="fs-12 mt-0 fw-normal fst-italic">(Harga ini merupakan <b>Deposit Reservasi (khusus pembayaran Transfer).</b> Silahkan konfirmasi ke terapis yang Anda pilih untuk detail pembayaran.)</p>
          <div className="d-flex align-items-center">
            <span className="me-2">Rp.</span>
            <Form.Control
                type="text"
                value={formData.harga !== '' ? formData.harga : 'Terapis belum menetapkan harga, silahkan lakukan pembayaran tunai.'}
                readOnly
                className={formData.harga === '' ? 'text-danger fs-14' : ''}
              />
          </div>
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

      {showBankModal && (
        <Form.Group className="mb-3">
          <Form.Label>Bank</Form.Label>
            <Form.Control
              type="text"
              value={formData.bank !== '' ? formData.bank : 'Terapis belum menetapkan bank, silahkan lakukan pembayaran tunai.'}
              readOnly 
              className={formData.bank === '' ? 'text-danger fs-14' : ''}
            />
        </Form.Group>
      )}

      {showNoRekeningModal && (
      <Form.Group className="mb-3">
        <Form.Label>No Rekening</Form.Label>
          <Form.Control
            type="text"
            value={formData.no_rekening !== '' ? formData.no_rekening : 'Terapis belum menetapkan nomor rekening, silahkan lakukan pembayaran tunai.'}
            readOnly 
            className={formData.no_rekening === '' ? 'text-danger fs-14' : ''}
          />
      </Form.Group>
      )}

      {showBuktiModal && (
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
    </Form>
      {successMessage && (
                <div className="alert alert-success fw-normal mt-3" role="alert">
                  <div className="d-flex align-items-center">
                    <span className="me-2">✅</span>
                    <span>
                      {successMessage} 
                      {countdown > 0 && (
                        <strong className="text-blue"> {countdown} detik</strong>
                      )}
                      {countdown > 0 ? ' untuk konfirmasi kepada terapis.' : ''}
                    </span>
                  </div>
                  {countdown > 0 && (
                    <div className="mt-2">
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ 
                            width: `${((3 - countdown) / 3) * 100}%`,
                            transition: 'width 1s ease-in-out'
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
        )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>Batal</Button>
    <Button variant="primary" type="submit" onClick={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? 'Mengirim...' : 'Kirim Reservasi'}
    </Button>
  </Modal.Footer>
</Modal>

        </>
      )}

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
    </div>
  );
};

export default TerapisKamiPage;