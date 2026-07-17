import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FiGitCommit, FiX, FiCheck } from "react-icons/fi";
import api from "../../config/axios"; 
import { isAxiosError } from "axios";
import ErrorMessage from "../errorMessage/ErrorMessage"; 

interface CreateProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string; 
  onProcessCreated: (newProcess: unknown) => void; 
}

// Actualizamos la interfaz del formulario con la propiedad sourceType
interface ProcessFormData {
  name: string;
  description: string;
  sourceType: "Manual" | "IoT"; // <-- Nueva decisión operativa
}

export default function CreateProcessModal({
  isOpen,
  onClose,
  departmentId,
  onProcessCreated,
}: CreateProcessModalProps) {
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProcessFormData>({
    defaultValues: {
      name: "",
      description: "",
      sourceType: "Manual", // <-- Por defecto inicia en Manual
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: ProcessFormData) => {
    try {
      // Petición POST enviando todos los datos combinados al backend
      const response = await api.post(`/api/v1/process/`, {
        name: data.name,
        description: data.description,
        departmentId, 
        sourceType: data.sourceType, // <-- Pasamos el origen seleccionado
        metricsConfig: [] // Opcional: Inicia vacío para configurarse dentro del detalle del proceso
      });

      toast.success(response.data.message || "Subproceso añadido a la celda");
      
      onProcessCreated(response.data.process);
      reset();
      onClose();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || "Error al crear el proceso");
      } else {
        toast.error("Ocurrió un error inesperado en el servidor");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-950/40 border border-amber-500/30 text-amber-400 rounded-lg">
              <FiGitCommit size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Instanciar Flujo Lean</h3>
              <p className="text-[11px] text-slate-400">Añade un bloque operativo secuencial</p>
            </div>
          </div>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
          
          {/* Campo: Nombre del Proceso */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-slate-300">
              Nombre de la Operación / Tarea
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ej: Rectificado de chasis, Inspección visual..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
              {...register("name", {
                required: "El nombre de la operación es obligatorio",
                minLength: {
                  value: 3,
                  message: "Debe contener al menos 3 caracteres",
                },
              })}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          {/* Campo: Descripción del Proceso */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-xs font-semibold text-slate-300">
              Descripción del Ciclo o Standard Work
            </label>
            <textarea
              id="description"
              rows={2}
              placeholder="Detalla las etapas o tolerancias esperadas..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all resize-none"
              {...register("description")}
            />
          </div>

          {/* NUEVO CAMPO: Selector de Origen de Ingesta */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sourceType" className="text-xs font-semibold text-slate-300">
              Captura de Datos (Origen)
            </label>
            <select
              id="sourceType"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-xs text-slate-300 outline-none transition-all cursor-pointer"
              {...register("sourceType")}
            >
              <option value="Manual">Captura Manual (Formulario en Planta)</option>
              <option value="IoT">Telemetría Automatizada (Dispositivos IoT)</option>
            </select>
          </div>

          <p className="text-[10px] text-slate-500 bg-slate-950/30 border border-slate-800/40 p-3 rounded-xl italic leading-relaxed">
            * MMT Core posicionará este subproceso verticalmente en la base de la columna del departamento seleccionado.
          </p>

          {/* Barra de Acciones */}
          <div className="flex gap-3 justify-end pt-3 border-t border-slate-800/60 mt-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-transparent border border-slate-800 hover:bg-slate-800 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-lg shadow-amber-500/10 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <FiCheck size={14} />
              {isSubmitting ? "Guardando..." : "Desplegar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}