import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Form, Alert, Carousel } from "react-bootstrap";
import { FaStar, FaRegStar, FaChevronLeft, FaChevronRight, FaCommentDots } from "react-icons/fa";
import axios from "axios";
import LoadingIndicator from "./LoadingIndicator";

// Fungsi untuk memecah array menjadi grup ukuran tertentu
const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

function Tinjauan() {
  const [loading, setLoading] = useState(true);
  const [tinjauan, setTinjauan] = useState([]);
  const [error, setError] = useState(null);
  const [nama, setNama] = useState("");
  const [layanan, setLayanan] = useState("");
  const [rating, setRating] = useState(0);
  const [tinjauanText, setTinjauanText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getTinjauan();
  }, []);

  const getItemsPerSlide = () => {
    if (window.innerWidth < 768) { 
      return 1;
    } else {
      // Perbaikan: Kembalikan 3 item untuk desktop
      return 3; 
    }
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getTinjauan = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://145.79.8.133:5000/tinjauan");
      setTinjauan(response.data);
    } catch (error) {
      console.error("Error fetching tinjauan:", error);
      setError("Gagal memuat data tinjauan.");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) =>
      index < rating ? (
        <FaStar key={index} className="text-warning" />
      ) : (
        <FaRegStar key={index} className="text-muted" />
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://145.79.8.133:5000/tinjauan", {
        nama,
        layanan,
        rating,
        tinjauan: tinjauanText,
      });
      setSuccessMessage("Tinjauan berhasil ditambahkan");
      setTimeout(() => setSuccessMessage(""), 5000);
      setNama("");
      setLayanan("");
      setRating(0);
      setTinjauanText("");
      getTinjauan();
      document.getElementById("anonimCheckbox").checked = false;
    } catch (error) {
      console.error("Error submitting ulasan:", error);
      setError("Gagal menambahkan ulasan.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <>
      <div className="py-5 my-5 bg-light2" id="tinjauan">
        <Container>
          <h2 className="text-center text-blue fw-bold">Ulasan</h2>
          <div className="mt-2 text-center mb-4">
            <h6 className="text-muted fw-normal">Kami sangat menghargai pengalaman Anda bersama layanan kami.</h6>
            <p>
              <FaCommentDots className="me-2 text-blue" />
              <a
                href="/#tambah-ulasan"
                rel="noopener noreferrer"
                className=" text-decoration-none text-primary"
              >
                Klik di sini untuk memberikan ulasan terbaik Anda!
              </a>
            </p>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center my-5">
              <LoadingIndicator animation="border" role="status" style={{ width: "5rem", height: "5rem" }}>
                <span className="visually-hidden">Loading...</span>
              </LoadingIndicator>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          ) : (
            <Row className="justify-content-center position-relative mb-5">
              <Col>
                <Carousel
                  activeIndex={index}
                  onSelect={handleSelect}
                  indicators={true}
                  nextIcon={<span className="carousel-control-next-icon" aria-hidden="true"><FaChevronRight className='text-blue' size={26} /></span>}
                  prevIcon={<span className="carousel-control-prev-icon" aria-hidden="true"><FaChevronLeft className='text-blue' size={26} /></span>}
                  interval={4000}
                >
                  {chunkArray(tinjauan, itemsPerSlide).map((group, index) => (
                    <Carousel.Item key={index}>
                      <Row className="justify-content-center mt-3 mx-lg-5 px-lg-5">
                        {group.map((item) => (
                          <Col key={item.id} xs={12} md={4} className="d-flex justify-content-center mb-3">
                            <Card
                              className="shadow-sm p-2 text-center bgblue-opacity"
                              style={{ width: '300px', border: 'none', height: '200px' }}
                            >
                              <Card.Body className="text-blue">
                                <Card.Title>Nama: {item.nama}</Card.Title>
                                <Card.Subtitle className="text-blue">Layanan: {item.layanan}</Card.Subtitle>
                                <div className="my-2">{renderStars(item.rating)}</div>
                                <Card.Text>{item.tinjauan}</Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </Col>
            </Row>
          )}
        </Container>
      </div>

      <div className="py-5 mt-4" id="tambah-ulasan">
        <Container>
          <h2 className="text-center text-blue fw-bold mt-2 mb-3">Tambah Ulasan</h2>
          <div className="p-4 border rounded bgblue-opacity shadow w-sm-100  mx-lg-5 mt-4 mx-2">
            {successMessage && <Alert className="text-center" variant="success">{successMessage}</Alert>}
            <Form className="text-blue" onSubmit={handleSubmit}>
              <Form.Group className="mb-3 form-floating">
                <Form.Control
                  id="floatingNama"
                  placeholder="Tulis Nama"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
                <Form.Label htmlFor="floatingNama">Nama</Form.Label>
              </Form.Group>

              <Form.Group className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="anonimCheckbox"
                    onChange={(e) => setNama(e.target.checked ? "Anonim" : "")}
                  />
                  <label className="form-check-label" htmlFor="anonimCheckbox">
                    Kirim sebagai Anonim
                  </label>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <select
                  className="form-select"
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
                <Form.Label>Rating</Form.Label>
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

              <Form.Group className="mb-3 form-floating">
                <Form.Control
                  id="floatingTinjauan"
                  placeholder="Tulis Tinjauan"
                  as="textarea"
                  value={tinjauanText}
                  onChange={(e) => setTinjauanText(e.target.value)}
                  required
                />
                <Form.Label htmlFor="floatingTinjauan">Isi Ulasan</Form.Label>
              </Form.Group>

              <div className="text-center d-flex justify-content-end">
                <Button className="btn-primary px-4" type="submit" disabled={!nama || !layanan || !tinjauanText || rating === 0}>
                  Kirim
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Tinjauan;