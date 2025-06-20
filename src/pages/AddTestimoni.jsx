import React, {useEffect} from 'react'
import AdminLayout from './AdminLayout';
import FormAddTestimoni from '../components/FormAddTestimoni'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const AddTestimoni = () => {
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
            <FormAddTestimoni />
        </AdminLayout>
    </div>
  )
}

export default AddTestimoni