import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from 'framer-motion';
import LoadingIndicator from './LoadingIndicator';

const videoCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

function Edukasi() {
  const [loading, setLoading] = useState(true);
  const [edukasi, setEdukasi] = useState([]);
  const [index, setIndex] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const getEdukasi = async () => {
      try {
        const response = await axios.get('/api/edukasi');
        setEdukasi(response.data);
      } catch (error) {
        console.error('Error fetching edukasi:', error);
      } finally {
        setLoading(false);
      }
    };
    getEdukasi();
  }, []);

  useEffect(() => {
    if (edukasi.length > 0) {
      setHasAnimated(false); 
    }
  }, [edukasi]);

     const convertToEmbedUrl = (url) => {
       const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
       const youtubeMatch = url.match(youtubeRegex);
       if (youtubeMatch) {
         return `https://www.youtube.com/embed/${youtubeMatch[1]}?modestbranding=1&rel=0`;
       }

    const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?(?:tiktok\.com\/(?:@[^/]+\/video\/|v\/))(\d+)/;
    const tiktokMatch = url.match(tiktokRegex);
    if (tiktokMatch) {
      return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
    }

    return url; 
  };

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const getItemsPerSlide = () => {
    return window.innerWidth < 768 ? 1 : 2;
  };

  const slideVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } }
  };

  return (
    <div className="edukasi-page bg-white my-5 pt-3 pb-5" id='edukasi'>
      <Container>
        <h2 className="text-center text-blue my-4 fw-bold">Edukasi</h2>

        {loading ? (
          <div className="d-flex justify-content-center text-blue my-5">
            <LoadingIndicator animation="border" role="status" style={{ width: "5rem", height: "5rem" }}>
              <span className="visually-hidden">Loading...</span>
            </LoadingIndicator>
          </div>
        ) : (
          edukasi.length > 0 ? (
            <Carousel
              activeIndex={index}
              onSelect={handleSelect}
              interval={3000}
              indicators={true} 
              nextIcon={<FaChevronRight className='text-blue ms-4' size={28} />}
              prevIcon={<FaChevronLeft className='text-blue me-4' size={28} />}
            >
              {Array.from({ length: Math.ceil(edukasi.length / getItemsPerSlide()) }).map((_, slideIndex) => {
                const items = edukasi.slice(
                  slideIndex * getItemsPerSlide(),
                  slideIndex * getItemsPerSlide() + getItemsPerSlide()
                );
                return (
                  <Carousel.Item key={slideIndex}>
                    <motion.div
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Row className="justify-content-center">
                        {items.map((item) => (
                          <Col md={getItemsPerSlide() === 1 ? 10 : 5} key={item.id} className="video-card mx-1">
                            <motion.div
                              key={`motion-${item.id}-${hasAnimated}`}
                              variants={videoCardVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              onAnimationComplete={() => setHasAnimated(true)}
                              className="video-content object-fit-cover"
                            >
                              {item.konten && (item.konten.match(/youtube\.com|youtu\.be/i) || item.konten.match(/tiktok\.com/i)) ? (
                                <iframe
                                  className='rounded-3 w-100'
                                  height="250"
                                  src={convertToEmbedUrl(item.konten)}
                                  title="Edukasi Content"
                                  frameBorder="0"
                                  allowFullScreen
                                ></iframe>
                              ) : (
                                <p className="text-center p-3 bg-light shadow rounded">{item.konten}</p>
                              )}
                            </motion.div>
                          </Col>
                        ))}
                      </Row>
                    </motion.div>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          ) : (
            <div className="text-center">Tidak ada konten edukasi yang tersedia.</div>
          )
        )}
      </Container>
    </div>
  );
}

export default Edukasi;
