import React from "react";

export default function NotFoundPage() {

  return (
    <section className="d-flex flex-column align-items-center justify-content-center vh-100"> {/* Gunakan vh-100 dan flex-column */}
      <h1 className="display-1 text-blue fw-bold">404</h1> 
      <p className="lead">Halaman Tidak Ditemukan</p> 
    </section>
  );
}