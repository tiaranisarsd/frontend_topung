import React, { useState, useEffect } from 'react';
import LoadingIndicator from '../components/LoadingIndicator';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TentangKami from '../components/TentangKami';
import VisiMisi from '../components/VisiMisi';
import Lokasi from '../components/Lokasi';
import StrukturOrganisasi from '../components/StrukturOrganisasi';
import WhatsAppButton from '../components/WhatsAppButton';

const TentangKamiPage = () => {
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
            style={{ width: '5rem', height: '5rem', color: '#007bff' }}
          >
            <span className="visually-hidden">Loading...</span>
          </LoadingIndicator>
        </div>
      ) : (
        <>
        <Header />
        <TentangKami />
        <VisiMisi />
        <Lokasi />
        <StrukturOrganisasi />
        <WhatsAppButton />
        <Footer />
        </>
      )}
    </React.Fragment>
  );
};

export default TentangKamiPage;