import { useRef } from "react";
import html2pdf from "html2pdf.js";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar_paciente";

export default function ReporteModulo2() {
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
  const senalar = 0; // (A-6)
  const senalar2 = 0;
  const gestos = 0; // (A-7)
  const gestos2 = 0;
  const contactoVisual = 0; // (B-1)
  const contactoVisual2 = 0;
  const expresionesFaciales = 0; // (B-2)
  const expresionesFaciales2 = 0;
  const disfruteCompartido = 0; // (B-3)
  const disfruteCompartido2 = 0;
  const mostrar = 0; // (B-5)
  const mostrar2 = 0;
  const iniciacionEspontanea = 0; // (B-6)
  const iniciacionEspontanea2 = 0;
  const caracteristicasIniciaciones = 0; // (B-8)
  const caracteristicasIniciaciones2 = 0;
  const cantidadComunicacionSocial = 0; // (B-11)
  const cantidadComunicacionSocial2 = 0;
  const calidadRelacion = 0; // (B-12)
  const calidadRelacion2 = 0;

  // Totales AS
  const totalAS = 0;
  const totalAS2 = 0;

  // ----------------------------------------
  // Comportamiento Restringido y Repetitivo
  // ----------------------------------------
  const usoEsteriotipado = 0; // (A-4)
  const usoEsteriotipado2 = 0;
  const interesSensorial = 0; // (D-1)
  const interesSensorial2 = 0;
  const manierismosManos = 0; // (D-2)
  const manierismosManos2 = 0;
  const interesesRepetitivos = 0; // (D-4)
  const interesesRepetitivos2 = 0;

  // Total CRR
  const totalCRR = 0;
  const totalCRR2 = 0;

  // Total Global
  const totalGlobal = 0;
  const totalGlobal2 = 0;

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
      filename: "Reporte-Modulo-2.pdf",
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
        <h2 className="text-center mb-4" style={{ color: "#FFD600" }}>Módulo 2</h2>
        <div className="text-center mb-4">
          <button className="btn" style={{ backgroundColor: "#FFD600", color: "#000" }} onClick={generarPDF}>
            Generar Reporte PDF
          </button>
        </div>
        <div>
          <div ref={reportRef} className="bg-white p-4">
            {/* Encabezado */}
            <div className="row mb-4">
              <div className="col-md-6">
                <h1 style={{ color: "#FFD600" }}>ADOS-2</h1>
              </div>
              <div className="col-md-6 text-end">
                <h1 style={{ color: "#FFD600" }}>Algoritmo Módulo 2</h1>
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

            {/* ================= */}
            {/* BLOQUE ALGORITMO */}
            {/* ================= */}
            <fieldset className="border p-3">
              <div className="row g-2 mb-2">
                <div className="col-md-8"></div>
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-header fw-bold text-center">
                      ALGORITMO
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6 text-center border-end">
                          <div className="fw-bold"><small>Menores de 5 años</small></div>
                        </div>
                        <div className="col-6 text-center">
                          <div className="fw-bold"><small>5 años o más</small></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Afectación Social */}
            <fieldset className="border rounded p-3">
              <legend className="w-auto px-2">Afectación Social (AS)</legend>

              <h6 className="text-secondary">Comunicación</h6>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Señalar <span className="float-end">(A-6)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{senalar}</div>
                <div className="col-md-2 border rounded p-1 text-center">{senalar2}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Gestos descriptivos, convencionales, instrumentales o informativos <span className="float-end">(A-7)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{gestos}</div>
                <div className="col-md-2 border rounded p-1 text-center">{gestos2}</div>
              </div>

              <h6 className="text-secondary mt-3">Interacción social recíproca</h6>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Contacto visual inusual <span className="float-end">(B-1)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{contactoVisual}</div>
                <div className="col-md-2 border rounded p-1 text-center">{contactoVisual2}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Expresiones faciales dirigidas a otros <span className="float-end">(B-2)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{expresionesFaciales}</div>
                <div className="col-md-2 border rounded p-1 text-center">{expresionesFaciales2}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Disfrute compartido durante la interacción <span className="float-end">(B-3)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{disfruteCompartido}</div>
                <div className="col-md-2 border rounded p-1 text-center">{disfruteCompartido2}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Mostrar <span className="float-end">(B-5)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{mostrar}</div>
                <div className="col-md-2 border rounded p-1 text-center">{mostrar2}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Iniciación espontánea de la atención conjunta <span className="float-end">(B-6)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{iniciacionEspontanea}</div>
                <div className="col-md-2 border rounded p-1 text-center">{iniciacionEspontanea2}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Características de las iniciaciones sociales <span className="float-end">(B-8)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{caracteristicasIniciaciones}</div>
                <div className="col-md-2 border rounded p-1 text-center">{caracteristicasIniciaciones2}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Cantidad de comunicación social recíproca <span className="float-end">(B-11)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{cantidadComunicacionSocial}</div>
                <div className="col-md-2 border rounded p-1 text-center">{cantidadComunicacionSocial2}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Calidad general de la relación <span className="float-end">(B-12)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{calidadRelacion}</div>
                <div className="col-md-2 border rounded p-1 text-center">{calidadRelacion2}</div>
              </div>
            </fieldset>

            <fieldset className="border rounded p-3" style={{ background: "#FFFDE7" }}>
              <div className="row g-2">
                <div className="col-md-8 text-end fw-bold" style={{ color: "#FFD600" }}>TOTAL AS:</div>
                <div className="col-md-2 border rounded p-1 text-center" style={{ background: "#fff", color: "#000" }}>{totalAS}</div>
                <div className="col-md-2 border rounded p-1 text-center" style={{ background: "#fff", color: "#000" }}>{totalAS2}</div>
              </div>
            </fieldset>

            {/* CRR */}
            <fieldset className="border rounded p-3">
              <legend className="w-auto px-2">Comportamiento Restringido y Repetitivo (CRR)</legend>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Uso estereotipado o idiosincrásico de palabras o frases <span className="float-end">(A-4)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{usoEsteriotipado}</div>
                <div className="col-md-2 border rounded p-1 text-center">{usoEsteriotipado2}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Interés sensorial inusual en los materiales de juego o en las personas <span className="float-end">(D-1)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{interesSensorial}</div>
                <div className="col-md-2 border rounded p-1 text-center">{interesSensorial2}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Manierismos de manos y dedos y otros manierismos complejos <span className="float-end">(D-2)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{manierismosManos}</div>
                <div className="col-md-2 border rounded p-1 text-center">{manierismosManos2}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Intereses inusualmente repetitivos o comportamientos estereotipados <span className="float-end">(D-4)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{interesesRepetitivos}</div>
                <div className="col-md-2 border rounded p-1 text-center">{interesesRepetitivos2}</div>
              </div>
            </fieldset>
            
            <fieldset className="border rounded p-3" style={{ background: "#FFFDE7" }}>
              <div className="row g-2">
                <div className="col-md-8 text-end fw-bold" style={{ color: "#FFD600" }}>TOTAL CRR:</div>
                <div className="col-md-2 border rounded p-1 text-center" style={{ background: "#fff", color: "#000" }}>{totalCRR}</div>
                <div className="col-md-2 border rounded p-1 text-center" style={{ background: "#fff", color: "#000" }}>{totalCRR2}</div>
              </div>
            </fieldset>

            {/* Total Global */}
            <fieldset className="border rounded p-3 mb-4" style={{ background: "#FFD600" }}>
              <div className="row g-2">
                <div className="col-md-8 text-end fw-bold text-white">PUNTUACIÓN TOTAL GLOBAL (AS + CRR):</div>
                <div className="col-md-2 border rounded p-1 text-center" style={{ background: "#fff", color: "#000" }}>{totalGlobal}</div>
                <div className="col-md-2 border rounded p-1 text-center" style={{ background: "#fff", color: "#000" }}>{totalGlobal2}</div>
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