/* eslint-disable react-hooks/exhaustive-deps */
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

  const getItemsPerSlide = useCallback(() => {
    if (window.innerWidth < 768) {
      return 1;
    } else {
      return 3;
    }
  }, []);

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchDokumentasi = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/dokumentasi`);
        const data = await response.json();
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

  const isVideoFile = (filePath) => {
    return /\.(mp4|webm|ogg)$/i.test(filePath);
  };

  return (
    <div className="dokumentasi-page bg-white my-5 py-5" id="dokumentasi">
      <Container>
        <h2 className="text-center text-blue my-4 fw-bold">Dokumentasi</h2>

        {dokumentasi.length === 0 ? (
          <p className="text-center">Tidak ada dokumentasi yang tersedia.</p>
        ) : (
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            indicators={true}
            nextIcon={<span className="carousel-control-next-icon" aria-hidden="true"><FaChevronRight className='text-blue' size={26} /></span>}
            prevIcon={<span className="carousel-control-prev-icon" aria-hidden="true"><FaChevronLeft className='text-blue' size={26} /></span>}
            interval={4000}
          >
            {Array.from({ length: Math.ceil(dokumentasi.length / itemsPerSlide) }).map((_, slideIndex) => {
              const items = dokumentasi.slice(
                slideIndex * itemsPerSlide,
                slideIndex * itemsPerSlide + itemsPerSlide
              );
              return (
                <Carousel.Item key={slideIndex}>
                  <Row className="justify-content-center g-2">
                    {items.map((item) => {
                      const fileUrl = `${process.env.REACT_APP_API_URL}${item.gambar}`;
                      const isVideo = isVideoFile(item.gambar);
                      return (
                        <Col md={4} className="mb-4" key={item.id}>
                          <motion.div
                            whileHover={{ scale: 1.02, cursor: 'pointer' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="bg-light rounded text-center p-4 shadow-sm"
                            onClick={() =>
                              openViewer(item.gambar, isVideo ? 'video' : 'image')
                            }
                          >
                            <div className="position-relative">
                              {isVideo ? (
                                <>
                                  <video
                                    src={fileUrl}
                                    className="img-fluid media-rounded"
                                    style={{ height: '300px', width: '100%', objectFit: 'cover' }}
                                    muted
                                    playsInline
                                    onError={(e) => {
                                      console.error(`Gagal memuat video thumbnail untuk ${item.gambar}`);
                                      e.target.style.display = 'none';
                                      if (e.target.nextSibling) {
                                        e.target.nextSibling.style.display = 'block';
                                      }
                                    }}
                                  >
                                    Browser Anda tidak mendukung tag video.
                                  </video>
                                  <img
                                    src="https://placehold.co/300x300?text=Video+Thumbnail+Failed"
                                    alt={`Placeholder untuk ${item.judul || 'Video'}`}
                                    className="img-fluid media-rounded"
                                    style={{
                                      height: '300px',
                                      width: '100%',
                                      objectFit: 'cover',
                                      display: 'none',
                                    }}
                                  />
                                </>
                              ) : (
                                <img
                                  src={fileUrl}
                                  alt={item.judul || 'Gambar Dokumentasi'}
                                  className="img-fluid media-rounded"
                                  style={{
                                    height: '300px',
                                    objectFit: 'cover',
                                    width: '100%',
                                  }}
                                  onError={(e) => {
                                    console.error(`Gagal memuat gambar untuk dokumentasi`);
                                    e.target.src = 'https://placehold.co/200x200?text=No+Image';
                                  }}
                                />
                              )}
                            </div>
                            <p className="mt-2 fw-semibold">{item.judul}</p>
                          </motion.div>
                        </Col>
                      );
                    })}
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
                    autoPlay
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