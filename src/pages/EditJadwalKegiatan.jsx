import React, {useEffect} from 'react';
import AdminLayout from './AdminLayout';
import FormEditJadwalKegiatan from '../components/FormEditJadwalKegiatan';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const EditJadwalKegiatan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, jadwalKegiatan } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if(isError){
      navigate("/login")
    }
    if(jadwalKegiatan && jadwalKegiatan.role !== "owner") {
      navigate("/jadwalKegiatan");
    }
  }, [isError, jadwalKegiatan, navigate]);


  return (
    <div>
        <AdminLayout>
            <FormEditJadwalKegiatan />
        </AdminLayout>
    </div>
  );
};

export default EditJadwalKegiatan;