import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';

const JadwalKegiatan = () => {
  const [jadwalKegiatan, setJadwalKegiatan] = useState([]);
  const [jenisKegiatan, setJenisKegiatan] = useState('');
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const jenisPelatihanOptions = ['Baksos', 'Pelatihan', 'Lainnya'];

  const getItemsPerSlide = () => {
    if (window.innerWidth < 768) { 
      return 1;
    } else {
      return 2; 
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

  useEffect(() => {
    const fetchJadwalKegiatan = async () => {
      try {
        const response = await axios.get('${process.env.REACT_APP_API_URL}/jadwalKegiatan');
        setJadwalKegiatan(response.data);
      } catch (error) {
        console.error('Gagal memuat data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJadwalKegiatan();
  }, []);

  const filteredJadwal = jenisKegiatan
    ? jadwalKegiatan.filter(k => k.jenis_kegiatan === jenisKegiatan)
    : jadwalKegiatan;

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };


  return (
    <div className="py-5 my-4 bg-white" id="jadwal">
      <Container>
        <h2 className="text-center text-blue fw-bold mb-4">Jadwal Kegiatan</h2>

        <div className="mb-4 d-flex justify-content-center">
        <select
            className="form-select text-blue fw-bold bgblue-opacity"
            style={{ maxWidth: '400px' }}
            onChange={(e) => setJenisKegiatan(e.target.value)}
            value={jenisKegiatan}
        >
            <option value="">Pilih Jenis Kegiatan</option>
            {jenisPelatihanOptions.map((jenis, i) => (
            <option key={i} value={jenis}>{jenis}</option>
            ))}
        </select>
        </div>


        {loading ? (
          <div className="text-center text-muted">Memuat jadwal kegiatan...</div>
        ) : filteredJadwal.length === 0 ? (
          <div className="text-center">Tidak ada jadwal kegiatan.</div>
        ) : (
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            interval={null}
            indicators={true}
            nextIcon={<FaChevronRight className="text-blue " size={26} />}
            prevIcon={<FaChevronLeft className="text-blue " size={26} />}
          >

            {Array.from({ length: Math.ceil(filteredJadwal.length / itemsPerSlide) }).map((_, slideIndex) => {
            const items = filteredJadwal.slice(
                slideIndex * itemsPerSlide,
                slideIndex * itemsPerSlide + itemsPerSlide
            );

              return (
                <Carousel.Item className='mx-lg-auto' id='jadwal' key={slideIndex}>
                <Row className="justify-content-center mx-lg-5 px-lg-5 mt-3">
                    {items.map((item) => (
                    <Col
                        key={item.id}
                        xs={12}
                        md={6}
                        className="d-flex justify-content-center mb-4"
                    >
                        <div
                        className="card m-1 py-1 shadow-sm bgblue-opacity"
                        style={{ maxWidth: '320px', border: 'none' }}
                        >
                        <div className="text-blue mt-3 fw-bold rounded-top text-center">
                            <h5 className="mb-1 text-blue fw-bold fs-5">
                            {new Date(item.tanggal_waktu).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                            , {new Date(item.tanggal_waktu).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            })}
                            </h5>
                            <p className="text-blue-50 m-0">{item.jenis_kegiatan}</p>
                        </div>
                        <div className="card-body text-blue text-center pt-2">
                            <p><strong>Lokasi:</strong> {item.lokasi}</p>
                            <p className="pt-1"><strong>Deskripsi:</strong> {item.deskripsi}</p>
                        </div>
                        </div>
                    </Col>
                    ))}
                </Row>
                </Carousel.Item>

              );
            })}
          </Carousel>
        )}
      </Container>
    </div>
  );
};

export default JadwalKegiatan;
