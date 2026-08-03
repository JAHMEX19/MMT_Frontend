import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  FiArrowLeft, FiCpu, FiEdit3, FiSliders, 
  FiActivity, FiCopy, FiCheckCircle, FiClock, FiPlus,
  FiFileText, FiRadio, FiX
} from "react-icons/fi";
import api from "../../config/axios";
import Loading from "../../components/loading/Loading.tsx";
import DynamicForm from "../../components/DynamicForm/DynamicForm.tsx";

// =========================================================================
// INTERFACES DE DATOS
// =========================================================================
interface MetricConfig {
  key: string;
  label: string;
  type: "number" | "string" | "boolean";
  unit?: string;
}

interface ProcessData {
  _id: string;
  name: string;
  description?: string;
  sourceType?: "Manual" | "IoT";
  metricsConfig: MetricConfig[];
}

export default function ProcessDetailView() {
  const { processId } = useParams<{ processId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- ESTADOS LOCALES ---
  const [activeTab, setActiveTab] = useState<"capture" | "config">("capture");
  const [activeIngestMode, setActiveIngestMode] = useState<"none" | "manual" | "iot">("none");
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  // 1. OBTENER INFORMACIÓN DEL PROCESO
  const { data: process, isLoading, isError } = useQuery<ProcessData>({
    queryKey: ["process", processId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/process/${processId}`);
      return response.data;
    },
    enabled: !!processId,
  });

  // 2. MUTACIÓN PARA REGISTRAR LECTURAS MANUALES
  const { mutate: saveLog } = useMutation({
    mutationFn: async (formData: Record<string, unknown>) => {
      return await api.post(`/logs`, {
        processId,
        data: formData,
        timestamp: new Date(),
      });
    },
    onSuccess: () => {
      toast.success("Registro operacional guardado con éxito");
      queryClient.invalidateQueries({ queryKey: ["processLogs", processId] });
      setActiveIngestMode("none"); // Cerramos el formulario al enviar
    },
    onError: () => {
      toast.error("Error al guardar la lectura");
    },
  });

  const handleCopyEndpoint = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(true);
    toast.success("Endpoint copiado al portapapeles");
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  if (isLoading) return <Loading />;
  
  if (isError || !process) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] w-full gap-4">
        <p className="text-slate-400 font-mono text-sm">No se pudo cargar la telemetría de este proceso.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400 hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
        >
          <FiArrowLeft /> Regresar al Lienzo VSM
        </button>
      </div>
    );
  }

  const endpointUrl = `https://api.magnusmt.com/api/v1/telemetry/${process._id}`;

  return (
    // CAMBIO CLAVE: 'h-[calc(100vh-7rem)] w-full' fija el contenedor al alto total de pantalla
    <div className="flex flex-col gap-4 h-[calc(100vh-7rem)] w-full select-none animate-fadeIn">
      
      {/* =========================================================================
          1. ENCABEZADO Y NAVEGACIÓN (SHRINK-0)
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/80 pb-4 gap-4 shrink-0 w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Volver al lienzo"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              CORTEX MMT • MONITOREO DE OPERACIÓN
            </span>
            <h1 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              {process.name}
            </h1>
          </div>
        </div>

        {/* PESTAÑAS DE VISTA GENERAL */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("capture")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "capture" ? "bg-slate-800 text-cyan-400 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <FiActivity size={14} /> Consola Operativa
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "config" ? "bg-slate-800 text-cyan-400 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <FiSliders size={14} /> Configuración de Métricas
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. SECCIÓN OPERATIVA PANTALLA COMPLETA (FLEX-1 MIN-H-0)
          ========================================================================= */}
      {activeTab === "capture" ? (
        <div className="flex-1 flex flex-col gap-4 min-h-0 w-full">
          
          {/* BARRA DE MENÚ DE INGESTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
            
            {/* Opción 1: Formulario Simple */}
            <div 
              onClick={() => setActiveIngestMode(activeIngestMode === "manual" ? "none" : "manual")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                activeIngestMode === "manual" 
                  ? "bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-950/40" 
                  : "bg-slate-900/60 hover:bg-slate-900 border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 rounded-xl">
                  <FiFileText size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Formulario Manual</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Captura datos directamente en planta</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeIngestMode === "manual" ? "bg-cyan-400 text-slate-950" : "bg-slate-800 text-slate-300"
              }`}>
                {activeIngestMode === "manual" ? "Abierto" : "+ Abrir"}
              </span>
            </div>

            {/* Opción 2: Dispositivo IoT */}
            <div 
              onClick={() => setActiveIngestMode(activeIngestMode === "iot" ? "none" : "iot")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                activeIngestMode === "iot" 
                  ? "bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-950/40" 
                  : "bg-slate-900/60 hover:bg-slate-900 border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-xl">
                  <FiRadio size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Dispositivo IoT / ESP32</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Conecta sensores y telemetría en línea</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeIngestMode === "iot" ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-300"
              }`}>
                {activeIngestMode === "iot" ? "Conectado" : "+ Vincular"}
              </span>
            </div>

          </div>

          {/* ÁREA DESPLEGABLE DE INGESTA DINÁMICA (SHRINK-0 CON MAX-H) */}
          {activeIngestMode !== "none" && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-md relative shrink-0 animate-fadeIn max-h-[40vh] overflow-y-auto">
              <button 
                onClick={() => setActiveIngestMode("none")}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                <FiX size={16} />
              </button>

              {activeIngestMode === "manual" && (
                <div className="max-w-xl space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <FiEdit3 className="text-cyan-400" /> Nuevo Registro Operacional
                  </h3>
                  <DynamicForm 
                    metricsConfig={process.metricsConfig} 
                    onSubmitLog={(formData) => saveLog(formData)}
                  />
                </div>
              )}

              {activeIngestMode === "iot" && (
                <div className="space-y-3 max-w-2xl">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <FiCpu className="text-emerald-400" /> Ingesta Automática de Telemetría IoT
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Configura tu microcontrolador (ESP32 / Arduino / MMT Core) para realizar peticiones POST en tiempo real.
                  </p>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Endpoint POST de Ingesta:</span>
                    <div className="flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      <code className="text-xs text-emerald-400 font-mono truncate">{endpointUrl}</code>
                      <button
                        onClick={() => handleCopyEndpoint(endpointUrl)}
                        className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                        title="Copiar Endpoint"
                      >
                        {copiedEndpoint ? <FiCheckCircle className="text-emerald-400" size={15} /> : <FiCopy size={15} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CONTENEDOR EXPANSIBLE DE HISTORIAL Y KPIS (FLEX-1 MIN-H-0) */}
          <div className="flex-1 flex flex-col gap-4 min-h-0 w-full">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4 shrink-0">
              <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Eficiencia OEE</span>
                <p className="text-lg font-extrabold text-cyan-400 mt-0.5">92.4%</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Takt Time Estándar</span>
                <p className="text-lg font-extrabold text-amber-400 mt-0.5">45 seg</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Último Registro</span>
                <p className="text-lg font-extrabold text-emerald-400 mt-0.5">Hace 2m</p>
              </div>
            </div>

            {/* Tabla de Histórico / Ocupa todo el espacio vertical restante */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex-1 min-h-0 flex flex-col justify-between w-full">
              <div className="shrink-0">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <FiClock className="text-cyan-400" /> Historial de Transacciones e Ingesta
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Registros generados dinámicamente por formularios o telemetría.
                </p>
              </div>

              <div className="my-4 flex-1 border border-dashed border-slate-800/80 rounded-xl bg-slate-950/40 flex items-center justify-center text-slate-500 font-mono text-xs w-full">
                [ Tabla Dinámica de Transacciones / ApexCharts ]
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* =========================================================================
           3. SECCIÓN DE CONFIGURACIÓN DE PARÁMETROS
           ========================================================================= */
        <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-6 overflow-y-auto">
          <div>
            <h3 className="text-base font-bold text-white">Configuración del Proceso MMT</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Define las variables requeridas para los formularios y telemetría automatizada.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Variables y Métricas Configuradas ({process.metricsConfig.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {process.metricsConfig.map((metric) => (
                <div key={metric.key} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{metric.label}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Llave: <code className="text-slate-300">{metric.key}</code> ({metric.type})
                    </span>
                  </div>
                  {metric.unit && (
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded-lg">
                      {metric.unit}
                    </span>
                  )}
                </div>
              ))}

              <button className="border border-dashed border-slate-800 hover:border-cyan-500/50 p-3.5 rounded-xl text-slate-400 hover:text-cyan-400 flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer bg-slate-950/30">
                <FiPlus size={16} /> Añadir Variable
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}