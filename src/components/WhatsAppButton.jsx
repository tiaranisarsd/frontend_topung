import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';

const WhatsAppButton = () => {
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const response = await axios.get('http://145.79.8.133:5000/users');
        const ownerUser = response.data.find(user => user.role === 'owner');

        if (ownerUser) {
          setOwner(ownerUser);
        }
      } catch (error) {
        console.error('Gagal mengambil data owner:', error);
      }
    };

    fetchOwner();
  }, []);

  const whatsappNumber = owner?.no_telp?.replace(/^0/, '62');

  const handleClick = () => {
    if (!whatsappNumber) return;

    const message = encodeURIComponent("Hello, Saya ingin bertanya mengenai layanan Totok Punggung");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  if (!whatsappNumber) return null; 

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
      className="card-hover"
      onClick={handleClick}
    >
      <FaWhatsapp size={30} color="white" />
    </div>
  );
};

export default WhatsAppButton;
