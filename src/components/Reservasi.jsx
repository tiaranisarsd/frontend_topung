import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Alert, Toast, ToastContainer, Modal, Dropdown, Row, Col } from 'react-bootstrap';
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaFilePdf } from 'react-icons/fa';
import LoadingIndicator from './LoadingIndicator'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useSelector } from 'react-redux';

const Reservasi = () => {
  const [reservasi, setReservasi] = useState([]);
  const [filteredReservasi, setFilteredReservasi] = useState([]);
  const [terapisNames, setTerapisNames] = useState([]); 
  const { users } = useSelector((state) => state.auth); 
  const [selectedTerapis, setSelectedTerapis] = useState(''); // State for selected therapist filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastBg, setToastBg] = useState('Selesai'); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservasiToDelete, setReservasiToDelete] = useState(null); 
  const [showImage, setShowImage] = useState(false); 
  const [imageUrl, setImageUrl] = useState('');
  const [isDeleting, setIsDeleting] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); 
      try {
        const reservasiResponse = await axios.get('http://localhost:5000/reservasi');
        setReservasi(reservasiResponse.data);
        setFilteredReservasi(reservasiResponse.data || []);

        // Extract unique therapist names from reservasi data
        const uniqueTerapisNames = [...new Set(
          reservasiResponse.data
            .map(item => item.users?.nama)
            .filter(name => name) // Remove undefined or null names
        )];
        setTerapisNames(uniqueTerapisNames);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Update filtered reservations when selectedTerapis changes
  useEffect(() => {
    if (selectedTerapis) {
      const filtered = reservasi.filter(item => item.users?.nama === selectedTerapis);
      setFilteredReservasi(filtered);
    } else {
      setFilteredReservasi(reservasi); // Show all if no therapist is selected
    }
  }, [selectedTerapis, reservasi]);

  const handleDeleteClick = (reservasiId) => { 
    setReservasiToDelete(reservasiId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true); 
    try {
      await axios.delete(`http://localhost:5000/reservasi/${reservasiToDelete}`);
      setShowDeleteModal(false);
      setToastMessage('Reservasi berhasil dihapus!');
      setToastBg('success');
      setShowToast(true);

      setTimeout(() => {
        const fetchData = async () => {
          try {
            const reservasiResponse = await axios.get('http://localhost:5000/reservasi');
            setReservasi(reservasiResponse.data);
            // Reapply filter after refresh
            if (selectedTerapis) {
              const filtered = reservasiResponse.data.filter(item => item.users?.nama === selectedTerapis);
              setFilteredReservasi(filtered);
            } else {
              setFilteredReservasi(reservasiResponse.data);
            }
            // Update unique therapist names
            const uniqueTerapisNames = [...new Set(
              reservasiResponse.data
                .map(item => item.users?.nama)
                .filter(name => name)
            )];
            setTerapisNames(uniqueTerapisNames);
          } catch (err) {
            console.error('Error fetching reservasi:', err);
            setError(err.message || "Terjadi kesalahan saat memuat data.");
          }
        };
        fetchData();
      }, 2000);
    } catch (err) {
      console.error('Error deleting Reservasi:', err);
      const errorMessage = err.response?.data?.msg || err.message || "Terjadi kesalahan saat menghapus data.";
      
      setError(errorMessage);
      setToastMessage(errorMessage);
      setToastBg('danger');
      setShowToast(true);
    } finally {
      setIsDeleting(false); 
    }
  };

const handleStatusChange = async (id, currentStatus, index, jadwalId) => {

  if (currentStatus === 'Selesai') {
    setToastMessage('Status sudah selesai dan tidak dapat diubah.');
    setToastBg('danger');
    setShowToast(true);
    return; 
  }

  if (currentStatus === 'Dibatalkan') {
    setToastMessage('Status sudah dibatalkan dan tidak dapat diubah.');
    setToastBg('danger');
    setShowToast(true);
    return; 
  }

  const nextStatus = currentStatus === 'Menunggu' ? 'Disetujui' : currentStatus === 'Disetujui' ? 'Selesai' : 'Dibatalkan';
  try {
    const updatedReservasi = [...filteredReservasi];

    // Update status
    updatedReservasi[index].status = nextStatus;

    if (nextStatus === 'Disetujui') {
      if (jadwalId && jadwalId !== '0') {
        updatedReservasi[index].tanggal_waktu = 'berhasil diDisetujui untuk tanggal ini';
      } else {
        updatedReservasi[index].status = 'Dibatalkan';
        updatedReservasi[index].tanggal_waktu = 'reservasi diDibatalkankan karena jadwal tidak tersedia';
        
        // Kirim pesan ke pelanggan melalui WhatsApp
        const reservasi = updatedReservasi[index];
        const pelangganNoTelp = reservasi.no_telp;
        const pesanDefault = "Mohon maaf, reservasi Anda telah diDibatalkankan karena jadwal yang Anda pilih sudah diDisetujui untuk pelanggan lain terlebih dahulu. Kami mohon maaf atas ketidaknyamanan ini. Silakan hubungi kami untuk memilih jadwal lain. Terima kasih.";
        const url = `https://wa.me/${pelangganNoTelp}?text=${encodeURIComponent(pesanDefault)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }

    setFilteredReservasi(updatedReservasi);

    await axios.patch(`http://localhost:5000/reservasi/status`, { id, status: nextStatus });

    setToastMessage('Status berhasil diperbarui!');
    setToastBg('success');
    setShowToast(true);
  } catch (err) {
    console.error('Error updating status:', err);
    const errorMessage = err.response?.data?.msg || err.message || "Terjadi kesalahan saat mengubah status.";
    setError(errorMessage);
    setToastMessage(errorMessage);
    setToastBg('danger');
    setShowToast(true);
  }
};





  const handleImageClick = (imageUrl) => {
    setImageUrl(imageUrl);
    setShowImage(true);
  };

  const handlePrintPdf = () => {
    const doc = new jsPDF('l', 'mm', [297, 210]);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Daftar Reservasi', 150, 20, { align: 'center' });

    const tableColumn = [
      'No', 'Layanan', 'Nama Terapis', 'Tanggal & Waktu', 'Nama', 'Usia', 'No Telp', 'Alamat', 'Keluhan', 'Pembayaran', 'Bukti Pembayaran', 'Status'
    ];

    const columnWidths = [10, 20, 25, 30, 25, 15, 30, 20, 20, 20, 30, 20];

    const tableRows = filteredReservasi.map((item, index) => [ 
      index + 1,
      item.layanan,
      item.users?.nama || "Terapis Tidak Ditemukan",
      item.tanggal_waktu,
      item.nama,
      item.usia,
      item.no_telp,
      item.alamat,
      item.keluhan,
      item.pembayaran,
      item.bukti_pembayaran ? 'Lihat Gambar' : "No Image", 
      item.status
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: columnWidths[0] },
        1: { cellWidth: columnWidths[1] },
        2: { cellWidth: columnWidths[2] },
        3: { cellWidth: columnWidths[3] },
        4: { cellWidth: columnWidths[4] },
        5: { cellWidth: columnWidths[5] },
        6: { cellWidth: columnWidths[6] },
        7: { cellWidth: columnWidths[7] },
        8: { cellWidth: columnWidths[8] },
        9: { cellWidth: columnWidths[9] },
        10: { cellWidth: columnWidths[10], fontStyle: 'italic', textColor: [0, 0, 255] }, 
        11: { cellWidth: columnWidths[11] }
      },
      headStyles: {
        fillColor: [41, 128, 185],
        fontSize: 10,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        fontSize: 10,
        halign: 'center',
        lineHeight: 1.2
      },
    });

    doc.save('daftar_reservasi.pdf');
  };

  return (
    <Container className="p-3">
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999, position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={2000} 
          autohide 
          bg={toastBg}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Notifikasi</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal className='text-blue' show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header className='bg-light2' closeButton>
          <Modal.Title className='fw-bold h3'>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus Reservasi ini?
        </Modal.Body>
        <Modal.Footer className='border-0 mt-0'>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}> 
            Batal
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}> 
            {isDeleting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {' '}Loading...
              </>
            ) : (
              'Hapus'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {showImage && (
        <Modal show={showImage} onHide={() => setShowImage(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-blue">Bukti Pembayaran</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <img src={imageUrl} alt="Bukti Pembayaran" className="img-fluid" />
          </Modal.Body>
        </Modal>
      )}

      <h2 className="mt-5 text-blue fw-bold">Daftar Reservasi</h2>
      <Row className="mb-1 align-items-center">
        <Col xs="auto" className="mt-2">
          <Link style={{ border: 'none' }} to="/reservasi/add" className="btn btn-primary btn-hover text-white">
            <FaPlus /> Tambah Reservasi
          </Link>
          <Button className='ms-1 mt-lg-0 mt-1' variant="success" onClick={handlePrintPdf}>
            <FaFilePdf /> Print PDF
          </Button>
        </Col>
      </Row>
      {users && users.role === "owner" &&(
        <Row className="mb-3">
          <Col xs="auto" className="mt-1">
            <Dropdown onSelect={(e) => setSelectedTerapis(e)}>
              <Dropdown.Toggle variant="secondary">
                Filter Terapis
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="">Semua Terapis</Dropdown.Item>
                {terapisNames.map((terapisName, index) => (
                  <Dropdown.Item eventKey={terapisName} key={index}>{terapisName}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      )}
    <div className="mt-3">
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <LoadingIndicator animation="border" role="status" style={{ width: "5rem", height: "5rem" }}>
            <span className="visually-hidden">Loading...</span>
          </LoadingIndicator>
        </div>
      ) : filteredReservasi.length === 0 ? (
        <Alert variant="info" className="text-center">Tidak ada data reservasi.</Alert>
      ) : (
        Array.isArray(filteredReservasi) && filteredReservasi.length > 0 ? (
          <Table border={1} bordered responsive className='text-center custom-table'>
            <thead className='custom-table'>
              <tr>
                <th>No</th>
                <th>Layanan</th>
                <th>Nama Terapis</th>
                <th>Tanggal & Waktu</th>
                <th>Nama</th>
                <th>Usia</th>
                <th>No Telp</th>
                <th>Alamat</th>
                <th>Keluhan</th>
                <th>Pembayaran</th>
                <th>Bukti Pembayaran</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservasi.map((item, index) => ( 
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.layanan}</td>
                  <td>{item.users?.nama || "Terapis Tidak Ditemukan"}</td>
                  <td>{item.tanggal_waktu}</td>
                  <td>{item.nama}</td>
                  <td>{item.usia}</td>
                  <td>{item.no_telp}</td>
                  <td>{item.alamat}</td>
                  <td>{item.keluhan}</td>
                  <td>{item.pembayaran}</td>
                  <td>
                    {item.bukti_pembayaran ? (
                      <Button variant="link" onClick={() => handleImageClick(item.bukti_pembayaran)}>
                        Lihat Gambar
                      </Button>
                    ) : "No Image"}
                  </td>
                  <td>
                    <Dropdown align="end" className="ms-2">
                      <Dropdown.Toggle variant="link" className="p-0 text-dark" id="dropdown-basic">
                        <span
                          className={`badge ${item.status === "Menunggu" ? "bg-warning" : 
                            item.status === "Disetujui" ? "bg-info" : 
                            item.status === "Dibatalkan" ? "bg-danger" : 
                            "bg-success"}`}
                        >
                          {item.status}
                        </span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleStatusChange(item.id, item.status, index, item.jadwalId)}>
                          {item.status === "Menunggu" ? "Proses" : item.status === "Disetujui" ? "Selesai" : "Pending"}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>

                  <td>
                    <Link
                      to={`/reservasi/edit/${item.id}`}
                      className="btn btn-sm btn-info me-2 text-white"
                    >
                      <FaEdit />
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(item.id)}
                      className='me-2 mt-1 mb-lg-1'
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info" className="text-center">Tidak ada data reservasi.</Alert>
        )
      )}
    </div>

    </Container>
  );
};

export default Reservasi;
