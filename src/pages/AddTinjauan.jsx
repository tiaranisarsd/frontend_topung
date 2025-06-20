import React, {useEffect} from 'react'
import AdminLayout from './AdminLayout';
import FormAddTinjauan from '../components/FormAddTinjauan'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const AddTinjauan = () => {
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
            <FormAddTinjauan />
        </AdminLayout>
    </div>
  )
}

export default AddTinjauan