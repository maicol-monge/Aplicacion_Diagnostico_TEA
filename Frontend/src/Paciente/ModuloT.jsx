import { useRef } from "react";
import html2pdf from "html2pdf.js";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar_paciente";

export default function ReporteModuleT() {
  const reportRef = useRef();
  const COLOR_BG = "#f8f9fa";

  // -------------------------
  // Variables a llenar luego
  // -------------------------
  const nombres = "José Mario";
  const apellidos = "Morales Quezada";
  const fecha = "6 de junio de 2025";
  const telefono = "7907-6010";
  const especialista = "Lic. Juan Acevedo";

  // Afectación Social (AS)
  const vocalizacionSp = 0;
  const senalar = 0;
  const gestos = 0;
  const contactoVisual = 0;
  const contactoVisual2 = 0;           // <-- Agrega esta línea
  const expresionesFaciales = 0;
  const expresionesFaciales2 = 0;      // <-- Agrega esta línea
  const integracionMirada = 0;
  const integracionMirada2 = 0;        // <-- Agrega esta línea
  const disfruteCompartido = 0;
  const respuestaNombre = 0;
  const ignorar = 0;
  const pedir = 0;
  const mostrar = 0;
  const iniciacionEspontanea = 0;
  const iniciacionEspontanea2 = 0;     // <-- Agrega esta línea
  const respuestaAtencion = 0;
  const caracteristicasIniciaciones = 0;
  const caracteristicasIniciaciones2 = 0; // <-- Agrega esta línea
  const cantidadIniciaciones = 0;
  const calidadRelacion = 0;
  const totalAS = 0;
  const totalAS2 = 0;

  // Comportamiento Restringido y Repetitivo (CRR)
  const entonacion = 0;
  const interesSensorial = 0;
  const interesSensorial2 = 0;         // <-- Agrega esta línea
  const movimientosManos = 0;
  const movimientosManos2 = 0;         // <-- Agrega esta línea
  const interesesRepetitivos = 0;
  const interesesRepetitivos2 = 0;     // <-- Agrega esta línea
  const totalCRR = 0;
  const totalCRR2 = 0;

  // Total Global
  const totalGlobal = 0;
  const totalGlobal2 = 0;

  // Observaciones finales
  const rangoPreocupacion = "Curiosito";
  const impresionClinica = "Autismo total";

  // Función para generar PDF desde el contenido oculto
  const generarPDF = () => {
    if (!reportRef.current) return;
    const element = reportRef.current;
    const opt = {
      margin:       0.3,
      filename:     "Reporte-Modulo-T.pdf",
      image:        { type: "jpeg", quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };
  return (
  <div className="d-flex flex-column min-vh-100" style={{ background: COLOR_BG }}>
    <Navbar />

    <div className="container my-4">
      {/* Título visible del módulo */}
      <h2 className="text-center text-primary mb-4">Módulo T</h2>

      {/* Botón visible para generar el PDF */}
      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={generarPDF}>
          Generar Reporte PDF
        </button>
      </div>

      {/* Plantilla completa oculta */}
      <div style={{ display: "none" }}>
        <div ref={reportRef} className="bg-white p-4">
          {/* ENCABEZADO DEL REPORTE */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h1 className="text-primary">ADOS-2</h1>
            </div>
            <div className="col-md-6 text-end">
              <h1 className="text-primary">Algoritmo Módulo T</h1>
            </div>
          </div>

          {/* DATOS DEL EVALUADO */}
          <fieldset className="border rounded p-3">
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
            <fieldset class="border p-3">
                <div class="row g-2 mb-2">
                    <div class="col-md-8">
      
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-light">
                        <div class="card-header fw-bold text-center">
                            ALGORITMO
                        </div>
                    <div class="card-body">
                    <div class="row">
            <div class="col-6 text-center border-end">
              <div class="fw-bold"><small>Niños pequeños/mayores con pocas o ninguna palabra </small></div>
              
            </div>
            <div class="col-6 text-center">
              <div class="fw-bold"><small>Niños mayores con algunas palabras</small></div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
            </fieldset>

          {/* AFECTACIÓN SOCIAL (AS) */}
          <fieldset className="border rounded p-3">
            <legend className="w-auto px-2">Afectación Social (AS)</legend>

            <h6 className="text-secondary">Comunicación</h6>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Frecuencia de la vocalización espontánea dirigida a otros
                <span className="float-end">(A-2)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{vocalizacionSp}</div>
              <div className="col-md-2"></div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Señalar
                <span className="float-end">(A-7)</span>
              </div>
              <div className="col-md-2"></div>
              <div className="col-md-2 border rounded p-1">{senalar}</div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Gestos
                <span className="float-end">(A-8)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{gestos}</div>
              <div className="col-md-2"></div>
            </div>

            <h6 className="text-secondary mt-3">Interacción social recíproca</h6>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Contacto visual inusual*
                <span className="float-end">(B-1)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{contactoVisual}</div>
              <div className="col-md-2 border rounded p-1">{contactoVisual2}</div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Expresiones faciales dirigidas a otros
                <span className="float-end">(B-4)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{expresionesFaciales}</div>
              <div className="col-md-2 border rounded p-1">{expresionesFaciales2}</div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Integración de la mirada y otras conductas durante las iniciaciones sociales
                <span className="float-end">(B-5)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{integracionMirada}</div>
              <div className="col-md-2 border rounded p-1">{integracionMirada2}</div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Disfrute compartido durante la interacción
                <span className="float-end">(B-6)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{disfruteCompartido}</div>
              <div className="col-md-2"></div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Respuesta al nombre
                <span className="float-end">(B-7)</span>
              </div>
              <div className="col-md-2"></div>
              <div className="col-md-2 border rounded p-1">{respuestaNombre}</div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Ignorar
                <span className="float-end">(B-8)</span>
              </div>
              <div className="col-md-2"></div>
              <div className="col-md-2 border rounded p-1">{ignorar}</div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Pedir
                <span className="float-end">(B-9)</span>
              </div>
              <div className="col-md-2"></div>
              <div className="col-md-2 border rounded p-1">{pedir}</div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Mostrar
                <span className="float-end">(B-12)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{mostrar}</div>
              <div className="col-md-2"></div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Iniciación espontánea de la atención conjunta
                <span className="float-end">(B-13)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{iniciacionEspontanea}</div>
              <div className="col-md-2 border rounded p-1">{iniciacionEspontanea2}</div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Respuesta a la atención conjunta
                <span className="float-end">(B-14)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{respuestaAtencion}</div>
              <div className="col-md-2"></div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Características de las iniciaciones sociales
                <span className="float-end">(B-15)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{caracteristicasIniciaciones}</div>
              <div className="col-md-2 border rounded p-1">{caracteristicasIniciaciones2}</div>
            </div>
            <div className="row g-2 mb-4">
              <div className="col-md-8">
                Cantidad de las iniciaciones sociales/familiar o cuidador
                <span className="float-end">(B-16b)</span>
              </div>
              <div className="col-md-2"></div>
              <div className="col-md-2 border rounded p-1">{cantidadIniciaciones}</div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Calidad general de la relación
                <span className="float-end">(B-18)</span>
              </div>
              <div className="col-md-2"></div>
              <div className="col-md-2 border rounded p-1">{calidadRelacion}</div>
            </div>
          </fieldset>

           {/* ============================= */}
            {/* TOTAL AFECTACIÓN SOCIAL (AS) */}
            {/* ============================= */}
            <fieldset className="border rounded p-3 bg-info ">
              <div className="row g-2">
                <div className="col-md-8 text-end fw-bold text-white">TOTAL AS:</div>
                <div className="col-md-2 border rounded p-1 text-white">{totalAS}</div>
                <div className="col-md-2 border rounded p-1 text-white">{totalAS2}</div>
              </div>
            </fieldset>

          {/* CRR */}
          <fieldset className="border rounded p-3">
            <legend className="w-auto px-2">Comportamiento Restringido y Repetitivo (CRR)</legend>

            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Entonación de las vocalizaciones o verbalizaciones
                <span className="float-end">(A-3)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{entonacion}</div>
              <div className="col-md-2"></div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Interés sensorial inusual en los materiales de juego o en las personas
                <span className="float-end">(D-1)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{interesSensorial}</div>
              <div className="col-md-2 border rounded p-1">{interesSensorial2}</div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Movimientos de manos y dedos / postura
                <span className="float-end">(D-2)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{movimientosManos}</div>
              <div className="col-md-2 border rounded p-1">{movimientosManos2}</div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-8">
                Intereses inusualmente repetitivos o comportamientos estereotipados
                <span className="float-end">(D-5)</span>
              </div>
              <div className="col-md-2 border rounded p-1">{interesesRepetitivos}</div>
            <div className="col-md-2 border rounded p-1">{interesesRepetitivos2}</div>

            </div>
          </fieldset>

            {/* ============================= */}
            {/* TOTAL COMPORTAMIENTO CRR */}
            {/* ============================= */}
            <fieldset className="border rounded p-3 bg-info">
              <div className="row row g-2 mb-2">
                <div className="col-md-8 text-end fw-bold text-white">TOTAL CRR:</div>
                <div className="col-md-2 border rounded p-1 text-white">{totalCRR}</div>
                <div className="col-md-2 border rounded p-1 text-white">{totalCRR2}</div>
              </div>
            </fieldset>

            {/* ================= */}
            {/* TOTAL GLOBAL (AS+CRR) */}
            {/* ================= */}
            <fieldset className="border rounded p-3 bg-primary mb-4">
              <div className="row g-2 mb-2">
                <div className="col-md-8 text-end fw-bold text-white">PUNTUACIÓN TOTAL GLOBAL (AS + CRR):</div>
                <div className="col-md-2 border rounded p-1 text-white">{totalGlobal}</div>
                <div className="col-md-2 border rounded p-1 text-white">{totalGlobal2}</div>
              </div>
            </fieldset>

            {/* ==================================== */}
            {/* OBSERVACIONES FINALES */}
            {/* ==================================== */}
            <fieldset className="border rounded p-3 mb-4">
              <legend className="w-auto px-2">Observaciones Finales</legend>
              <div className="row g-2 mb-2">
                <div className="col-md-4">Rango de preocupación:</div>
                <div className="col-md-8 border rounded p-2">{rangoPreocupacion}</div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-4">Impresión clínica:</div>
                <div className="col-md-8 border rounded p-2">{impresionClinica}</div>
              </div>
            </fieldset>

        </div>
      </div>
    </div>

    <Footer className="mt-auto" />
  </div>
);
}



