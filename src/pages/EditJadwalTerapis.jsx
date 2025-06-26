import React, { useEffect } from 'react';
import AdminLayout from './AdminLayout';
import FormEditJadwalTerapis from '../components/FormEditJadwalTerapis';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const EditJadwalTerapis = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) return; 

    if (isError) {
      navigate("/login"); 
    }
  }, [isError, isLoading, navigate]);

  return (
    <div>
      <AdminLayout>
        <FormEditJadwalTerapis />
      </AdminLayout>
    </div>
  );
}

export default EditJadwalTerapis;
