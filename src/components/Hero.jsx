/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Modal, Form, Toast, ToastContainer, Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import hero from '../hero-image.jpeg';
import axios from 'axios'; 

function Hero() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]); 
  const [jadwal, setJadwal] = useState([]); 
  const [availableJadwal, setAvailableJadwal] = useState([]);
  const [selectedTerapis, setSelectedTerapis] = useState(null);
  const [titleText1, setTitleText1] = useState('');
  const [titleText2, setTitleText2] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullTitle1 = "Komunitas";
  const fullTitle2 = "Totok Punggung PD Depok";
  const typingSpeed = 50;
  const [charIndex1, setCharIndex1] = useState(0);
  const [charIndex2, setCharIndex2] = useState(0);
  const [typingStage, setTypingStage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBuktiModal, setShowBuktiModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showNoRekeningModal, setShowNoRekeningModal] = useState(false);
  const [buktiPembayaran, setBuktiPembayaran] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
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

useEffect(() => {
  const fetchTerapis = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users'); 
      setUsers(response.data || []);
    } catch (error) {
      console.error('Gagal memuat data users:', error);
      setError("Gagal memuat data terapis. Silakan coba lagi nanti.");
    }
  };

  const fetchJadwal = async () => {
    try {
      const response = await axios.get('http://localhost:5000/jadwalTerapis'); 
      setJadwal(response.data || []);
    } catch (error) {
      console.error('Gagal memuat data jadwal:', error);
      setError("Gagal memuat data jadwal. Silakan coba lagi nanti.");
    }
  };

  const fetchAvailableJadwal = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/availableJadwalTerapis");
      setAvailableJadwal(response.data || []);
    } catch (error) {
      console.error("Error fetching available jadwal:", error);
      setError("Gagal memuat jadwal yang tersedia.");
    } finally {
      setLoading(false);
    }
  };
  
  fetchAvailableJadwal();
  fetchTerapis();
  fetchJadwal();
}, []);


  const handleOpenModal = () => {
    setShowModal(true);
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeInOut", delay: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
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
  };

  const handleTerapisChange = (e) => {
    const selected = users.find(t => t.nama === e.target.value);
    setSelectedTerapis(selected);
    setFormData({
      ...formData,
      namaTerapis: selected?.nama || '',
      userId: selected?.id.toString() || '',
      bank: selected?.bank || '',
      no_rekening: selected?.no_rekening || '',
      harga: selected?.harga || '',
      tanggal_waktu: '',
      jadwalId: '',
    });
  };

  useEffect(() => {
    if (!isTyping) return;

    if (typingStage === 1) {
      if (charIndex1 < fullTitle1.length) {
        const timer1 = setTimeout(() => {
          setTitleText1(fullTitle1.substring(0, charIndex1 + 1));
          setCharIndex1(charIndex1 + 1);
        }, typingSpeed);
        return () => clearTimeout(timer1);
      } else {
        setTypingStage(2);
        setCharIndex1(0); 
      }
    } else if (typingStage === 2) {
      if (charIndex2 < fullTitle2.length) {
        const timer2 = setTimeout(() => {
          setTitleText2(fullTitle2.substring(0, charIndex2 + 1));
          setCharIndex2(charIndex2 + 1);
        }, typingSpeed);
        return () => clearTimeout(timer2);
      } else {
        setIsTyping(false); 
      }
    }
  }, [isTyping, charIndex1, charIndex2, fullTitle1, fullTitle2, typingSpeed, typingStage]);

  const handleImageChange = (e) => {
    setBuktiPembayaran(e.target.files[0]);
  };

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

    console.log("Submitting jadwalId:", jadwalId); // Log untuk debugging

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
      payload.append('jadwalId', jadwalId); // Pastikan nama field sesuai dengan backend
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
        jadwalId: jadwalId, // Pastikan nama field sesuai dengan backend
        status: 'Menunggu',
      };

      headers = { 'Content-Type': 'application/json' };
    }

    // Send the POST request
    await axios.post('http://localhost:5000/reservasi', payload, { headers });

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


  const kirimKeWhatsapp = (terapis = selectedTerapis, formDataParam = formData) => {
    if (!terapis) {
      console.error('Data terapis tidak tersedia');
      alert('Terjadi kesalahan: Data terapis tidak ditemukan');
      return;
    }

    let nomorWhatsApp = terapis.no_whatsapp || terapis.no_telp || terapis.whatsapp || '';
    
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
      console.warn('Menggunakan nomor WhatsApp default karena nomor terapis tidak valid');
    }

    const pesan = `Halo, saya sudah melakukan reservasi dengan terapis ${formDataParam.namaTerapis} untuk layanan ${formDataParam.layanan}. Mohon konfirmasinya. Terima kasih.`;
    const url = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error membuka WhatsApp:', error);
      alert(`Gagal membuka WhatsApp. Silakan buka manual: ${url}`);
    }
  };

