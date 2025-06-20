import React, { useEffect } from "react";
import AdminLayout from "./AdminLayout";
import Tinjauan from "../components/TinjauanAdmin";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const TinjauanList = () => {
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
        <Tinjauan />
      </AdminLayout>
    </div>
  );
};

export default TinjauanList;