import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { FaSave, FaTimesCircle } from 'react-icons/fa';

const FormAddJadwalKegiatan = () => {
  const [tanggal_waktu, setTanggalWaktu] = useState("");
  const [jenis_kegiatan, setJenisKegiatan] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const saveJadwalKegiatan = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!tanggal_waktu || !jenis_kegiatan || !lokasi || !deskripsi) {
      setMsg("Semua bidang harus diisi.");
      setLoading(false);
      setShowToast(true);
      return;
    }

    try {
      await axios.post("http://localhost:5000/jadwalKegiatan", {
        tanggal_waktu: tanggal_waktu,
        jenis_kegiatan: jenis_kegiatan,
        lokasi: lokasi,
        deskripsi: deskripsi
      });
      setMsg("Jadwal Kegiatan berhasil disimpan!");
      setShowToast(true);
      setTimeout(() => {
        navigate("/jadwalKegiatan");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
        setShowToast(true);
      } else {
        setMsg("Terjadi kesalahan. Coba lagi nanti.");
        setShowToast(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="p-3">
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999, position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
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
          <Toast.Body className="text-white">
            {msg}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <h2 className="mt-5 mb-3 text-blue fw-bold">Tambah Jadwal Kegiatan</h2>
      <Card style={{ maxWidth: '850px', border: 'none' }} className="bg-blue2 shadow d-flex mx-auto">
        <Card.Body>
          <Form className="text-blue" onSubmit={saveJadwalKegiatan}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tanggal dan Waktu</Form.Label>
              <Form.Control
                type="datetime-local"
                value={tanggal_waktu}
                onChange={(e) => setTanggalWaktu(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Jenis Kegiatan</Form.Label>
              <Form.Select
                value={jenis_kegiatan}
                onChange={(e) => setJenisKegiatan(e.target.value)}
              >
                <option value="">-- Pilih --</option>
                <option value="Baksos">Baksos</option>
                <option value="Pelatihan">Pelatihan</option>
                <option value="Lainnya">Lainnya</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Lokasi</Form.Label>
              <Form.Control
                type="text"
                value={lokasi}
                placeholder="Masukkan Lokasi"
                onChange={(e) => setLokasi(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Masukkan Deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </Form.Group>

             <div className="d-flex justify-content-end">
              <Button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/jadwalKegiatan")}
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormAddJadwalKegiatan;
