import React, { useEffect } from "react";
import AdminLayout from "./AdminLayout";
import Testimoni from "../components/TestimoniAdmin";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const TestimoniList = () => {
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
        <Testimoni />
      </AdminLayout>
    </div>
  );
};

export default TestimoniList;