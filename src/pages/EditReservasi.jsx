import React, {useEffect} from 'react'
import AdminLayout from './AdminLayout';
import FormEditReservasi from '../components/FormEditReservasi'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const EditReservasi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, reservasi } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if(isError){
      navigate("/login")
    }
    if(reservasi && reservasi.role !== "owner") {
      navigate("/reservasi");
    }
  }, [isError, reservasi, navigate]);

  return (
    <div>
        <AdminLayout>
            <FormEditReservasi />
        </AdminLayout>
    </div>
  )
}

export default EditReservasi