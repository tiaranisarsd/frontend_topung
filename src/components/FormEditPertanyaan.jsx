import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Card, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { FaSave, FaTimesCircle } from 'react-icons/fa';


const FormEditPertanyaan = () => {
  const [judul_pertanyaan, setJudulPertanyaan] = useState("");
  const [isi_pertanyaan, setIsiPertanyaan] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const { id } = useParams();
  
    useEffect(() => {
      const getpertanyaanById = async () => {
        try {
          const response = await axios.get(`http://145.79.8.133:5000/pertanyaan/${id}`);
          setJudulPertanyaan(response.data.judul_pertanyaan);
          setIsiPertanyaan(response.data.isi_pertanyaan);
        } catch (error) {
          if (error.response) {
            setMsg(error.response.data.msg);
            setShowToast(true);
            setTimeout(() => {
              navigate("/pertanyaan");
            }, 3000);
          }
        }
      };
      getpertanyaanById();
    }, [id, navigate]);

const updatePertanyaan = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!judul_pertanyaan) {
    setMsg("Judul pertanyaan harus diisi.");
    setLoading(false);
    setShowToast(true);
    return;
  }

    if (!isi_pertanyaan) {
    setMsg("Isi pertanyaan harus diisi.");
    setLoading(false);
    setShowToast(true);
    return;
  }

  try {
    await axios.patch(`http://145.79.8.133:5000/pertanyaan/${id}`, {
      judul_pertanyaan: judul_pertanyaan,
      isi_pertanyaan: isi_pertanyaan
    });
    setMsg("Pertanyaan berhasil diperbarui!");
    setShowToast(true);
    setTimeout(() => {
      navigate("/pertanyaan");
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
      <h2 className="mt-5 mb-3 text-blue fw-bold">Edit Pertanyaan Umum</h2>
      <Card style={{maxWidth: '850px', border: 'none'}} className="bg-blue2 shadow d-flex mx-auto">
        <Card.Body>
          <Form className="text-blue" onSubmit={updatePertanyaan}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Judul Pertanyaan</Form.Label>
              <Form.Control
                type="text"
                value={judul_pertanyaan}
                onChange={(e) => setJudulPertanyaan(e.target.value)}
                placeholder="Masukkan judul pertanyaan.."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Isi Pertanyaan</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={isi_pertanyaan}
                onChange={(e) => setIsiPertanyaan(e.target.value)}
                placeholder="Masukkan isi pertanyaan.."
              />
            </Form.Group>
             <div className="d-flex justify-content-end">
              <Button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/pertanyaan")}
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

export default FormEditPertanyaan;