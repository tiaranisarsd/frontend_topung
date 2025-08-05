import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';

const WhatsAppButton = () => {
  const [owner, setOwner] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState(null);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const response = await axios.get('/api/users');
        const ownerUser = response.data.find(user => user.role === 'owner');

        if (ownerUser) {
          setOwner(ownerUser);
          
          let number = ownerUser.no_telp;
          if (number) {
            // Hapus semua karakter non-digit kecuali tanda +
            number = number.replace(/[^0-9+]/g, ''); 
            
            // Jika diawali dengan '0', ganti dengan '62'
            if (number.startsWith('0')) {
              number = '62' + number.substring(1);
            } 
            // Jika tidak diawali dengan '62', tambahkan '62' di awal
            else if (!number.startsWith('62')) {
              number = '62' + number;
            }
          }
          setWhatsappNumber(number);
        }
      } catch (error) {
        console.error('Gagal mengambil data owner:', error);
      }
    };

    fetchOwner();
  }, []);

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