/* eslint-disable react-hooks/exhaustive-deps */
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Beranda from './pages/Beranda';
import Login from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";
import Terapis from "./pages/Terapis";
import ScrollToHash from './ScrollToHash';
import TentangKamiPage from "./pages/TentangKamiPage";
import UsersList from "./pages/UsersList";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import ReservasiList from "./pages/ReservasiList";
import JadwalTerapisList from "./pages/JadwalTerapisList";
import AddJadwalTerapis from "./pages/AddJadwalTerapis";
import EditJadwalTerapis from "./pages/EditJadwalTerapis";
import EdukasiList from "./pages/EdukasiList";
import AddEdukasi from "./pages/AddEdukasi";
import EditEdukasi from "./pages/EditEdukasi";
import JadwalKegiatanList from "./pages/JadwalKegiatanList";
import AddJadwalKegiatan from "./pages/AddJadwalKegiatan";
import EditJadwalKegiatan from "./pages/EditJadwalKegiatan";
import TinjauanList from "./pages/TinjauanList";
import PertanyaanList from "./pages/PertanyaanList";
import AddPertanyaan from "./pages/AddPertanyaan";
import EditPertanyaan from "./pages/EditPertanyaan";
import DokumentasiList from "./pages/DokumentasiList";
import AddDokumentasi from "./pages/AddDokumentasi";
import EditDokumentasi from "./pages/EditDokumentasi";
import TestimoniList from "./pages/TestimoniList";
import AddTestimoni from "./pages/AddTestimoni";
import EditTestimoni from "./pages/EditTestimoni";

function App() {

  return (
      <BrowserRouter>
      <ScrollToHash />
      <Routes>
      <Route path="/" element={<Beranda />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/*" element={<NotFoundPage />}/>
      <Route path="/terapis" element={<Terapis />}/>
      <Route path="/tentang" element={<TentangKamiPage />}/>
      <Route path="/users" element={<UsersList />}/>
      <Route path="/users/add" element={<AddUser />}/>
      <Route path="/users/edit/:id" element={<EditUser />}/>
      <Route path="/reservasi" element={<ReservasiList />}/>
      <Route path="/jadwalTerapis" element={<JadwalTerapisList />} />
      <Route path="/jadwalTerapis/add/:userId" element={<AddJadwalTerapis />} />
      <Route path="/jadwalTerapis/edit/users/:userId/:id" element={<EditJadwalTerapis />} />
      <Route path="/edukasi" element={<EdukasiList />}/>
      <Route path="/edukasi/add" element={<AddEdukasi />}/>
      <Route path="/edukasi/edit/:id" element={<EditEdukasi />}/>
      <Route path="/jadwalKegiatan" element={<JadwalKegiatanList />}/>
      <Route path="/jadwalKegiatan/add" element={<AddJadwalKegiatan />}/>
      <Route path="/jadwalKegiatan/edit/:id" element={<EditJadwalKegiatan />}/>
      <Route path="/ulasan" element={<TinjauanList />}/>
      <Route path="/pertanyaan" element={<PertanyaanList />}/>
      <Route path="/pertanyaan/add" element={<AddPertanyaan />}/>
      <Route path="/pertanyaan/edit/:id" element={<EditPertanyaan />}/>
      <Route path="/dokumentasi" element={<DokumentasiList />}/>
      <Route path="/dokumentasi/add" element={<AddDokumentasi />}/>
      <Route path="/dokumentasi/edit/:id" element={<EditDokumentasi />}/>
      <Route path="/testimoni" element={<TestimoniList />}/>
      <Route path="/testimoni/add" element={<AddTestimoni />}/>
      <Route path="/testimoni/edit/:id" element={<EditTestimoni />}/>

      </Routes>
      </BrowserRouter>
  );
}

export default App;
