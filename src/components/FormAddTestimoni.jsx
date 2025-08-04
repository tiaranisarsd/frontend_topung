import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { FaSave, FaTimesCircle } from 'react-icons/fa';

const FormAddTestimoni = () => {
  const [media, setMedia] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const savetestimoni = async (e) => {
    e.preventDefault();

    if (!media) {
      setMsg("Media testimoni wajib harus diisi.");
      setShowToast(true);
      return;
    }

    if (media && !media.type.startsWith('image/') && !media.type.startsWith('video/')) {
        setMsg("File untuk testimoni harus berupa media (jpg, png, jpeg, webp) atau video (mp4, mov, dll).");
        setShowToast(true);
        return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      
      if (media) {
        console.log(`ApMenunggu media to FormData: ${media.name}, Type: ${media.type}`);
        formData.append("media", media); 
      }

      await axios.post("http://145.79.8.133:5000/testimoni", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg("Testimoni berhasil dikirim!");
      setShowToast(true);

      setTimeout(() => {
        navigate("/testimoni");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg || "Terjadi kesalahan saat menambahkan testimoni.");
        setShowToast(true);
      } else {
        setMsg("Terjadi kesalahan saat menambahkan testimoni.");
        setShowToast(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

    const handleImageChange = (e) => {
        setMedia(e.target.files[0]);
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
      <h2 className="mt-5 mb-3 text-blue fw-bold">Tambah Testimoni</h2>
      <Card style={{maxWidth: '850px', border: 'none'}} className="bg-blue2 shadow d-flex mx-auto">
        <Card.Body>
          <Form className="text-blue" onSubmit={savetestimoni}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Unggah Testimoni</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/mpeg"
                onChange={handleImageChange}
              />
              {media && (
                <div className="mt-2">
                  <p>File baru terpilih: {media.name}</p>
                  <div className="mb-2">
                    {media.type.startsWith('video/') ? (
                      <video 
                        controls 
                        className="shadow-sm rounded"
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                      >
                        <source src={URL.createObjectURL(media)} type={media.type} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img 
                        src={URL.createObjectURL(media)} 
                        alt="Preview Testimoni Baru" 
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
                onClick={() => navigate("/testimoni")}
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

export default FormAddTestimoni;