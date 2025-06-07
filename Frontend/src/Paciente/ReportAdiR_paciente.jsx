import Footer from "../components/Footer";
import Navbar from "../components/Navbar_paciente";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

export default function ReportAdiR_paciente() {
  // Datos personales (puedes reemplazar por props o estados)
  const nombres = "José Mario";
  const apellidos = "Morales Quezada";
  const fecha = "6 de junio de 2025";
  const especialista = "Lic. Juan Acevedo";

  // Totales y diagnóstico (puedes reemplazar por props o estados)
  const totalA = 0;
  const totalB = 0;
  const totalC = 0;
  const totalD = 0;
  const diagnostico = "Aquí aparecerá el resumen de tu diagnóstico.";

  const melonFuerte = "#FF8C69";
  const grisOscuro = "#6C6F73";
  const COLOR_BG = "#f8f9fa";

  const reportRef = useRef();

  const exportarPDF = () => {
    if (!reportRef.current) return;
    const element = reportRef.current;
    const opt = {
      margin: 0.3,
      filename: "Resumen-ADI-R.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: COLOR_BG }}>
      <Navbar />
      <div className="container my-4">
        <h1 className="text-center mb-2" style={{ color: melonFuerte, fontWeight: 700, fontSize: "2.5rem" }}>ADI - R</h1>
        <h5 className="text-center mb-4" style={{ color: melonFuerte }}>Resumen de resultados</h5>
        <div className="text-center mb-4">
          <button className="btn" style={{ backgroundColor: melonFuerte, color: "#fff" }} onClick={exportarPDF}>
            Exportar a PDF
          </button>
        </div>
        <div ref={reportRef}>
          <fieldset className="border rounded p-3 mb-4">
            <legend className="w-auto px-2">Datos del Evaluado</legend>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nombres</label>
                <div className="border rounded p-1">{nombres}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Apellidos</label>
                <div className="border rounded p-1">{apellidos}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Fecha</label>
                <div className="border rounded p-1">{fecha}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Especialista</label>
                <div className="border rounded p-1">{especialista}</div>
              </div>
            </div>
          </fieldset>

          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <div className="border rounded p-3 text-center" style={{ background: "#FFE5D0" }}>
                <div className="fw-bold" style={{ color: melonFuerte }}>Interacción Social</div>
                <div style={{ fontSize: "1.5rem" }}>{totalA}</div>
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="border rounded p-3 text-center" style={{ background: "#FFE5D0" }}>
                <div className="fw-bold" style={{ color: melonFuerte }}>Comunicación</div>
                <div style={{ fontSize: "1.5rem" }}>{totalB}</div>
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="border rounded p-3 text-center" style={{ background: "#FFE5D0" }}>
                <div className="fw-bold" style={{ color: melonFuerte }}>Conductas Repetitivas</div>
                <div style={{ fontSize: "1.5rem" }}>{totalC}</div>
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="border rounded p-3 text-center" style={{ background: "#FFE5D0" }}>
                <div className="fw-bold" style={{ color: melonFuerte }}>Desarrollo Temprano</div>
                <div style={{ fontSize: "1.5rem" }}>{totalD}</div>
              </div>
            </div>
          </div>

          <fieldset className="border rounded p-3 my-4" style={{ background: grisOscuro }}>
            <legend className="w-auto px-2 text-white">Resumen del diagnóstico</legend>
            <div className="p-2 text-white">{diagnostico}</div>
          </fieldset>
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}