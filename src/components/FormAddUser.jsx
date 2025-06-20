import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSave, FaTimesCircle } from 'react-icons/fa';
import { Toast, ToastContainer, Spinner } from "react-bootstrap";

const FormAddUser = () => {
  const [nama, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("");
  const [gambar, setGambar] = useState(null);  
  const [cv_pdf, setCvPdf] = useState(null);
  const [no_telp, setNoTelp] = useState(""); 
  const [harga, setHarga] = useState(""); 
  const [bank, setBank] = useState("");
  const [no_rekening, setNoRekening] = useState(""); 
  const [alamat, setAlamat] = useState("");
  const [msg, setMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (e.target.name === "gambar") {
      console.log(`Selected file for gambar: ${file.name}, Type: ${file.type}`);
      // Basic validation to ensure it's an image
      if (!file.type.startsWith('image/')) {
        setMsg("File untuk gambar harus berupa gambar (jpg, png, jpeg, webp).");
        setShowToast(true);
        return;
      }
      setGambar(file);
    } else if (e.target.name === "cv_pdf") {
      console.log(`Selected file for cv_pdf: ${file.name}, Type: ${file.type}`);
      // Basic validation to ensure it's a PDF
      if (file.type !== 'application/pdf') {
        setMsg("File untuk CV harus berupa PDF.");
        setShowToast(true);
        return;
      }
      setCvPdf(file);
    }
  };

  const saveusers = async (e) => {
    e.preventDefault();

    // Basic validation for required fields
    if (!nama || !email || !password || !confPassword || !role || !bank) {
      setMsg("Semua bidang wajib harus diisi.");
      setShowToast(true);
      return;
    }

    // Additional validation for file types before submission
    if (gambar && !gambar.type.startsWith('image/')) {
      setMsg("File untuk gambar harus berupa gambar (jpg, png, jpeg, webp).");
      setShowToast(true);
      return;
    }

    if (cv_pdf && cv_pdf.type !== 'application/pdf') {
      setMsg("File untuk CV harus berupa PDF.");
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("nama", nama);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confPassword", confPassword);
      formData.append("role", role);
      formData.append("no_telp", no_telp); 
      formData.append("harga", harga); 
      formData.append("bank", bank); 
      formData.append("no_rekening", no_rekening); 
      formData.append("alamat", alamat); 
      
      if (gambar) {
        console.log(`Appending gambar to FormData: ${gambar.name}, Type: ${gambar.type}`);
        formData.append("gambar", gambar);
      }
      if (cv_pdf) {
        console.log(`Appending cv_pdf to FormData: ${cv_pdf.name}, Type: ${cv_pdf.type}`);
        formData.append("cv_pdf", cv_pdf);
      }

      await axios.post("http://localhost:5000/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg("User berhasil dikirim!");
      setShowToast(true);

      setTimeout(() => {
        navigate("/users");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg || "Terjadi kesalahan saat menambahkan user.");
        setShowToast(true);
      } else {
        setMsg("Terjadi kesalahan saat menambahkan user.");
        setShowToast(true);
      }
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

      <h2 className="mb-4 text-blue fw-bold">Tambah Data User</h2>
      <div className="card border-none bg-blue2 m-lg-4 shadow">
        <div className="card-body text-blue fw-bold px-lg-5">
          <form onSubmit={saveusers}>
            <div className="mb-3">
              <label className="form-label">Upload Gambar (jpg, png, jpeg, webp)</label>
              <input
                type="file"
                className="form-control"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                name="gambar"
                onChange={handleFileChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Upload CV (PDF)</label>
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                name="cv_pdf"
                onChange={handleFileChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={nama}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
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
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password.."
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="Masukkan confirm password..."
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
                <option value="owner">Owner</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">No. Telepon</label>
              <div className="d-flex align-items-center">
              <span className="me-2">+62</span>
              <input
                type="number"
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
                    <span>Simpan</span>
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

export default FormAddUser;
