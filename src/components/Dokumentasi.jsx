import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { GoXCircleFill } from "react-icons/go";

const Dokumentasi = () => {
  const [dokumentasi, setDokumentasi] = useState([]);
  const [index, setIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');

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
  }, [getItemsPerSlide]);

  useEffect(() => {
    const fetchDokumentasi = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/dokumentasi`);
        const result = await response.json();

        setDokumentasi(Array.isArray(result.data) ? result.data : result);

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

  const openViewer = useCallback((url) => {
    const fullUrl = `${process.env.REACT_APP_API_URL}${url}`;
    setMediaUrl(fullUrl);
    setIsViewerOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeViewer = useCallback(() => {
    setIsViewerOpen(false);
    setMediaUrl('');
    document.body.style.overflow = 'unset';
  }, []);

  return (
    <div className="dokumentasi-page bg-light my-5 py-5" id="dokumentasi">
      <Container>
        <h2 className="text-center text-blue my-4 fw-bold">Dokumentasi</h2>

        {dokumentasi.length === 0 ? (
          <p className="text-center">Tidak ada dokumentasi yang tersedia.</p>
        ) : (
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            indicators={true}
            nextIcon={<span className="rounded-circle bg-white p-2 shadow-sm"><FaChevronRight className='text-blue fs-4' /></span>}
            prevIcon={<span className="rounded-circle bg-white p-2 shadow-sm"><FaChevronLeft className='text-blue fs-4' /></span>}
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
                    {items.map((item) => (
                      <Col md={4} className="mt-2 mb-4" key={item.id}
                        onClick={() => openViewer(item.gambar)}
                        style={{ cursor: 'pointer', padding: '10px' }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <div className="position-relative" style={{ maxHeight: '250px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                              src={`${process.env.REACT_APP_API_URL}${item.gambar}` || 'https://placehold.co/200x200?text=No+Image'}
                              alt={item.judul || 'Gambar Dokumentasi'}
                              className="img-fluid rounded"
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
                          </div>
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
