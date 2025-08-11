import React from 'react';
import { Button } from 'react-bootstrap';
import terapisImage from '../terapis.png'; 

const TerapisKami = ({ imageUrl, title, description, buttonText }) => {
  return (
    <div
      className="position-relative w-100 mx-auto my-5 rounded overflow-hidden bg-light2"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '500px',
      }}
    >
      <div
        className="position-absolute bottom-0 w-100"
        style={{
          height: '25%',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(3px)',
        }}
      />

      <div
        className="position-absolute bottom-0 w-100 fs-16 text-start p-3"
        style={{ zIndex: 2 }}
      >
        <div className="d-flex justify-content-between align-items-center flex-column flex-md-row gap-3">
          <div>
            <h2 className="text-blue fw-bold fs-3">{title}</h2>
            <p className="text-blue pb-0 mb-0">{description}</p>
          </div>
          <Button
            variant="secondary"
            className="fw-bold bgblue-opacity50 bgblue-hover rounded-pill px-3 py-2 m-3"
            href='/terapis'
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

const TerapisKamiSection = () => {
  return (
    <div className="w-100 bg-light2 py-4 px-3"> 
      <TerapisKami
        imageUrl={terapisImage}
        title="Terapis Kami"
        description="Temukan terapis Anda berdasarkan alamat terdekat agar lebih nyaman dan praktis."
        buttonText="Lihat Terapis"
      />
    </div>
  );
};

export default TerapisKamiSection;
