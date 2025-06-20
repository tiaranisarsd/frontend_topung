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

  useEffect(() => {
    const fetchTestimoni = async () => {
      try {
        const response = await fetch('http://localhost:5000/testimoni');
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
    setMediaUrl(url);
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

  // Fungsi untuk mendapatkan URL thumbnail video dari Cloudinary
  const getVideoThumbnailUrl = (videoUrl) => {
    if (!videoUrl) return 'https://via.placeholder.com/200x200?text=Video+Thumbnail';
    
    // Jika URL dari Cloudinary, tambahkan parameter transformasi untuk thumbnail
    if (videoUrl.includes('cloudinary.com')) {
      const urlParts = videoUrl.split('/upload/');
      if (urlParts.length === 2) {
        const thumbnailUrl = `${urlParts[0]}/upload/so_0,w_400,h_225,c_fill/${urlParts[1].split('.')[0]}.jpg`;
        return thumbnailUrl;
      }
    }
    // Fallback ke placeholder statis jika tidak bisa menghasilkan thumbnail
    return 'https://via.placeholder.com/200x200?text=Video+Thumbnail';
  };

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
            {Array.from({ length: Math.ceil(testimoni.length / 2) }).map((_, slideIndex) => {
              const items = testimoni.slice(slideIndex * 2, slideIndex * 2 + 2);
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
                                <img
                                  src={getVideoThumbnailUrl(item.media)}
                                  alt={`Thumbnail untuk Testimoni`}
                                  className="img-fluid rounded mb-3"
                                  style={{
                                    maxHeight: '200px',
                                    objectFit: 'cover',
                                    width: '100%',
                                  }}
                                  onError={(e) => {
                                    console.error(`Gagal memuat thumbnail untuk ${item.media}`);
                                    e.target.src = 'https://via.placeholder.com/200x200?text=Video+Thumbnail';
                                  }}
                                />
                                <div className="video-icon-overlay">
                                  <FaPlay className="text-white" size={24} />
                                </div>
                              </>
                            ) : (
                              <img
                                src={item.media || 'https://via.placeholder.com/200x200?text=No+Image'}
                                alt="Gambar Testimoni"
                                className="img-fluid rounded mb-3"
                                style={{
                                  maxHeight: '200px',
                                  objectFit: 'cover',
                                  width: '100%',
                                }}
                                onError={(e) => {
                                  console.error(`Gagal memuat gambar untuk testimoni`);
                                  e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                                }}
                              />
                            )}
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
