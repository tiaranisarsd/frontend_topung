import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { GoXCircleFill } from "react-icons/go";

const Testimoni = () => {
  const [testimoni, setTestimoni] = useState([]);
  const [index, setIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [isVideo, setIsVideo] = useState(false);

  // === START: Penyesuaian agar seperti Dokumentasi ===
  // Fungsi untuk menentukan jumlah item per slide berdasarkan lebar layar
  const getItemsPerSlide = useCallback(() => {
    if (window.innerWidth < 768) {
      return 1;
    } else {
      return 2;
    }
  }, []); // useCallback untuk memoize fungsi

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  // useEffect untuk memantau perubahan ukuran layar
  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getItemsPerSlide]);
  // === END: Penyesuaian agar seperti Dokumentasi ===

  useEffect(() => {
    const fetchTestimoni = async () => {
      try {
        const response = await fetch('/api/testimoni');
        const data = await response.json();
        setTestimoni(data);
      } catch (error) {
        console.error('Gagal memuat testimoni:', error);
      }
    };

    fetchTestimoni();
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const openViewer = useCallback((url, isVid = false) => {
    const fullUrl = `/api${url}`;
    setMediaUrl(fullUrl);
    setIsVideo(isVid);
    setIsViewerOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeViewer = useCallback(() => {
    setIsViewerOpen(false);
    setMediaUrl('');
    setIsVideo(false);
    document.body.style.overflow = 'unset';
  }, []);

  return (
    <div className="testimoni-page bg-white my-4 py-5" id="testimoni">
      <Container>
        <h2 className="text-center text-blue my-4 fw-bold">Testimoni</h2>

        {testimoni.length === 0 ? (
          <p className="text-center">Tidak ada testimoni yang tersedia.</p>
        ) : (
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            indicators={true}
            nextIcon={<FaChevronRight className='text-blue fs-4' />}
            prevIcon={<FaChevronLeft className='text-blue fs-4' />}
            interval={4000}
          >
            {Array.from({ length: Math.ceil(testimoni.length / itemsPerSlide) }).map((_, slideIndex) => { // Menggunakan itemsPerSlide
              const items = testimoni.slice(
                slideIndex * itemsPerSlide,
                slideIndex * itemsPerSlide + itemsPerSlide
              );
              return (
                <Carousel.Item key={slideIndex}>
                  <Row className="justify-content-center">
                    {items.map((item) => (
                      <Col md={5} className="mx-2 mb-4" key={item.id}>
                        <motion.div
                          whileHover={{ scale: 1.02, cursor: 'pointer' }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="bg-light rounded text-center p-4 shadow-sm"
                          onClick={() =>
                            openViewer(item.media, item.media.endsWith('.mp4') || item.media.endsWith('.webm') || item.media.endsWith('.mov'))
                          }
                        >
                          <div className="position-relative">
                            {item.media && (item.media.endsWith('.mp4') || item.media.endsWith('.webm') || item.media.endsWith('.mov')) ? (
                              <>
                                <video
                                  preload="metadata"
                                  muted
                                  className="img-fluid rounded mb-3"
                                  style={{
                                    maxHeight: '200px',
                                    objectFit: 'cover',
                                    width: '100%',
                                  }}
                                  onError={(e) => {
                                    // Sembunyikan video dan tampilkan placeholder jika gagal
                                    console.error(`Gagal memuat video thumbnail untuk ${item.media}`);
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) { // Pastikan ada nextSibling (placeholder image)
                                      e.target.nextSibling.style.display = 'block';
                                    }
                                  }}
                                >
                                  <source src={`/api${item.media}`} type="video/mp4" />
                                  Browser Anda tidak mendukung tag video.
                                </video>
                                {/* Placeholder image jika video gagal dimuat */}
                                <img
                                  src="https://placehold.co/200x200?text=Video+Thumbnail" // Placeholder yang jelas
                                  alt={`Placeholder untuk ${item.judul || 'Video'}`}
                                  className="img-fluid rounded mb-3"
                                  style={{
                                    maxHeight: '200px',
                                    objectFit: 'cover',
                                    width: '100%',
                                    display: 'none', // Hidden by default, shown only if video fails
                                  }}
                                  onError={(e) => {
                                    console.error(`Gagal memuat placeholder untuk ${item.judul || 'Video'}`);
                                  }}
                                />
                                <div className="video-icon-overlay" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                  <FaPlay className="text-white" size={24} />
                                </div>
                              </>
                            ) : (
                              <img
                                src={`/api${item.media}` || 'https://placehold.co/200x200?text=No+Image'}
                                alt={item.judul || 'Gambar Testimoni'} // Fallback alt text
                                className="img-fluid rounded mb-3"
                                style={{
                                  maxHeight: '200px',
                                  objectFit: 'cover',
                                  width: '100%',
                                }}
                                onError={(e) => {
                                  console.error(`Gagal memuat gambar untuk testimoni`);
                                  e.target.src = 'https://placehold.co/200x200?text=No+Image';
                                }}
                              />
                            )}
                          </div>
                          {/* Asumsi testimoni juga punya judul seperti dokumentasi */}
                          {item.judul && <h5 className="fw-semibold text-secondary fs-16">{item.judul}</h5>}
                          {/* Jika testimoni tidak punya judul, tapi punya konten teks lain, bisa ditampilkan di sini */}
                          {item.deskripsi && <p className="text-muted">{item.deskripsi}</p>}
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </Carousel.Item>
              );
            })}
          </Carousel>
        )}

        {/* Modal Viewer */}
        <AnimatePresence>
          {isViewerOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="modal-backdrop-custom"
              onClick={closeViewer}
            >
              {mediaUrl && (
                isVideo ? (
                  <motion.video
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    src={mediaUrl}
                    controls
                    className="media-fullscreen"
                    onClick={(e) => e.stopPropagation()}
                    onError={() => alert('Gagal memuat video.')}
                  />
                ) : (
                  <motion.img
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    src={mediaUrl}
                    alt="Gambar Fullscreen"
                    className="media-fullscreen"
                    onClick={(e) => e.stopPropagation()}
                    onError={() => alert('Gagal memuat gambar.')}
                  />
                )
              )}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onClick={closeViewer}
                className="btn-close-custom"
              >
                <GoXCircleFill className="fs-3 text-white" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default Testimoni;