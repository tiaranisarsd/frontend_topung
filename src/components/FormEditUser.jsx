import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { FaSave, FaTimesCircle } from 'react-icons/fa';

const FormEditUser   = () => {
  const [nama, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("");
  const [gambar, setGambar] = useState(null);
  const [existingGambar, setExistingGambar] = useState("");
  const [cv_pdf, setCvPdf] = useState(null);
  const [existingCvPdf, setExistingCvPdf] = useState("");
  const [no_telp, setNoTelp] = useState("");
  const [harga, setHarga] = useState("");
  const [no_rekening, setNoRekening] = useState("");
  const [bank, setBank] = useState("");
  const [alamat, setAlamat] = useState("");
  const [msg, setMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { users } = useSelector((state) => state.auth);

  useEffect(() => {
    const getusersById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        setName(response.data.nama || "");
        setEmail(response.data.email || "");
        setRole(response.data.role || "");
        setNoTelp(response.data.no_telp || "");
        setHarga(response.data.harga || "");
        setBank(response.data.bank || "");
        setNoRekening(response.data.no_rekening || "");
        setAlamat(response.data.alamat || "");
        setExistingGambar(response.data.gambar || "");
        setExistingCvPdf(response.data.cv_pdf || "");

        // Log the existing image and CV URLs
        console.log("Existing Gambar URL:", `http://localhost:5000/uploads/users/${response.data.gambar}`);
        console.log("Existing CV PDF URL:", `http://localhost:5000/uploads/users/${response.data.cv_pdf}`);
      } catch (error) {
        setMsg(error.response?.data.msg || "Gagal memuat data pengguna.");
        setShowToast(true);
        setTimeout(() => {
          navigate("/users");
        }, 3000);
      }
    };
    getusersById();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (e.target.name === "gambar") {
      if (!file.type.startsWith('image/')) {
        setMsg("File untuk gambar harus berupa gambar (jpg, png, jpeg, webp).");
        setShowToast(true);
        return;
      }
      setGambar(file);
    } else if (e.target.name === "cv_pdf") {
      if (file.type !== 'application/pdf') {
        setMsg("File untuk CV harus berupa PDF.");
        setShowToast(true);
        return;
      }
      setCvPdf(file);
    }
  };

  const updateusers = async (e) => {
    e.preventDefault();

    if (!nama || !email || !role || !bank || !harga || !no_telp || !no_rekening) {
      setMsg("Semua bidang wajib harus diisi.");
      setShowToast(true);
      return;
    }

    if (password && password !== confPassword) {
      setMsg("Password dan Konfirmasi Password tidak cocok.");
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama", nama);
      formDataToSend.append("email", email);
      if (password) {
        formDataToSend.append("password", password);
        formDataToSend.append("confPassword", confPassword);
      }
      formDataToSend.append("role", role);
      formDataToSend.append("no_telp", no_telp);
      formDataToSend.append("harga", harga);
      formDataToSend.append("bank", bank);
      formDataToSend.append("no_rekening", no_rekening);
      formDataToSend.append("alamat", alamat);
      
      if (gambar) {
        formDataToSend.append("gambar", gambar);
      } else if (existingGambar) {
        formDataToSend.append("existingGambar", existingGambar);
      }

      if (cv_pdf) {
        formDataToSend.append("cv_pdf", cv_pdf);
      } else if (existingCvPdf) {
        formDataToSend.append("existingCvPdf", existingCvPdf);
      }

      await axios.patch(`http://localhost:5000/users/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg("User   berhasil diperbarui!");
      setShowToast(true);
      setTimeout(() => {
        navigate("/users");
      }, 2000);
    } catch (error) {
      setMsg(error.response?.data.msg || "Terjadi kesalahan saat memperbarui user.");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer
        position="bottom-end"
        className="p-3"
        style={{
          zIndex: 9999,
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
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
          <Toast.Body className="text-white">{msg}</Toast.Body>
        </Toast>
      </ToastContainer>

      <h2 className="mb-4 text-blue fw-bold">Edit Akun</h2>
      <div className="card border-none bg-blue2 m-lg-4 shadow">
        <div className="card-body text-blue fw-bold px-lg-5">
          <form onSubmit={updateusers}>
            <div className="mb-3">
              <label className="form-label">Upload Gambar Baru (jpg, png, jpeg, webp)</label>
              {existingGambar && !gambar && (
                <div className="mb-2">
                  <img 
                    src={`http://localhost:5000/uploads/users/${existingGambar}`} 
                    alt="Gambar Saat Ini" 
                    className="shadow-sm rounded"
                    style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }} 
                  />
                </div>
              )}
              {gambar && (
                <div className="">
                  <p>File baru terpilih: {gambar.name}</p>
                  <p className="text-danger">Gambar lama akan diganti dengan yang baru.</p>
                  <div className="mb-2">
                    <img 
                      src={URL.createObjectURL(gambar)} 
                      alt="Preview Gambar Baru" 
                      className="shadow-sm rounded"
                      style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }} 
                    />
                  </div>
                </div>
              )}
              <input
                type="file"
                className="form-control"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                name="gambar"
                onChange={handleFileChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Upload CV Baru (PDF)</label>
              {existingCvPdf && !cv_pdf && (
                <div className="mb-2">
                  <p>
                    CV Saat Ini: <a href={`http://localhost:5000/uploads/users/${existingCvPdf}`} target="_blank" rel="noopener noreferrer">Lihat CV</a>
                  </p>
                </div>
              )}
              {cv_pdf && (
                <div className="mt-2">
                  <p>File baru terpilih: {cv_pdf.name}</p>
                  <p className="text-danger">CV lama akan diganti dengan yang baru.</p>
                </div>
              )}
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                name="cv_pdf"
                onChange={handleFileChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nama</label>
              <input
                type="text"
                className="form-control"
                value={nama}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password Baru<span className="text-muted fw-normal" style={{ marginLeft: '5px' }}>(kosongkan jika tidak ingin mengubah)</span></label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password baru..."
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Konfirmasi Password Baru</label>
              <input
                type="password"
                className="form-control"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="Masukkan konfirmasi password baru..."
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="" disabled>Pilih Role</option>
                <option value="terapis">Terapis</option>
                {users && users.role === "owner" && (
                  <option value="owner">Owner</option>
                )}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">No. Telepon</label>
              <div className="d-flex align-items-center">
                <span className="me-2">+62</span>
                <input
                  type="text"
                  className="form-control"
                  value={no_telp}
                  onChange={(e) => setNoTelp(e.target.value)}
                  placeholder="Masukkan nomor telepon"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Harga</label>
              <div className="d-flex align-items-center">
                <span className="me-2">Rp. </span>
                <input
                  type="text"
                  className="form-control"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  placeholder="Masukkan harga (contoh: 100000)"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Bank</label>
              <select
                className="form-select"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
              >
                <option value="" disabled>Pilih Bank</option>
                <option value="BCA">BCA</option>
                <option value="Mandiri">Mandiri</option>
                <option value="BNI">BNI</option>
                <option value="BRI">BRI</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">No. Rekening</label>
              <input
                type="text"
                className="form-control"
                value={no_rekening}
                onChange={(e) => setNoRekening(e.target.value)}
                placeholder="Masukkan nomor rekening"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Alamat</label>
              <textarea
                className="form-control"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Masukkan alamat"
                rows={3}
              />
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/users")}
              >
                <FaTimesCircle className="me-1" /> Batal
              </button>
              <button
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
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormEditUser ;
