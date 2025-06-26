import React, {useEffect} from 'react';
import AdminLayout from './AdminLayout';
import FormEditEdukasi from '../components/FormEditEdukasi';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const EditEdukasi = () => {
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
            <FormEditEdukasi />
        </AdminLayout>
    </div>
  );
};

export default EditEdukasi;