import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Card, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { FaSave, FaTimesCircle } from 'react-icons/fa';

const FormEditTestimoni = () => {
  const [media, setMedia] = useState(null);
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    media: '' 
  });

  useEffect(() => {
    const getTestimoniById = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/testimoni/${id}`);
        setFormData({
          media: response.data.media || "" 
        });
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
          setShowToast(true);
          setTimeout(() => {
            navigate("/testimoni");
          }, 3000);
        }
      }
    };
    getTestimoniById();
  }, [id, navigate]);

const updateTestimoni = async (e) => {
  e.preventDefault();

  if (media && !media.type.startsWith('image/') && !media.type.startsWith('video/')) {
    setMsg("File untuk testimoni harus berupa media atau video.");
    setShowToast(true);
    return;
  }

  setIsLoading(true);

  try {
    const formData = new FormData();

    if (media) {
      formData.append("media", media); 
    }

    await axios.patch(`${process.env.REACT_APP_API_URL}/testimoni/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setMsg("Testimoni berhasil diperbarui!");
    setShowToast(true);

    setTimeout(() => {
      navigate("/testimoni");
    }, 2000);
  }    catch (error) {
     if (error.response && error.response.status === 400) {
       setMsg(error.response.data.msg || "Terjadi kesalahan saat memperbarui testimoni.");
     } else {
       setMsg("Terjadi kesalahan saat memperbarui testimoni.");
     }
     setShowToast(true);
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
      <h2 className="mt-5 mb-3 text-blue fw-bold">Edit Testimoni</h2>
      <Card style={{ maxWidth: '850px', border: 'none' }} className="bg-blue2 shadow d-flex mx-auto">
        <Card.Body>
          <Form className="text-blue" onSubmit={updateTestimoni}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Unggah Testimoni</Form.Label>
              {formData.media && !media && (
                <div className="mb-2">
                  {formData.media.endsWith('.mp4') ? (
                    <video 
                      controls 
                      className="shadow-sm rounded"
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                    >
                      <source src={`${process.env.REACT_APP_API_URL}${formData.media}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img 
                      src={`${process.env.REACT_APP_API_URL}${formData.media}`} 
                      alt="Testimoni Saat Ini" 
                      className="shadow-sm rounded"
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                    />
                  )}
                </div>
              )}
              {media && (
                <div className="mt-2">
                  <p>File baru terpilih: {media.name}</p>
                  <p className="text-danger">Testimoni lama akan diganti dengan yang baru.</p>
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

export default FormEditTestimoni;
