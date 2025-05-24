import React from "react";

const DescargarAdiR = ({ id_adir }) => {
  const descargarPDF = () => {
    window.open(`http://localhost:5000/api/adir/pdf/${id_adir}`, "_blank");
  };

  return (
    <button
      onClick={descargarPDF}
      className="btn btn-outline-primary mt-2"
      style={{ borderRadius: 20, fontWeight: "bold" }}
      title="Generar y descargar resultados ADI-R"
    >
      Generar resultados
    </button>
  );
};

export default DescargarAdiR;