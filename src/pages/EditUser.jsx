import React, {useEffect} from 'react';
import AdminLayout from './AdminLayout';
import FormEditUser from '../components/FormEditUser';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const EditUser = () => {
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
      navigate("/users");
    }
  }, [isError, user, navigate]);


  return (
    <div>
        <AdminLayout>
            <FormEditUser />
        </AdminLayout>
    </div>
  );
};

export default EditUser;