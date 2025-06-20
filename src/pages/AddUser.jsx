import React, {useEffect} from 'react'
import AdminLayout from './AdminLayout';
import FormAddUser from '../components/FormAddUser'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const AddUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if(isError){
      navigate("/login")
    }
    if(user && user.role !== "owner") {
      navigate("/login");
    }
  }, [isError, user, navigate]);

  return (
    <div>
        <AdminLayout>
            <FormAddUser />
        </AdminLayout>
    </div>
  )
}

export default AddUser