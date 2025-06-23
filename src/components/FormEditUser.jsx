/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { FaSave, FaTimesCircle } from 'react-icons/fa';

const FormEditUser = () => {
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
        // Update individual states with data from API
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

        setFormData({
          nama: response.data.nama || "",
          email: response.data.email || "",
          role: response.data.role || "",
          gambar: response.data.gambar || "",
          cv_pdf: response.data.cv_pdf || "",
          no_telp: response.data.no_telp || "",
          harga: response.data.harga || "",
          bank: response.data.bank || "",
          no_rekening: response.data.no_rekening || "",
          alamat: response.data.alamat || "",
        });
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg || "Gagal memuat data pengguna.");
          setShowToast(true);
          setTimeout(() => {
            navigate("/users");
          }, 3000);
        } else {
          setMsg("Terjadi kesalahan saat memuat data.");
          setShowToast(true);
        }
      }
    };
    getusersById();
  }, [id, navigate]);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    role: '',
    gambar: '',
    cv_pdf: '',
    no_telp: '',
    harga: '',
    bank: '',
    no_rekening: '',
    alamat: '',
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (e.target.name === "gambar") {
      console.log(`Selected file for gambar: ${file.name}, Type: ${file.type}`);
      if (!file.type.startsWith('image/')) {
        setMsg("File untuk gambar harus berupa gambar (jpg, png, jpeg, webp).");
        setShowToast(true);
        return;
      }
      setGambar(file);
    } else if (e.target.name === "cv_pdf") {
      console.log(`Selected file for cv_pdf: ${file.name}, Type: ${file.type}`);
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
        console.log(`ApMenunggu new gambar to FormData: ${gambar.name}, Type: ${gambar.type}`);
        formDataToSend.append("gambar", gambar);
      } else if (existingGambar) {
        formDataToSend.append("existingGambar", existingGambar);
      }

      if (cv_pdf) {
        console.log(`ApMenunggu new cv_pdf to FormData: ${cv_pdf.name}, Type: ${cv_pdf.type}`);
        formDataToSend.append("cv_pdf", cv_pdf);
      } else if (existingCvPdf) {
        formDataToSend.append("existingCvPdf", existingCvPdf);
      }

      await axios.patch(`http://localhost:5000/users/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg("User berhasil diperbarui!");
      setShowToast(true);
      setTimeout(() => {
        navigate("/users");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg || "Terjadi kesalahan saat memperbarui user.");
        setShowToast(true);
      } else {
        setMsg("Terjadi kesalahan saat memperbarui user: " + error.message);
        setShowToast(true);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
const downloadCv = async () => {
  try {
    const response = await axios.get(formData.cv_pdf, {
      responseType: 'blob', // Penting untuk mengunduh file sebagai blob
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cv_user.pdf'); // Nama file dengan ekstensi .pdf
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Bersihkan URL sementara
  } catch (error) {
    console.error('Error downloading CV:', error);
    setMsg('Gagal mengunduh CV. Silakan coba lagi.');
    setShowToast(true);
  }
};

<div className="mb-3">
  <label className="form-label">Upload CV Baru (PDF)</label>
  {formData.cv_pdf && !cv_pdf && (
    <div className="mb-2">
      <p>
        CV Saat Ini: <button onClick={downloadCv} className="btn btn-link p-0">Lihat CV</button>
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

      <h2 className="mb-4 text-blue fw-bold">Edit Users</h2>
      <div className="card border-none bg-blue2 m-lg-4 shadow">
        <div className="card-body text-blue fw-bold px-lg-5">
          <form onSubmit={updateusers}>
            <div className="mb-3">
              <label className="form-label">Upload Gambar Baru (jpg, png, jpeg, webp)</label>
              {formData.gambar && !gambar && (
                <div className="mb-2">
                  <img 
                    src={formData.gambar} 
                    alt="Gambar Saat Ini" 
                    className="shadow-sm"
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                  />
                </div>
              )}
              {gambar && (
                <div className="mt-2">
                  <p>File baru terpilih: {gambar.name}</p>
                  <p className="text-danger">Gambar lama akan diganti dengan yang baru.</p>
                  <div className="mb-2">
                    <img 
                      src={URL.createObjectURL(gambar)} 
                      alt="Preview Gambar Baru" 
                      className="shadow-sm"
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
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
              {formData.cv_pdf && !cv_pdf && (
                <div className="mb-2">
                  <p>
                    CV Saat Ini: <a href={formData.cv_pdf} target="_blank" rel="noopener noreferrer" download="cv_user.pdf">Lihat CV</a>
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
              <label className="form-label">Password Baru (kosongkan jika tidak ingin mengubah)</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password baru..."
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password Baru</label>
              <input
                type="password"
                className="form-control"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="Masukkan confirm password baru..."
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

export default FormEditUser;
