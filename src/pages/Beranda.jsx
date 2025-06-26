import React, { useState, useEffect } from 'react';
import LoadingIndicator from '../components/LoadingIndicator';
import Hero from '../components/Hero';
import Header from '../components/Header';
import Edukasi from '../components/Edukasi';
import Pelayanan from '../components/Pelayanan';
import JadwalKegiatan from '../components/JadwalKegiatan';
import TerapisKami from '../components/Terapis';
import Dokumentasi from '../components/Dokumentasi';
import Tahapan from '../components/Tahapan';
import Testimoni from '../components/Testimoni';
import Tinjauan from '../components/Tinjauan';
import Pertanyaan from '../components/Pertanyaan';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import CheckReservasiStatus from '../components/CheckStatusReservasi';

const Beranda = () => {
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
        <Hero />
        <CheckReservasiStatus />
        <Edukasi />
        <Pelayanan />
        <JadwalKegiatan />
        <TerapisKami />
        <Dokumentasi />
        <Tahapan />
        <Testimoni />
        <Tinjauan />
        <Pertanyaan />
        <WhatsAppButton />
        <Footer />
        </>
      )}
    </React.Fragment>
  );
};

export default Beranda;