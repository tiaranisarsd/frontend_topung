import React, { useState, useEffect } from "react";
import { Accordion, Card } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from 'axios';

const Pertanyaan = () => {
  const [pertanyaan, setPertanyaan] = useState([]);
  const [activeKey, setActiveKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPertanyaan = async () => {
      try {
        const response = await axios.get('/api/Pertanyaan');
        setPertanyaan(response.data);
      } catch (error) {
        console.error('Gagal memuat data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPertanyaan();
  }, []);

  const toggleAccordion = (key) => {
    setActiveKey(activeKey === key ? null : key);
  };

  return (
    <div className="my-5 w-75 mx-auto " id="pertanyaan">
      <h6 className="fw-bold text-blue ms-3 pb-2">Pertanyaan Umum</h6>

      {loading ? (
        <div className="text-center text-muted">Memuat pertanyaan...</div>
      ) : pertanyaan.length === 0 ? (
        <div className="text-center">Tidak ada pertanyaan.</div>
      ) : (
        <Accordion activeKey={activeKey}>
          {pertanyaan.map((item, index) => (
            <Card key={index} className="border-0 text-blue border-bottom">
              <Card.Header
                className="bg-white d-flex justify-content-between align-items-center"
                onClick={() => toggleAccordion(index.toString())}
                style={{ cursor: "pointer" }}
              >
                <span className="text-blue">{item.judul_pertanyaan}</span>
                {activeKey === index.toString() ? (
                  <FaChevronUp className="text-blue" />
                ) : (
                  <FaChevronDown className="text-blue" />
                )}
              </Card.Header>
              <Accordion.Collapse eventKey={index.toString()}>
                <Card.Body className="text-secondary">
                  {item.isi_pertanyaan}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default Pertanyaan;
