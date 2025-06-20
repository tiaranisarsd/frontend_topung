import React, {useEffect} from 'react';
import AdminLayout from './AdminLayout';
import FormEditDokumentasi from '../components/FormEditDokumentasi';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const EditDokumentasi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, dokumentasi } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if(isError){
      navigate("/login")
    }
    if(dokumentasi && dokumentasi.role !== "owner") {
      navigate("/dokumentasi");
    }
  }, [isError, dokumentasi, navigate]);


  return (
    <div>
        <AdminLayout>
            <FormEditDokumentasi />
        </AdminLayout>
    </div>
  );
};

export default EditDokumentasi;