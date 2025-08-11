import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaClock } from 'react-icons/fa';
import { MdLocationPin, MdEvent } from 'react-icons/md';
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
        const response = await axios.get('http://145.79.8.133:5000/jadwalKegiatan');
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
            className="form-select text-blue bgblue-opacity"
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
                <Carousel.Item className='mx-lg-3' id='jadwal' key={slideIndex}>
                <Row className="justify-content-center mx-lg-5 px-lg-5 mt-3">
                    {items.map((item) => (
                    <Col
                        key={item.id}
                        xs={12}
                        md={6}
                        className="d-flex justify-content-center mb-4"
                    >
            <div
            className="card w-75 border-0 fs-6 m-1 px-2 p-4 shadow-sm bgblue-opacity"
          >
            <div className="text-blue px-2 mt-3 rounded-top text-center">
              <h5 className="text-blue-50 fs-4 fw-bold">{item.jenis_kegiatan}</h5>
              <p className='fw-normal fs-5 px-2'>{item.deskripsi}</p>
            </div>
            <div className="card-body pt-0 text-blue">
              <p className="text-blue mb-1">
                <MdEvent className="me-1 text-blue" />
                {new Date(item.tanggal_waktu).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className="text-blue mb-1">
                <FaClock size={14} className="me-2 text-blue" />
                {new Date(item.tanggal_waktu).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </p>
              <p><MdLocationPin size={18} className="me-1 text-blue"/> {item.lokasi}</p>
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
