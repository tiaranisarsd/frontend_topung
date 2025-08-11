import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Toast, ToastContainer, Form, Button } from "react-bootstrap";
import { FaSave, FaTimesCircle } from 'react-icons/fa';

const FormAddJadwalTerapis = () => {
  const [hari, setHari] = useState("");
  const [jam, setJam] = useState("");
  const [usersId, setUsersId] = useState("");
  const [user, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams(); 
  const { users } = useSelector(state => state.auth);

  useEffect(() => {
    getUsers();
    if (userId) {
      setUsersId(userId); 
    }
  }, [userId]);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://145.79.8.133:5000/users");
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMsg("Gagal memuat data terapis.");
      setShowToast(true);
    }
  };

  const saveJadwal = async (e) => {
    e.preventDefault();
    if (!hari || !jam) {
      setMsg("Semua bidang harus diisi.");
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("http://145.79.8.133:5000/jadwalTerapis", {
        userId: Number(usersId),
        hari: hari,
        jam: jam
      });
      setMsg("Jadwal berhasil ditambahkan!");
      setShowToast(true);

      setTimeout(() => {
        navigate("/jadwalTerapis");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
        setShowToast(true);
      } else {
        setMsg("Terjadi kesalahan saat menambahkan jadwal.");
        setShowToast(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsersList = users && users.role === 'owner'
    ? user 
    : user.filter(user => user.id === users?.id); 

  useEffect(() => {
    if (users && users.role !== 'owner' && filteredUsersList.length > 0) {
      setUsersId(users.id.toString());
    }
  }, [users, filteredUsersList]);

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

  return (
    <div className="container mt-5">
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999, position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={4000}
          autohide
          bg={msg.includes("berhasil") ? "success" : "danger"}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Notifikasi</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {msg}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <h2 className="mb-4 text-blue fw-bold">Tambah Jadwal Terapis</h2>
      <div className="card border-none bg-blue2 m-lg-4 shadow">
        <div className="card-body text-blue fw-bold px-lg-5">
          <form onSubmit={saveJadwal}>
            <div className="mb-3">
              <label className="form-label">Pilih Terapis</label>
              <select
                className="form-select"
                value={usersId}
                onChange={(e) => setUsersId(e.target.value)}
                disabled={usersId} 
              >
                <option value={user.id} disabled>Pilih Terapis</option>
                {filteredUsersList.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Hari</label>
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
                    style={{ minWidth: '100px' }} // Memberikan lebar minimum agar rapi
                  />
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Jam</label>
              <input
                type="text"
                className="form-control"
                value={jam}
                onChange={(e) => setJam(e.target.value)}
                placeholder="Masukkan jam (contoh: 09.00 - 12.00)"
              />
            </div>

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
                className="btn btn-primary ms-2"
              >
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    <FaSave className="me-1" />
                    <span>Simpan</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormAddJadwalTerapis;
