import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FiGrid, FiX, FiCheck } from "react-icons/fi";
import api from "../../config/axios"; // Ajusta la ruta según tu estructura
import { isAxiosError } from "axios";
import ErrorMessage from "../errorMessage/ErrorMessage"; // Ajusta la ruta según tu estructura

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasId: string;
  companyId: string;
  onDepartmentCreated: (newDepartmentNode: unknown) => void; // Para actualizar el state del Canvas inmediatamente
}

interface DepartmentFormData {
  name: string;
}

export default function CreateDepartmentModal({
  isOpen,
  onClose,
  canvasId,
  companyId,
  onDepartmentCreated,
}: CreateDepartmentModalProps) {
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormData>({
    defaultValues: {
      name: "",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      // Petición al backend adaptada a tu controlador optimizado
      const response = await api.post(`/api/v1/department/${canvasId}/departments`, {
        name: data.name,
        companyId,
      });

      toast.success(response.data.message || "Departamento creado con éxito");
      
      // Inyectamos el nuevo nodo directamente en el estado del OperationalCanvas sin recargar la página
      onDepartmentCreated(response.data.node);
      
      reset();
      onClose();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Error al crear el departamento");
      } else {
        toast.error("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer click dentro del modal
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-950/40 border border-blue-500/30 text-blue-400 rounded-lg">
              <FiGrid size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Crear Departamento</h3>
              <p className="text-[11px] text-slate-400">Instancia una nueva área de trabajo</p>
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs font-semibold text-slate-300">
              Nombre del Departamento o Celda
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ej: Línea de Ensamble A, Control de Calidad..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
              {...register("name", {
                required: "El nombre del departamento es obligatorio",
                minLength: {
                  value: 3,
                  message: "Debe contener al menos 3 caracteres",
                },
              })}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed italic bg-slate-950/30 border border-slate-800/40 p-3 rounded-xl">
            * Al crearse, el departamento se ubicará automáticamente al final de la cadena de valor en tu cuadrícula operativa.
          </p>

          {/* Acciones */}
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-800/60">
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
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-905 bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-slate-950 rounded-xl shadow-lg shadow-cyan-500/10 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <FiCheck size={14} />
              {isSubmitting ? "Creando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}