const getAvailableJadwalForTerapis = () => {
  if (!selectedTerapis || !Array.isArray(availableJadwal)) return [];
  return availableJadwal.filter(jadwal => jadwal.userId === selectedTerapis.id);
};


  return (
    <div className="hero-section bg-light2 text-blue px-lg-1 py-5 my-lg-5" id='beranda'>
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col md={5} className='text-center text-md-start mx-1'>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="hero-title mt-4 fs-2 fw-bold"
            >
              {titleText1}
              {typingStage > 1 && <><br/>{titleText2}</>}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className='mb-5 mt-4 d-grid d-md-block'
            >
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="rounded-pill bg-blue text-light border-0 shadow-none fw-medium px-3 py-1"
                variant="success"
                onClick={handleOpenModal}
              >
                Reservasi
              </motion.button>
            </motion.div>
          </Col>
          <Col style={{ maxWidth: '400px', maxHeight: '400px' }} md={6} className='text-center'>
            <motion.img
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              src={hero}
              alt="Hero"
              className="img-fluid rounded"
            />
          </Col>
        </Row>
      </Container>
      
      {/* Modal */}
      <Modal size='lg' show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header className='text-white bg-blue' closeButton>
          <Modal.Title className='fw-bold text-white mx-auto me-2'>Reservasi</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-blue2 fw-bold'>
          <Form className='my-1 p-1 text-blue'>
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

            {/* Pelayanan */}
            <Form.Group className="mb-3">
              <Form.Label>Pelayanan</Form.Label>
              <Form.Select
                value={formData.layanan}
                onChange={(e) => setFormData({ ...formData, layanan: e.target.value })}
              >
                <option value="">-- Pilih --</option>
                <option value="Datang Langsung">Datang Langsung</option>
                <option value="Datang ke Rumah">Datang ke Rumah</option>
              </Form.Select>
            </Form.Group>

            {/* Jadwal */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tanggal & Waktu</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {selectedTerapis ? (
                  loading ? (
                    <div className="text-muted">Memuat jadwal yang tersedia...</div>
                  ) : getAvailableJadwalForTerapis().length > 0 ? (
                    getAvailableJadwalForTerapis().map((jadwal, idx) => {
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
                    })
                  ) : (
                    <div className="text-danger fw-normal">Maaf, tidak ada jadwal yang tersedia untuk terapis ini. Silakan hubungi terapis untuk informasi lebih lanjut.</div>
                  )
                ) : (
                  <div className="text-danger fw-normal">Maaf, silakan pilih terapis terlebih dahulu untuk melihat jadwal yang tersedia.</div>
                )}
              </div>
            </Form.Group>
      
                <Form.Group className="mb-3">
                  <Form.Label>Nama</Form.Label>
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
                    onChange={(e) => setFormData({ ...formData, usia: parseInt(e.target.value) })}
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
                    placeholder="Jelaskan Keluhan Anda"
                    value={formData.keluhan}
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
}

export default Hero;
