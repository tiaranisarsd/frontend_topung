import React, {useEffect} from 'react';
import AdminLayout from './AdminLayout';
import FormEditPertanyaan from '../components/FormEditPertanyaan';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const EditPertanyaan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, pertanyaan } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if(isError){
      navigate("/login")
    }
    if(pertanyaan && pertanyaan.role !== "owner") {
      navigate("/pertanyaan");
    }
  }, [isError, pertanyaan, navigate]);


  return (
    <div>
        <AdminLayout>
            <FormEditPertanyaan />
        </AdminLayout>
    </div>
  );
};

export default EditPertanyaan;