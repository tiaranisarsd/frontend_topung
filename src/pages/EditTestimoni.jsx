import React, {useEffect} from 'react';
import AdminLayout from './AdminLayout';
import FormEditTestimoni from '../components/FormEditTestimoni';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const EditTestimoni = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, testimoni } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if(isError){
      navigate("/login")
    }
    if(testimoni && testimoni.role !== "owner") {
      navigate("/testimoni");
    }
  }, [isError, testimoni, navigate]);


  return (
    <div>
        <AdminLayout>
            <FormEditTestimoni />
        </AdminLayout>
    </div>
  );
};

export default EditTestimoni;