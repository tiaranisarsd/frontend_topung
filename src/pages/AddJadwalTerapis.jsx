import React, {useEffect} from 'react'
import AdminLayout from './AdminLayout';
import FormAddJadwalTerapis from '../components/FormAddJadwalTerapis'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const AddJadwalTerapis = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, jadwalTerapis } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if(isError){
      navigate("/login")
    }
    if(jadwalTerapis && jadwalTerapis.role !== "owner") {
      navigate("/jadwalTerapis");
    }
  }, [isError, jadwalTerapis, navigate]);

  return (
    <div>
        <AdminLayout>
            <FormAddJadwalTerapis />
        </AdminLayout>
    </div>
  )
}

export default AddJadwalTerapis