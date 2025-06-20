import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const whatsappNumber = "6287872721210"; 

  const handleClick = () => {
    const message = encodeURIComponent("Hello, Saya ingin bertanya mengenai layanan Totok Punggung");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        right: "20px",
        backgroundColor: "#25D366", 
        borderRadius: "50%",
        padding: "15px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        zIndex: 9999, 
      }}
      className='card-hover'
      onClick={handleClick}
    >
      <FaWhatsapp size={30} color="white" />
    </div>
  );
};

export default WhatsAppButton;
