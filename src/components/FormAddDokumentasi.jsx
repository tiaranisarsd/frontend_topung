import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Toast, ToastContainer , Spinner } from 'react-bootstrap';
import { FaSave, FaTimesCircle } from 'react-icons/fa';


const FormAddDokumentasi = () => {
  const [judul, setJudulDokumentasi] = useState("");
  const [gambar, setGambar] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const savedokumentasi = async (e) => {
    e.preventDefault();

    if (!judul || !gambar) {
      setMsg("Semua bidang wajib harus diisi.");
      setShowToast(true);
      return;
    }

    if (gambar && !gambar.type.startsWith('image/') && !gambar.type.startsWith('video/')) {
        setMsg("File untuk dokumentasi harus berupa gambar (jpg, png, jpeg, webp) atau video (mp4, mov, dll).");
        setShowToast(true);
        return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("judul", judul);
      
      if (gambar) {
        console.log(`ApMenunggu gambar to FormData: ${gambar.name}, Type: ${gambar.type}`);
        formData.append("gambar", gambar); 
      }

      await axios.post("http://localhost:5000/dokumentasi", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg("Dokumentasi berhasil dikirim!");
      setShowToast(true);

      setTimeout(() => {
        navigate("/dokumentasi");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg || "Terjadi kesalahan saat menambahkan dokumentasi.");
        setShowToast(true);
      } else {
        setMsg("Terjadi kesalahan saat menambahkan dokumentasi.");
        setShowToast(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

    const handleImageChange = (e) => {
        setGambar(e.target.files[0]);
    };

  return (
    <Container className="p-3">
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
      <h2 className="mt-5 mb-3 text-blue fw-bold">Tambah Dokumentasi</h2>
      <Card style={{maxWidth: '850px', border: 'none'}} className="bg-blue2 shadow d-flex mx-auto">
        <Card.Body>
          <Form className="text-blue" onSubmit={savedokumentasi}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Judul Dokumentasi</Form.Label>
              <Form.Control
                type="text"
                value={judul}
                onChange={(e) => setJudulDokumentasi(e.target.value)}
                placeholder="Masukkan judul dokumentasi.."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Upload Dokumentasi</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/mpeg"
                onChange={handleImageChange}
              />
              {gambar && (
                <div className="mt-2">
                  <p>File baru terpilih: {gambar.name}</p>
                  <div className="mb-2">
                    {gambar.type.startsWith('video/') ? (
                      <video 
                        controls 
                        className="shadow-sm rounded"
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                      >
                        <source src={URL.createObjectURL(gambar)} type={gambar.type} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img 
                        src={URL.createObjectURL(gambar)} 
                        alt="Preview Dokumentasi Baru" 
                        className="shadow-sm"
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                      />
                    )}
                  </div>
                </div>
              )}
            </Form.Group>
             <div className="d-flex justify-content-end">
              <Button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/dokumentasi")}
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

export default FormAddDokumentasi;