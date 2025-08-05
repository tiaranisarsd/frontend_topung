/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { FaSave, FaTimesCircle } from 'react-icons/fa';

const FormEditJadwalTerapis = () => {
  const [hari, setHari] = useState("");
  const [jam, setJam] = useState("");
  const [usersId, setUsersId] = useState("");
  const [user, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setSelectedTerapis] = useState(null);
  const navigate = useNavigate();
  const { userId, id } = useParams(); 
  const { users } = useSelector(state => state.auth);

useEffect(() => {
  const getJadwalByUserAndId = async () => {
    try {
      const response = await axios.get(`/api/jadwalTerapis/users/${userId}/${id}`);
      setHari(response.data.hari);
      setJam(response.data.jam);
      setUsersId(response.data.userId);
      const terapis = user.find(u => u.id === response.data.userId);
      setSelectedTerapis(terapis || null);
    } catch (error) {
      console.error("Error fetching jadwal:", error);
      if (error.response) {
        setMsg(error.response.data.msg || "Gagal memuat data jadwal.");
        setShowToast(true);
      } else {
        setMsg("Terjadi kesalahan saat memuat data.");
        setShowToast(true);
      }
    }
  };

  if (userId && id) {
    getJadwalByUserAndId();
  } else {
    setMsg("Parameter userId atau id tidak ditemukan.");
    setShowToast(true);
  }
}, [userId, id, user]);


  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMsg("Gagal memuat data terapis.");
      setShowToast(true);
    }
  };

const updateJadwal = async (e) => {
  e.preventDefault();
  if (!hari || !jam) {
    setMsg("Semua bidang harus diisi.");
    setShowToast(true);
    return;
  }

  if (!usersId) {
    setMsg("Terapis belum dipilih.");
    setShowToast(true);
    return;
  }

  setIsLoading(true);

  try {
    await axios.patch(`/api/jadwalTerapis/users/${userId}/${id}`, {
      hari: hari,
      jam: jam
    });
    setMsg("Jadwal berhasil diperbarui!");
    setShowToast(true);

    setTimeout(() => {
      navigate("/jadwalTerapis");
    }, 2000);
  } catch (error) {
    if (error.response) {
      setMsg(error.response.data.msg || "Gagal memperbarui jadwal.");
      setShowToast(true);
    } else {
      setMsg("Terjadi kesalahan saat memperbarui jadwal.");
      setShowToast(true);
    }
  } finally {
    setIsLoading(false);
  }
};

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];


const filteredUsers = users && users.role === "owner"
  ? user
  : user.filter(u => u.id === users?.id);

  return (
    <div className="container mt-5">
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999, position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={4000}
          autohide
          bg={msg && typeof msg === 'string' && msg.includes("berhasil") ? "success" : "danger"}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Notifikasi</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {msg}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <h2 className="mb-4 text-blue fw-bold">Edit Jadwal Terapis</h2>
      <Card className="border-none bg-blue2 m-lg-4 shadow">
        <Card.Body className="text-blue fw-bold px-lg-5">
          <Form onSubmit={updateJadwal}>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Terapis</Form.Label>
              <Form.Select
                value={userId}
                onChange={(e) => setUsersId(e.target.value)}
                disabled={userId}
              >
                <option value="" disabled>Pilih Terapis</option>
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nama}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Hari</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {days.map((day) => (
                  <Form.Check
                    key={day}
                    type="radio"
                    id={`day-${day}`}
                    label={day}
                    value={day}
                    checked={hari === day}
                    onChange={(e) => setHari(e.target.value)}
                    className="me-3"
                    style={{ minWidth: '100px' }} 
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Jam</Form.Label>
              <Form.Control
                type="text"
                value={jam}
                onChange={(e) => setJam(e.target.value)}
                placeholder="Masukkan jam (contoh: 09.00 - 12.00)"
              />
            </Form.Group>

             <div className="d-flex justify-content-end">
              <Button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/jadwalTerapis")}
              >
                <FaTimesCircle className="me-1" /> Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-success ms-2"
                  >
                    {isLoading ? (
                  <>
                    <Spinner 
                      animation="border" 
                      size="sm" 
                      className="me-1 align-middle" 
                      style={{ width: '16px', height: '16px' }} 
                    />
                      <span>Loading...</span>
                    </>
                    ) : (
                    <>
                   <FaSave className="me-1" />
                   <span>Perbarui</span>
                   </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FormEditJadwalTerapis;
