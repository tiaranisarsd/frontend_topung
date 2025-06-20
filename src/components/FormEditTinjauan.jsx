import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Card, Toast, ToastContainer, Spinner  } from 'react-bootstrap';
import { FaSave, FaTimesCircle, FaStar, FaRegStar } from 'react-icons/fa';


const FormAddTinjauan = () => {
  const [nama, setNama] = useState("");
  const [layanan, setLayanan] = useState("");
  const [rating, setRating] = useState("");
  const [tinjauan, setTinjauan] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [msg, setMsg] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const { id } = useParams();

    useEffect(() => {
        const getTinjauanById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/tinjauan/${id}`);
                setNama(response.data.nama);
                setLayanan(response.data.layanan);
                setRating(response.data.rating);
                setTinjauan(response.data.tinjauan);
            } catch (error) {
                if (error.response) {
                  setMsg(error.response.data.msg);
                  setShowToast(true);
                  setTimeout(() => {
                    navigate("/tinjauan");
                  }, 3000);
                }
            }
        };
        getTinjauanById();
    }, [id, navigate]);

  const updateTinjauan = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!nama || !layanan || !rating || !tinjauan ) {
      setMsg("Semua bidang harus diisi.");
      setShowToast(true);
      setLoading(false);
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/tinjauan/${id}`, {
        nama: nama,
        layanan: layanan,
        rating: rating,
        tinjauan: tinjauan
      });
    setMsg("Tinjauan berhasil diperbarui!");
    setShowToast(true);
    setTimeout(() => {
      navigate("/tinjauan");
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
      <h2 className="mt-5 mb-3 text-blue fw-bold">Tambah Tinjauan</h2>
      <Card style={{maxWidth: '850px', border: 'none'}} className="bg-blue2 opacity-75 shadow d-flex mx-auto">
        <Card.Body>
          <Form className="text-blue" onSubmit={updateTinjauan}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nama</Form.Label>
              <Form.Control
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama"
              />
            </Form.Group>
              <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Layanan</Form.Label>
               <select 
                className="form-select" 
                aria-label="Pilih Layanan"
                value={layanan} 
                onChange={(e) => setLayanan(e.target.value)} 
                >
                <option value="">Pilih Layanan</option> 
                <option value="Reservasi">Reservasi</option>
                <option value="Edukasi">Edukasi</option>
                <option value="Pelayanan">Pelayanan</option>
                 </select>
               </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Rating</Form.Label>
                <div className="d-flex">
                  {Array.from({ length: 5 }, (_, index) => {
                    const isFilled = index < (hoverRating || rating);
                    return (
                      <span
                        key={index}
                        onMouseEnter={() => setHoverRating(index + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(index + 1)}
                        style={{ cursor: "pointer" }}
                      >
                        {isFilled ? <FaStar className="text-warning" size={26} /> : <FaRegStar className="text-warning" size={26} />}
                      </span>
                    );
                  })}
                </div>
              </Form.Group>
                            <Form.Group className="mb-3">
                            <Form.Label className="text-blue fw-bold" >Tinjauan</Form.Label> 
                            <Form.Control 
                              placeholder="Tulis Tinjauan" 
                              as="textarea" 
                              value={tinjauan} 
                              onChange={(e) => setTinjauan(e.target.value)} 
                              required 
                            />
                          </Form.Group> 

             <div className="d-flex justify-content-end">
              <Button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/tinjauan")}
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

export default FormAddTinjauan;