import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../config/axios";
import Loading from "../../components/loading/Loading.tsx";
import DynamicForm from "../../components/DynamicForm/DynamicForm.tsx";


// Tipados para TypeScript enfocados en MMT System
interface MetricConfig {
  key: string;
  label: string;
  type: "number" | "string" | "boolean";
}

interface ProcessData {
  _id: string;
  name: string;
  sourceType: "Manual" | "IoT";
  metricsConfig: MetricConfig[];
}

export default function ProcessDetailView() {
  const { processId } = useParams<{ processId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. OBTENER CONFIGURACIÓN DEL PROCESO DESDE EL BACKEND
  const { data: process, isLoading, isError } = useQuery<ProcessData>({
    queryKey: ["process", processId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/process/${processId}`);
      return response.data;
    },
    enabled: !!processId, // Solo ejecuta la query si existe un ID en la URL
  });

  // 2. MUTACIÓN PARA GUARDAR NUEVOS REGISTROS (LOGS / LECTURAS)
  const { mutate } = useMutation({
    mutationFn: async (formData: Record<string, unknown>) => {
      // Enviamos el timestamp y los datos dinámicos agrupados en la llave 'data'
      return await api.post(`/logs`, {
        processId,
        data: formData,
        timestamp: new Date(),
      });
    },
    onSuccess: () => {
      toast.success("Registro operacional guardado con éxito");
      // Invalidamos la caché de lecturas para que las tablas/gráficas se actualicen solas
      queryClient.invalidateQueries({ queryKey: ["processLogs", processId] });
    },
    onError: () => {
      toast.error("Error al guardar las métricas del proceso");
    },
  });

  if (isLoading) return <Loading />;
  if (isError || !process) {
    toast.error("No se pudo cargar la información del proceso");
    return <button onClick={() => navigate(-1)} className="text-cyan-400">Volver al Lienzo</button>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado del Proceso */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <span className="text-xs font-mono text-cyan-500 uppercase tracking-wider">Monitoreo de Proceso</span>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">{process.name}</h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${process.sourceType === "IoT" ? "bg-green-400" : "bg-amber-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${process.sourceType === "IoT" ? "bg-green-500" : "bg-amber-500"}`}></span>
          </span>
          <span className="text-sm font-medium text-slate-300">Origen: {process.sourceType}</span>
        </div>
      </div>

      {/* Grid Operacional */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Captura Dinámica */}
        <div className="lg:col-span-1">
          {process.sourceType === "Manual" ? (
            <DynamicForm 
              metricsConfig={process.metricsConfig} 
              onSubmitLog={(formData) => mutate(formData)} 
            />
          ) : (
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 font-bold">
                IoT
              </div>
              <p className="text-sm text-slate-400">
                Este proceso está configurado para telemetría automatizada. Los dispositivos de hardware envían datos directamente a la API.
              </p>
              <div className="text-left bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-500 block font-mono">Endpoint de Ingesta:</span>
                <code className="text-xs text-green-400 font-mono break-all">POST /api/v1/telemetry/{process._id}</code>
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Panel de Historial e Indicadores (Añadiremos gráficas/tablas después) */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Histórico de Rendimiento</h3>
            <p className="text-sm text-slate-400 mt-1">
              Visualización de variables y analíticas en tiempo real para la optimización Lean.
            </p>
          </div>
          
          <div className="h-48 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-sm font-mono bg-slate-950/40 my-6">
            [ Espacio listo para Tabla Dinámica / ApexCharts ]
          </div>
        </div>

      </div>
    </div>
  );
}