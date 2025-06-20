import React, {useEffect} from 'react'
import AdminLayout from './AdminLayout';
import FormAddReservasi from '../components/FormAddReservasi'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const AddReservasi = () => {
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
            <FormAddReservasi />
        </AdminLayout>
    </div>
  )
}

export default AddReservasi