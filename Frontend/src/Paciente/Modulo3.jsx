import { useRef } from "react";
import html2pdf from "html2pdf.js";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar_paciente";

export default function ReporteModulo3() {
  const reportRef = useRef();
  const COLOR_BG = "#f8f9fa";

  // -------------------------
  // Datos personales
  // -------------------------
  const nombres = "José Mario";
  const apellidos = "Morales Quezada";
  const fecha = "6 de junio de 2025";
  const telefono = "7907-6010";
  const especialista = "Lic. Juan Acevedo";

  // -------------------------
  // Afectación Social (AS)
  // -------------------------
  const narracionSucesos = 0; // (A-7)
  const conversacion = 0; // (A-8)
  const gestos = 0; // (A-9)
  const contactoVisual = 0; // (B-1)
  const expresionesFaciales = 0; // (B-2)
  const disfruteCompartido = 0; // (B-4)
  const caracteristicasIniciaciones = 0; // (B-7)
  const calidadRespuestaSocial = 0; // (B-9)
  const cantidadComunicacionSocial = 0; // (B-10)
  const calidadRelacion = 0; // (B-11)

  // Totales AS
  const totalAS = 0;

  // ----------------------------------------
  // Comportamiento Restringido y Repetitivo
  // ----------------------------------------
  const usoEsteriotipado = 0; // (A-4)
  const interesSensorial = 0; // (D-1)
  const manierismosManos = 0; // (D-2)
  const interesExcesivo = 0; // (D-4)

  // Total CRR
  const totalCRR = 0;

  // Total Global
  const totalGlobal = 0;

  // ----------------------------------------
  // Clasificación y Diagnóstico
  // ----------------------------------------
  const clasificacionADOS = "";
  const diagnosticoGeneral = "";

  // ----------------------------------------
  // Puntuación Comparativa y Nivel de Síntomas
  // ----------------------------------------
  const comparativaADOS = "";
  const descripcionNivelSintomas = "";
  const nivelSintomas = "";

  // Función para generar PDF desde el contenido oculto
  const generarPDF = () => {
    if (!reportRef.current) return;
    const element = reportRef.current;
    const opt = {
      margin: 0.3,
      filename: "Reporte-Modulo-3.pdf",
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
        <h2 className="text-center mb-4" style={{ color: "#5A6D8C" }}>Módulo 3</h2>
        <div className="text-center mb-4">
          <button className="btn" style={{ backgroundColor: "#5A6D8C", color: "#fff" }} onClick={generarPDF}>
            Generar Reporte PDF
          </button>
        </div>
        <div>
          <div ref={reportRef} className="bg-white p-4">
            {/* Encabezado */}
            <div className="row mb-4">
              <div className="col-md-6">
                <h1 style={{ color: "#5A6D8C" }}>ADOS-2</h1>
              </div>
              <div className="col-md-6 text-end">
                <h1 style={{ color: "#5A6D8C" }}>Algoritmo Módulo 3</h1>
              </div>
            </div>

            {/* Datos Personales */}
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
                <div className="col-md-4">
                  <label className="form-label">Fecha</label>
                  <div className="border rounded p-1">{fecha}</div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Teléfono</label>
                  <div className="border rounded p-1">{telefono}</div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Especialista</label>
                  <div className="border rounded p-1">{especialista}</div>
                </div>
              </div>
            </fieldset>

            {/* Afectación Social */}
            <fieldset className="border rounded p-3">
              <legend className="w-auto px-2">Afectación Social (AS)</legend>

              <h6 className="text-secondary">Comunicación</h6>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Narración de sucesos <span className="float-end">(A-7)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{narracionSucesos}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Conversación <span className="float-end">(A-8)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{conversacion}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Gestos descriptivos, convencionales, instrumentales o informativos <span className="float-end">(A-9)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{gestos}</div>
              </div>

              <h6 className="text-secondary mt-3">Interacción social recíproca</h6>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Contacto visual inusual <span className="float-end">(B-1)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{contactoVisual}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Expresiones faciales dirigidas al examinador <span className="float-end">(B-2)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{expresionesFaciales}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Disfrute compartido durante la interacción <span className="float-end">(B-4)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{disfruteCompartido}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Características de las iniciaciones sociales <span className="float-end">(B-7)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{caracteristicasIniciaciones}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Calidad de la respuesta social <span className="float-end">(B-9)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{calidadRespuestaSocial}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Cantidad de comunicación social recíproca <span className="float-end">(B-10)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{cantidadComunicacionSocial}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Calidad general de la relación <span className="float-end">(B-11)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{calidadRelacion}</div>
              </div>
            </fieldset>

            <fieldset className="border rounded p-3" style={{ background: "#E6ECF3" }}>
              <div className="row g-2">
                <div className="col-md-10 text-end fw-bold" style={{ color: "#5A6D8C" }}>TOTAL AS:</div>
                <div className="col-md-2 border rounded p-1 text-center" style={{ background: "#fff", color: "#000" }}>{totalAS}</div>
              </div>
            </fieldset>

            {/* CRR */}
            <fieldset className="border rounded p-3">
              <legend className="w-auto px-2">Comportamiento Restringido y Repetitivo (CRR)</legend>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Uso estereotipado o idiosincrásico de palabras o frases <span className="float-end">(A-4)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{usoEsteriotipado}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Interés sensorial inusual en los materiales de juego o en las personas <span className="float-end">(D-1)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{interesSensorial}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Manierismos de manos y dedos y otros manierismos complejos <span className="float-end">(D-2)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{manierismosManos}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-10">Interés excesivo en temas u objetos inusuales o altamente específicos <span className="float-end">(D-4)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{interesExcesivo}</div>
              </div>
            </fieldset>
            
            <fieldset className="border rounded p-3" style={{ background: "#E6ECF3" }}>
              <div className="row g-2">
                <div className="col-md-10 text-end fw-bold" style={{ color: "#5A6D8C" }}>TOTAL CRR:</div>
                <div className="col-md-2 border rounded p-1 text-center" style={{ background: "#fff", color: "#000" }}>{totalCRR}</div>
              </div>
            </fieldset>

            {/* Total Global */}
            <fieldset className="border rounded p-3 mb-4" style={{ background: "#5A6D8C" }}>
              <div className="row g-2">
                <div className="col-md-10 text-end fw-bold text-white">PUNTUACIÓN TOTAL GLOBAL (AS + CRR):</div>
                <div className="col-md-2 border rounded p-1 text-center" style={{ background: "#fff", color: "#000" }}>{totalGlobal}</div>
              </div>
            </fieldset>

            {/* Puntuación Comparativa y Nivel de Síntomas */}
            <div className="border rounded p-3 mb-4">
              <div className="row g-2 mb-2">
                <div className="col-md-6">Puntuación comparativa del ADOS-2</div>
                <div className="col-md-6 border rounded p-1">{comparativaADOS}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-4">Nivel de síntomas asociados al autismo</div>
                <div className="col-8 border rounded p-2">{descripcionNivelSintomas}</div>
              </div>
            </div>

            {/* Clasificación y Diagnóstico */}
            <fieldset className="border rounded p-3 mb-4">
              <legend className="w-auto px-2">CLASIFICACIÓN Y DIAGNÓSTICO</legend>
              <div className="row g-2 mb-2">
                <div className="col-md-4">Clasificación del ADOS-2:</div>
                <div className="col-md-8 border rounded p-2">{clasificacionADOS}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-4">Diagnóstico general:</div>
                <div className="col-md-8 border rounded p-2">{diagnosticoGeneral}</div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}