import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Card, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { FaSave, FaTimesCircle } from 'react-icons/fa';


const FormEditEdukasi = () => {
  const [konten, setKonten] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const { id } = useParams();
  
    useEffect(() => {
      const getedukasiById = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/edukasi/${id}`);
          setKonten(response.data.konten);
        } catch (error) {
          if (error.response) {
            setMsg(error.response.data.msg);
            setShowToast(true);
            setTimeout(() => {
              navigate("/edukasi");
            }, 3000);
          }
        }
      };
      getedukasiById();
    }, [id, navigate]);

const updateEdukasi = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!konten) {
    setMsg("Semua bidang harus diisi.");
    setLoading(false);
    setShowToast(true);
    return;
  }

  try {
    await axios.patch(`${process.env.REACT_APP_API_URL}/edukasi/${id}`, {
      konten: konten,
    });
    setMsg("Edukasi berhasil diperbarui!");
    setShowToast(true);
    setTimeout(() => {
      navigate("/edukasi");
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
      <h2 className="mt-5 mb-3 text-blue fw-bold">Edit Edukasi</h2>
      <Card style={{maxWidth: '850px', border: 'none'}} className="bg-blue2 shadow d-flex mx-auto">
        <Card.Body>
          <Form className="text-blue" onSubmit={updateEdukasi}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Konten</Form.Label>
              <p className="fs-12 fst-italic">Salin link YouTube atau TikTok</p>
              <Form.Control
                type="text"
                value={konten}
                onChange={(e) => setKonten(e.target.value)}
                placeholder="Masukkan link konten.."
              />
            </Form.Group>


                        <div className="d-flex justify-content-end">
                        <Button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/edukasi")}
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

export default FormEditEdukasi;