import React, { useState, useEffect } from 'react';
import LoadingIndicator from '../components/LoadingIndicator';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TerapisKamiPage from '../components/TerapisPage';
import WhatsAppButton from '../components/WhatsAppButton';

const Terapis = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);


  return (
    <React.Fragment>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <LoadingIndicator
            animation="border"
            role="status"
            style={{ width: '5rem', height: '5rem', color: '#007bff' }} //Directly set color.
          >
            <span className="visually-hidden">Loading...</span>
          </LoadingIndicator>
        </div>
      ) : (
        <>
        <Header />
        <TerapisKamiPage />
        <WhatsAppButton />
        <Footer />
        </>
      )}
    </React.Fragment>
  );
};

export default Terapis;