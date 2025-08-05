import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Card, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { FaSave, FaTimesCircle } from 'react-icons/fa';

const FormEditDokumentasi = () => {
  const [judul, setJudulDokumentasi] = useState("");
  const [gambar, setGambar] = useState(null); // Untuk file baru yang diunggah
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    judul: '',
    gambar: '' 
  });

  useEffect(() => {
    const getDokumentasiById = async () => {
      try {
        const response = await axios.get(`/api/dokumentasi/${id}`);
        setFormData({
          judul: response.data.judul,
          gambar: response.data.gambar || "" 
        });
        setJudulDokumentasi(response.data.judul);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
          setShowToast(true);
          setTimeout(() => {
            navigate("/dokumentasi");
          }, 3000);
        }
      }
    };
    getDokumentasiById();
  }, [id, navigate]);

  const updateDokumentasi = async (e) => {
    e.preventDefault();

    if (!judul) {
      setMsg("Judul wajib diisi.");
      setShowToast(true);
      return;
    }

    if (gambar && !gambar.type.startsWith('image/') && !gambar.type.startsWith('video/')) {
      setMsg("File untuk dokumentasi harus berupa gambar atau video.");
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("judul", judul);

      if (gambar) {
        formDataToSend.append("gambar", gambar); // Append file baru jika ada
      }

      await axios.patch(`/api/dokumentasi/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg("Dokumentasi berhasil diperbarui!");
      setShowToast(true);

      setTimeout(() => {
        navigate("/dokumentasi");
      }, 2000);
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan saat memperbarui dokumentasi.");
      setShowToast(true);
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
      <h2 className="mt-5 mb-3 text-blue fw-bold">Edit Dokumentasi</h2>
      <Card style={{ maxWidth: '850px', border: 'none' }} className="bg-blue2 shadow d-flex mx-auto">
        <Card.Body>
          <Form className="text-blue" onSubmit={updateDokumentasi}>
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
              <Form.Label className="fw-bold">Unggah Dokumentasi</Form.Label>
              {formData.gambar && !gambar && (
                <div className="mb-2">
                  {formData.gambar.endsWith('.mp4') || formData.gambar.endsWith('.webm') || formData.gambar.endsWith('.mov') ? (
                    <video 
                      controls 
                      className="shadow-sm rounded"
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                    >
                      <source src={`/api${formData.gambar}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img 
                      src={`/api${formData.gambar}`} 
                      alt="Dokumentasi Saat Ini" 
                      className="shadow-sm rounded"
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                    />
                  )}
                </div>
              )}
              {gambar && (
                <div className="mt-2">
                  <p>File baru terpilih: {gambar.name}</p>
                  <p className="text-danger">Dokumentasi lama akan diganti dengan yang baru.</p>
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
              <Form.Control
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/mpeg"
                onChange={handleImageChange}
              />
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
                    <span>Perbarui</span>
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

export default FormEditDokumentasi;
