import { useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar_paciente";
 // Import the CSS file

// CSS para solo-pdf directamente en el archivo
const soloPdfStyles = `
.solo-pdf { display: none; }
@media print {
  .solo-pdf { display: block !important; }
}
`;

export default function ReportAdiR() {
  // Inyectar el CSS solo-pdf al cargar el componente
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = soloPdfStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const reportRef = useRef();
  const COLOR_BG = "#f8f9fa";

  // Datos personales (puedes reemplazar por props o estados)
  const nombres = "José Mario";
  const apellidos = "Morales Quezada";
  const fecha = "6 de junio de 2025";
  const telefono = "7907-6010";
  const especialista = "Lic. Juan Acevedo";

  // Ejemplo de variables para los ítems (debes completar con tus datos reales)
  // A1
  const miradaDirecta = 0, codMiradaDirecta = 0;
  const sonrisaSocial = 0, codSonrisaSocial = 0;
  const variedadExpresiones = 0, codVariedadExpresiones = 0;
  const totalA1 = 0;
  // A2
  const juegoImaginativo = 0, codJuegoImaginativo = 0;
  const interesNinos = 0, codInteresNinos = 0;
  const respuestaAproximaciones = 0, codRespuestaAproximaciones = 0;
  const juegoGrupo = 0, codJuegoGrupo = 0;
  const amistades = 0, codAmistades = 0;
  const totalA2 = 0;
  // A3
  const mostrarAtencion = 0, codMostrarAtencion = 0;
  const ofrecimientosCompartir = 0, codOfrecimientosCompartir = 0;
  const buscaCompartir = 0, codBuscaCompartir = 0;
  const totalA3 = 0;
  // A4
  const usoCuerpo = 0, codUsoCuerpo = 0;
  const ofrecimientoConsuelo = 0, codOfrecimientoConsuelo = 0;
  const calidadAcercamientos = 0, codCalidadAcercamientos = 0;
  const expresionesInapropiadas = 0, codExpresionesInapropiadas = 0;
  const cualidadRespuestas = 0, codCualidadRespuestas = 0;
  const totalA4 = 0;
  const totalA = 0;

  // B1
  const senalarInteres = 0, codSenalarInteres = 0;
  const asentirCabeza = 0, codAsentirCabeza = 0;
  const negarCabeza = 0, codNegarCabeza = 0;
  const gestosConvencionales = 0, codGestosConvencionales = 0;
  const totalB1 = 0;
  // B4
  const imitacionEspontanea = 0, codImitacionEspontanea = 0;
  const juegoImaginativoB4 = 0, codJuegoImaginativoB4 = 0;
  const juegoSocialImitativo = 0, codJuegoSocialImitativo = 0;
  const totalB4 = 0;
  // B2 (V)
  const verbalizacionSocial = 0, codVerbalizacionSocial = 0;
  const conversacionReciproca = 0, codConversacionReciproca = 0;
  const totalB2 = 0;
  // B3 (V)
  const expresionesEster = 0, codExpresionesEster = 0;
  const preguntasInapropiadas = 0, codPreguntasInapropiadas = 0;
  const inversionPronombres = 0, codInversionPronombres = 0;
  const neologismos = 0, codNeologismos = 0;
  const totalB3 = 0;
  // Totales B
  const totalBV = 0;
  const totalBNV = 0;

  // C1
  const preocupacionesInusuales = 0, codPreocupacionesInusuales = 0;
  const interesesCircunscritos = 0, codInteresesCircunscritos = 0;
  const totalC1 = 0;
  // C2
  const ritualesVerbales = 0, codRitualesVerbales = 0;
  const compulsionesRituales = 0, codCompulsionesRituales = 0;
  const totalC2 = 0;
  // C3
  const manierismosManos = 0, codManierismosManos = 0;
  const otrosManierismos = 0, codOtrosManierismos = 0;
  const totalC3 = 0;
  // C4
  const usoRepetitivoObjetos = 0, codUsoRepetitivoObjetos = 0;
  const interesesSensoriales = 0, codInteresesSensoriales = 0;
  const totalC4 = 0;
  const totalC = 0;

  // D
  const edadNotado = 0, codEdadNotado = 0;
  const edadPrimerasPalabras = 0, codEdadPrimerasPalabras = 0;
  const edadPrimerasFrases = 0, codEdadPrimerasFrases = 0;
  const edadAnormalidad = 0, codEdadAnormalidad = 0;
  const juicioEntrevistador = 0, codJuicioEntrevistador = 0;
  const totalD = 0;

  // Diagnóstico
  const diagnostico = "";

  // PDF
  const generarPDF = () => {
    if (!reportRef.current) return;
    const element = reportRef.current;
    const opt = {
      margin: 0.3,
      filename: "Reporte-ADI-R.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  // Estilos para totales
  const melonClaro = "#FFE5D0";
  const melonFuerte = "#FF8C69";
  const grisOscuro = "#6C6F73";

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: COLOR_BG }}>
      <Navbar />
      <div className="container my-4">
        <h1 className="text-center mb-2" style={{ color: melonFuerte, fontWeight: 700, fontSize: "2.5rem" }}>ADI - R</h1>
        <h4 className="text-center mb-4" style={{ color: melonFuerte }}>Entrevista para el diagnóstico de<br />Autismo - Revisada</h4>
        <div className="text-center mb-4">
          <button className="btn" style={{ backgroundColor: melonFuerte, color: "#fff" }} onClick={generarPDF}>
            Generar Reporte PDF
          </button>
        </div>
        <div>
          <div ref={reportRef} className="bg-white p-4">
            <div className="solo-pdf">
              <h1 className="text-center mb-2" style={{ color: melonFuerte, fontWeight: 700, fontSize: "2.5rem" }}>ADI - R</h1>
              <h4 className="text-center mb-4" style={{ color: melonFuerte }}>
                Entrevista para el diagnóstico de<br />Autismo - Revisada
              </h4>
            </div>
            {/* Datos personales */}
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

            {/* SECCIÓN A */}
            <h5 className="mt-4 mb-2 fw-bold" style={{ color: melonFuerte }}>A. ALTERACIONES CUALITATIVAS DE LA INTERACCIÓN SOCIAL RECÍPROCA</h5>
            {/* A.1 */}
            <div className="fw-bold mt-3">A.1 Incapacidad para utilizar conductas no verbales en la regulación de la interacción social</div>
            <div className="row g-2 align-items-center">
              <div className="col-1">50</div>
              <div className="col-6">Mirada directa</div>
              <div className="col-2 text-center border rounded p-1 mb-2"> {codMiradaDirecta} </div>
              <div className="col-2 text-center border rounded p-1 mb-2"> {miradaDirecta} </div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">51</div>
              <div className="col-6">Sonrisa social</div>
              <div className="col-2 text-center border rounded p-1"> {codSonrisaSocial} </div>
              <div className="col-2 text-center border rounded p-1"> {sonrisaSocial} </div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">57</div>
              <div className="col-6">Variedad de expresiones faciales usadas para comunicarse</div>
              <div className="col-2 text-center border rounded p-1"> {codVariedadExpresiones} </div>
              <div className="col-2 text-center border rounded p-1"> {variedadExpresiones} </div>
            </div>
            <fieldset className="border rounded p-3 my-2" style={{ background: melonClaro }}>
              <div className="row">
                <div className="col-7 text-end fw-bold" style={{ color: melonFuerte }}>TOTAL A1</div>
                <div className="border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalA1}</div>
              </div>
            </fieldset>

            {/* A.2 */}
            <div className="fw-bold mt-3">A.2 Incapacidad para desarrollar relaciones con sus iguales</div>
            <div className="row g-2 align-items-center">
              <div className="col-1">49</div>
              <div className="col-6">Juego imaginativo con sus iguales</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codJuegoImaginativo}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{juegoImaginativo}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">62</div>
              <div className="col-6">Interés por otros niños</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codInteresNinos}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{interesNinos}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">63</div>
              <div className="col-6">Respuesta a las aproximaciones de otros niños</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codRespuestaAproximaciones}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{respuestaAproximaciones}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">64</div>
              <div className="col-6">Juego en grupo con sus iguales (puntúe si tiene entre 4 años, 0 meses y 9 años, 11 meses)</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codJuegoGrupo}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{juegoGrupo}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">65</div>
              <div className="col-6">Amistades (puntúe si tiene 10 años o más)</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codAmistades}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{amistades}</div>
            </div>
            <fieldset className="border rounded p-3 my-2" style={{ background: melonClaro }}>
              <div className="row">
                <div className="col-7 text-end fw-bold" style={{ color: melonFuerte }}>TOTAL A2</div>
                <div className="border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalA2}</div>
              </div>
            </fieldset>

            {/* A.3 */}
            <div className="fw-bold mt-3">A.3 Falta de goce o placer compartido</div>
            <div className="row g-2 align-items-center">
              <div className="col-1">52</div>
              <div className="col-6">Mostrar y dirigir la atención</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codMostrarAtencion}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{mostrarAtencion}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">53</div>
              <div className="col-6">Ofrecimientos para compartir</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codOfrecimientosCompartir}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{ofrecimientosCompartir}</div>
            </div>
            <div className="row g-2 align-items-center mb-4">
              <div className="col-1">54</div>
              <div className="col-6">Busca compartir su deleite o goce con otros</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codBuscaCompartir}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{buscaCompartir}</div>
            </div>
            <fieldset className="border rounded p-3" style={{ background: melonClaro, marginTop: "40px" }}>
              <div className="row">
                <div className="col-7 text-end fw-bold" style={{ color: melonFuerte }}>TOTAL A3</div>
                <div className="border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalA3}</div>
              </div>
            </fieldset>

            {/* A.4 */}
            <div className="fw-bold mt-3">A.4 Falta de reciprocidad socio-emocional</div>
            <div className="row g-2 align-items-center">
              <div className="col-1">31</div>
              <div className="col-6">Uso del cuerpo de otra persona para comunicarse</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codUsoCuerpo}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{usoCuerpo}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">55</div>
              <div className="col-6">Ofrecimiento de consuelo</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codOfrecimientoConsuelo}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{ofrecimientoConsuelo}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">56</div>
              <div className="col-6">Calidad de los acercamientos sociales</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codCalidadAcercamientos}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{calidadAcercamientos}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">58</div>
              <div className="col-6">Expresiones faciales inapropiadas</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codExpresionesInapropiadas}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{expresionesInapropiadas}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">59</div>
              <div className="col-6">Cualidad apropiada de las respuestas sociales</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codCualidadRespuestas}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{cualidadRespuestas}</div>
            </div>
            <fieldset className="border rounded p-3 my-2" style={{ background: melonClaro }}>
              <div className="row">
                <div className="col-7 text-end fw-bold" style={{ color: melonFuerte }}>TOTAL A4</div>
                <div className="border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalA4}</div>
              </div>
            </fieldset>

            {/* TOTAL A */}
            <fieldset className="border rounded p-3 my-3" style={{ background: melonFuerte }}>
              <div className="row">
                <div className="col-7 text-end fw-bold text-white">TOTAL A (A1+A2+A3+A4)</div>
                <div className="col-2 border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalA}</div>
              </div>
            </fieldset>

            {/* SECCIÓN B */}
            <h5 className="mt-4 mb-2 fw-bold" style={{ color: melonFuerte }}>B. ALTERACIONES CUALITATIVAS DE LA COMUNICACIÓN</h5>
            {/* B.1 */}
            <div className="fw-bold mt-3">B.1 Falta o retraso del lenguaje hablado e incapacidad para comunicarse</div>
            <div className="row g-2 align-items-center">
              <div className="col-1">42</div>
              <div className="col-6">Señalar para expresar interés</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codSenalarInteres}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{senalarInteres}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">43</div>
              <div className="col-6">Asentir con la cabeza</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codAsentirCabeza}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{asentirCabeza}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">44</div>
              <div className="col-6">Negar con la cabeza</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codNegarCabeza}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{negarCabeza}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">45</div>
              <div className="col-6">Gestos convencionales / instrumentales</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codGestosConvencionales}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{gestosConvencionales}</div>
            </div>
            <fieldset className="border rounded p-3 my-2" style={{ background: melonClaro }}>
              <div className="row">
                <div className="col-7 text-end fw-bold" style={{ color: melonFuerte }}>TOTAL B1</div>
                <div className="border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalB1}</div>
              </div>
            </fieldset>

            {/* B.4 */}
            <div className="fw-bold mt-3">B.4 Falta de juego imaginativo o juego social imitativo espontáneo</div>
            <div className="row g-2 align-items-center">
              <div className="col-1">47</div>
              <div className="col-6">Imitación espontánea de acciones</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codImitacionEspontanea}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{imitacionEspontanea}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">48</div>
              <div className="col-6">Juego imaginativo</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codJuegoImaginativoB4}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{juegoImaginativoB4}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">61</div>
              <div className="col-6">Juego social imitativo</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codJuegoSocialImitativo}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{juegoSocialImitativo}</div>
            </div>
            <fieldset className="border rounded p-3 my-2" style={{ background: melonClaro }}>
              <div className="row">
                <div className="col-7 text-end fw-bold" style={{ color: melonFuerte }}>TOTAL B4</div>
                <div className="border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalB4}</div>
              </div>
            </fieldset>

            {/* SOLO EN SUJETOS "VERBALES" */}
            <h6 className="mt-4 mb-2 fw-bold" style={{ color: melonFuerte }}>SÓLO EN SUJETOS "VERBALES"</h6>
            {/* B.2 (V) */}
            <div className="fw-bold mt-3">B.2 (V). Incapacidad relativa para iniciar o sostener un intercambio conversacional</div>
            <div className="row g-2 align-items-center">
              <div className="col-1">34</div>
              <div className="col-6">Verbalización social / charla</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codVerbalizacionSocial}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{verbalizacionSocial}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">35</div>
              <div className="col-6">Conversación recíproca</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codConversacionReciproca}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{conversacionReciproca}</div>
            </div>
            <fieldset className="border rounded p-3 my-2" style={{ background: melonClaro }}>
              <div className="row">
                <div className="col-7 text-end fw-bold" style={{ color: melonFuerte }}>TOTAL B2</div>
                <div className="border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalB2}</div>
              </div>
            </fieldset>

            {/* B.3 (V) */}
            <div className="fw-bold mt-3">B.3 (V). Habla estereotipada, repetitiva e idiosincrásica</div>
            <div className="row g-2 align-items-center">
              <div className="col-1">33</div>
              <div className="col-6">Expresiones estereotipadas y ecolalia diferida</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codExpresionesEster}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{expresionesEster}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">36</div>
              <div className="col-6">Preguntas o expresiones inapropiadas</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codPreguntasInapropiadas}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{preguntasInapropiadas}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">37</div>
              <div className="col-6">Inversión de pronombres</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codInversionPronombres}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{inversionPronombres}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">38</div>
              <div className="col-6">Neologismos / Lenguaje idiosincrasico</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codNeologismos}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{neologismos}</div>
            </div>
            <fieldset className="border rounded p-3 my-2" style={{ background: melonClaro }}>
              <div className="row">
                <div className="col-7 text-end fw-bold" style={{ color: melonFuerte }}>TOTAL B3</div>
                <div className="border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalB3}</div>
              </div>
            </fieldset>

            {/* EN SUJETOS "VERBALES" TOTAL VERBAL B(V) */}
            <fieldset className="border rounded p-3 my-3" style={{ background: melonFuerte }}>
              <div className="row">
                <div className="col-7 text-end fw-bold text-white">EN SUJETOS "VERBALES" TOTAL VERBAL B(V)</div>
                <div className=" border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalBV}</div>
              </div>
            </fieldset>
            {/* EN SUJETOS "NO VERBALES" TOTAL NO VERBAL B (NV) */}
            <fieldset className="border rounded p-3 my-3" style={{ background: melonFuerte }}>
              <div className="row">
                <div className="col-7 text-end fw-bold text-white">EN SUJETOS "NO VERBALES" TOTAL NO VERBAL B (NV)</div>
                <div className=" border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px", height: "35px" }}>{totalBNV}</div>
              </div>
            </fieldset>

            {/* SECCIÓN C */}
            <h5 className="mt-4 mb-2 fw-bold" style={{ color: melonFuerte }}>C. PATRONES DE CONDUCTA RESTRINGIDOS, REPETITIVOS Y ESTEREOTIPADOS</h5>
            {/* C.1 */}
            <div className="fw-bold mt-3">C.1 Preocupación absorbente o patrón de intereses circunscrito</div>
            <div className="row g-2 align-items-center">
              <div className="col-1">67</div>
              <div className="col-6">Preocupaciones inusuales</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codPreocupacionesInusuales}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{preocupacionesInusuales}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">68</div>
              <div className="col-6">Intereses circunscritos (puntue solamente si tiene 3 años o más)</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codInteresesCircunscritos}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{interesesCircunscritos}</div>
            </div>
            <fieldset className="border rounded p-3 my-2" style={{ background: melonClaro }}>
              <div className="row">
                <div className="col-7 text-end fw-bold" style={{ color: melonFuerte }}>TOTAL C1</div>
                <div className="border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalC1}</div>
              </div>
            </fieldset>

            {/* C.2 */}
            <div className="fw-bold mt-3">C.2 Adhesión aparentemente compulsiva a rutinas o rituales no funcionales</div>
            <div className="row g-2 align-items-center mb-4">
              <div className="col-1">39</div>
              <div className="col-6">Rituales verbales (puntue solamente si el elemento 30=0)</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codRitualesVerbales}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{ritualesVerbales}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">70</div>
              <div className="col-6">Compulsiones / Rituales</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codCompulsionesRituales}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{compulsionesRituales}</div>
            </div>
            <fieldset className="border rounded p-3 my-2" style={{ background: melonClaro }}>
              <div className="row">
                <div className="col-7 text-end fw-bold" style={{ color: melonFuerte }}>TOTAL C2</div>
                <div className="border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalC2}</div>
              </div>
            </fieldset>

            {/* C.3 */}
            <div className="fw-bold mt-3">C.3 Manierismos motores estereotipados y repetitivos</div>
            <div className="row g-2 align-items-center">
              <div className="col-1">77</div>
              <div className="col-6">Manierismos de manos y dedos</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codManierismosManos}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{manierismosManos}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">78</div>
              <div className="col-6">Otros manierismos complejos o movimientos estereotipados del cuerpo</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codOtrosManierismos}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{otrosManierismos}</div>
            </div>
            <fieldset className="border rounded p-3 my-2" style={{ background: melonClaro }}>
              <div className="row">
                <div className="col-7 text-end fw-bold" style={{ color: melonFuerte }}>TOTAL C3</div>
                <div className="border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalC3}</div>
              </div>
            </fieldset>

            {/* C.4 */}
            <div className="fw-bold mt-3">C.4 Preocupaciones con parte de objetos o elementos no funcionales</div>
            <div className="row g-2 align-items-center">
              <div className="col-1">69</div>
              <div className="col-6">Uso repetitivo de objetos o interés en partes de objetos</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codUsoRepetitivoObjetos}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{usoRepetitivoObjetos}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">71</div>
              <div className="col-6">Intereses sensoriales inusuales</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codInteresesSensoriales}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{interesesSensoriales}</div>
            </div>
            <fieldset className="border rounded p-3 my-2" style={{ background: melonClaro }}>
              <div className="row">
                <div className="col-7 text-end fw-bold" style={{ color: melonFuerte }}>TOTAL C4</div>
                <div className="border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalC4}</div>
              </div>
            </fieldset>

            {/* TOTAL C */}
            <fieldset className="border rounded p-3 my-3" style={{ background: melonFuerte }}>
              <div className="row">
                <div className="col-7 text-end fw-bold text-white">TOTAL C (C1+C2+C3+C4)</div>
                <div className=" border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalC}</div>
              </div>
            </fieldset>

            {/* SECCIÓN D */}
            <h5 className="mt-4 mb-2 fw-bold" style={{ color: melonFuerte }}>D. ALTERACIONES EN EL DESARROLLO EVIDENTES A LOS 36 MESES O ANTES</h5>
            <div className="row g-2 align-items-center">
              <div className="col-1">2</div>
              <div className="col-6">Edad en que los padres lo notaron por primera vez (si &lt;36 meses, puntue 1)</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codEdadNotado}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{edadNotado}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">9</div>
              <div className="col-6">Edad de las primeras palabras (si &gt;24 meses, puntúe 1)</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codEdadPrimerasPalabras}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{edadPrimerasPalabras}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">10</div>
              <div className="col-6">Edad de las primeras frases (si &gt;33 meses, puntúe 1)</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codEdadPrimerasFrases}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{edadPrimerasFrases}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">86</div>
              <div className="col-6">Edad en que la anormalidad se hizo evidente por primera vez (si el código fue 3 ó 4, puntúe 1)</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codEdadAnormalidad}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{edadAnormalidad}</div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-1">87</div>
              <div className="col-6">Juicio del entrevistador sobre la edad en que se manifestaron por primera vez las anormalidades (si &lt;36 meses, puntue 1)</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{codJuicioEntrevistador}</div>
              <div className="col-2 text-center border rounded p-1 mb-2">{juicioEntrevistador}</div>
            </div>
            <fieldset className="border rounded p-3 mt-4" style={{ background: grisOscuro, marginBottom: "40px" }}>
              <div className="row">
                <div className="col-7 text-end fw-bold text-white">TOTAL D</div>
                <div className="col-2 border rounded p-1 text-center" style={{ background: "#fff", color: "#000", width: "220px" }}>{totalD}</div>
              </div>
            </fieldset>

            {/* Diagnóstico */}
            <fieldset className="border rounded p-3 my-4">
              <legend className="w-auto px-2">Diagnóstico</legend>
              <div className="p-2">{diagnostico}</div>
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