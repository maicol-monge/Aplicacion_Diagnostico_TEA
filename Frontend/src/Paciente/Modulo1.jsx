import { useRef } from "react";
import html2pdf from "html2pdf.js";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar_paciente";

export default function ReporteModulo1() {
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
  const frecuenciaVocalizacion = 0;        // (A-2)
  const senalar = 0;                       // (A-7)
  const gestos = 0;                        // (A-8)
  const contactoVisual = 0;                // (B-1)
  const expresionesFaciales = 0;           // (B-3)
  const integracionMirada = 0;             // (B-4)
  const disfruteCompartido = 0;            // (B-5)
  const mostrar = 0;                       // (B-9)
  const iniciacionEspontanea = 0;          // (B-10)
  const respuestaAtencionConjunta = 0;     // (B-11)
  const caracteristicasIniciaciones = 0;   // (B-12)

  // Totales AS
  const totalAS = 0;

  // ----------------------------------------
  // Comportamiento Restringido y Repetitivo
  // ----------------------------------------
  const entonacion = 0;                    // (A-3)
  const usoEsteriotipado = 0;              // (A-5)
  const interesSensorial = 0;              // (D-1)
  const manierismosManos = 0;              // (D-2)
  const interesesRepetitivos = 0;          // (D-4)

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
  const nivelSintomas = ""; // <-- Agrega esta línea

  // Función para generar PDF desde el contenido oculto
  const generarPDF = () => {
    if (!reportRef.current) return;
    const element = reportRef.current;
    const opt = {
      margin: 0.3,
      filename: "Reporte-Modulo-1.pdf",
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
        <h2 className="text-center text-primary mb-4">Módulo T</h2>
        <div className="text-center mb-4">
          <button className="btn btn-primary" onClick={generarPDF}>
            Generar Reporte PDF
          </button>
        </div>
        <div>
          <div ref={reportRef} className="bg-white p-4">
            {/* Encabezado */}
            <div className="row mb-4">
              <div className="col-md-6"><h1 className="text-primary">ADOS-2</h1></div>
              <div className="col-md-6 text-end"><h1 className="text-primary">Algoritmo Módulo T</h1></div>
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
            <fieldset className="border rounded p-3 mb-4">
              <legend className="w-auto px-2">Afectación Social (AS)</legend>

              <h6 className="text-secondary">Comunicación</h6>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Frecuencia de la vocalización espontánea dirigida a otros <span className="float-end">"(A-2)"</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{frecuenciaVocalizacion}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Señalar <span className="float-end">(A-7)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{senalar}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Gestos <span className="float-end">(A-8)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{gestos}</div>
              </div>

              <h6 className="text-secondary mt-3">Interacción social recíproca</h6>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Contacto visual inusual <span className="float-end">(B-1)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{contactoVisual}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Expresiones faciales dirigidas a otros <span className="float-end">(B-3)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{expresionesFaciales}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Integración de la mirada y otras conductas durante las iniciaciones sociales <span className="float-end">(B-4)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{integracionMirada}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Disfrute compartido durante la interacción <span className="float-end">(B-5)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{disfruteCompartido}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Mostrar <span className="float-end">(B-9)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{mostrar}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Iniciación espontánea de la atención conjunta <span className="float-end">(B-10)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{iniciacionEspontanea}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Respuesta a la atención conjunta <span className="float-end">(B-11)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{respuestaAtencionConjunta}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Características de las iniciaciones sociales <span className="float-end">(B-12)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{caracteristicasIniciaciones}</div>
              </div>

              {/* Total AS */}
              <div className="row g-2 mt-3 bg-info text-white p-2 rounded">
                <div className="col-md-8 text-end fw-bold">TOTAL AS:</div>
                <div className="col-md-2 border rounded p-1 text-center">{totalAS}</div>
              </div>
            </fieldset>

            {/* CRR */}
            <fieldset className="border rounded p-3 mb-4">
              <legend className="w-auto px-2">Comportamiento Restringido y Repetitivo (CRR)</legend>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Entonación de las vocalizaciones o verbalizaciones <span className="float-end">(A-3)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{entonacion}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Uso estereotipado o idiosincrásico de palabras o frases <span className="float-end">(A-5)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{usoEsteriotipado}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Interés sensorial inusual en los materiales de juego o en las personas <span className="float-end">(D-1)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{interesSensorial}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Manierismos de manos y dedos y otros manierismos complejos <span className="float-end">(D-2)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{manierismosManos}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-8">Intereses inusualmente repetitivos o comportamientos estereotipados <span className="float-end">(D-4)</span></div>
                <div className="col-md-2 border rounded p-1 text-center">{interesesRepetitivos}</div>
              </div>

              {/* Total CRR */}
              <div className="row g-2 mt-3 bg-info text-white p-2 rounded">
                <div className="col-md-8 text-end fw-bold">TOTAL CRR:</div>
                <div className="col-md-2 border rounded p-1 text-center">{totalCRR}</div>
              </div>
            </fieldset>

            {/* Total Global */}
            <fieldset className="border rounded p-3 bg-primary mb-4 text-white">
              <div className="row g-2">
                <div className="col-md-8 text-end fw-bold">PUNTUACIÓN TOTAL GLOBAL (AS + CRR):</div>
                <div className="col-md-2 border rounded p-1 text-center">{totalGlobal}</div>
              </div>
            </fieldset>

            {/* Puntuación Comparativa y Nivel de Síntomas */}
            <div className="border rounded p-3 mb-4">
              <div className="row g-2 mb-2">
                <div className="col-md-4">PUNTUACIÓN COMPARATIVA DEL ADOS-2</div>
                <div className="col-md-8 border rounded p-1">{comparativaADOS}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-4">Nivel de síntomas asociados al autismo</div>
                <div className="col-md-8">{nivelSintomas}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-12 border rounded p-2">{descripcionNivelSintomas}</div>
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
