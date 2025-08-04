import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { GoXCircleFill } from "react-icons/go";

const Dokumentasi = () => {
  const [dokumentasi, setDokumentasi] = useState([]);
  const [index, setIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    const fetchDokumentasi = async () => {
      try {
        const response = await fetch('${process.env.REACT_APP_API_URL}/dokumentasi');
        const data = await response.json();
        console.log("Data dokumentasi dari API:", data);
        setDokumentasi(data);
      } catch (error) {
        console.error('Gagal memuat dokumentasi:', error);
      }
    };

    fetchDokumentasi();
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

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

  const openViewer = useCallback((url, isVid = false) => {
    const fullUrl = `${process.env.REACT_APP_API_URL}${url}`;
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
    <div className="dokumentasi-page bg-white my-4 py-5" id="dokumentasi">
      <Container>
        <h2 className="text-center text-blue my-4 fw-bold">Dokumentasi</h2>

        {dokumentasi.length === 0 ? (
          <p className="text-center">Tidak ada dokumentasi yang tersedia.</p>
        ) : (
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            indicators={true}
            nextIcon={<FaChevronRight className='text-blue' size={26} />}
            prevIcon={<FaChevronLeft className='text-blue' size={26} />}
            interval={4000}
          >
            {Array.from({ length: Math.ceil(dokumentasi.length / itemsPerSlide) }).map((_, slideIndex) => {
              const items = dokumentasi.slice(
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
                            openViewer(item.gambar, item.gambar.endsWith('.mp4') || item.gambar.endsWith('.webm') || item.gambar.endsWith('.mov'))
                          }
                        >
                          <div className="position-relative">
                            {item.gambar && (item.gambar.endsWith('.mp4') || item.gambar.endsWith('.webm') || item.gambar.endsWith('.mov')) ? (
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
                                    console.error(`Gagal memuat video thumbnail untuk ${item.gambar}`);
                                    e.target.style.display = 'none'; 
                                    e.target.nextSibling.style.display = 'block'; 
                                  }}
                                >
                                  <source src={`${process.env.REACT_APP_API_URL}${item.gambar}`} type="video/mp4" />
                                  Browser Anda tidak mendukung tag video.
                                </video>
                                <img
                                  src="https://placehold.co/200x200?text=Video+Thumbnail"
                                  alt={`Placeholder untuk ${item.judul}`}
                                  className="img-fluid rounded mb-3"
                                  style={{
                                    maxHeight: '200px',
                                    objectFit: 'cover',
                                    width: '100%',
                                    display: 'none', // Hidden by default, shown only if video fails
                                  }}
                                  onError={(e) => {
                                    console.error(`Gagal memuat placeholder untuk ${item.judul}`);
                                  }}
                                />
                                <div className="video-icon-overlay" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                  <FaPlay className="text-white" size={24} />
                                </div>
                              </>
                            ) : (
                              <img
                                src={`${process.env.REACT_APP_API_URL}${item.gambar}` || 'https://placehold.co/200x200?text=No+Image'}
                                alt={item.judul}
                                className="img-fluid rounded mb-3"
                                style={{
                                  maxHeight: '200px',
                                  objectFit: 'cover',
                                  width: '100%',
                                }}
                                onError={(e) => {
                                  console.error(`Gagal memuat gambar untuk ${item.judul}`);
                                  e.target.src = 'https://placehold.co/200x200?text=No+Image';
                                }}
                              />
                            )}
                          </div>
                          <h5 className="fw-semibold text-secondary fs-16">{item.judul}</h5>
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

export default Dokumentasi;
