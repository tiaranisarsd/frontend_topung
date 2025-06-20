import React, {useEffect} from 'react'
import AdminLayout from './AdminLayout';
import FormAddJadwalKegiatan from '../components/FormAddJadwalKegiatan'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const AddJadwalKegiatan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

 useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if(isError){
      navigate("/login")
    }
  }, [isError, navigate]);

  return (
    <div>
        <AdminLayout>
            <FormAddJadwalKegiatan />
        </AdminLayout>
    </div>
  )
}

export default AddJadwalKegiatan