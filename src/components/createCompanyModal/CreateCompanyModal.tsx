import { useForm } from "react-hook-form";
import { FiBriefcase, FiX, FiCheck } from "react-icons/fi";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../config/axios.ts";
import ErrorMessage from "../errorMessage/ErrorMessage.tsx";
import type { CompanyFormData } from "../../types/types.ts";

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyCreated: (id: string) => void;
}

const initialValuesCompanyForm: CompanyFormData = {
  companyname: "",
  address: "",
  owner: "",
  canvas: "",
};

export default function CreateCompanyModal({ isOpen, onClose, onCompanyCreated }: CreateCompanyModalProps) {
  const queryClient = useQueryClient();
  
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({ defaultValues: initialValuesCompanyForm });

  if (!isOpen) return null;

  const handleCreateCompanySubmit = async (formData: CompanyFormData) => {
    try {
      const { data: resData } = await api.post(`/api/v1/companies`, formData);
      toast.success(resData.message || "Organización guardada correctamente");
      
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      
      if (resData.company?._id) {
        onCompanyCreated(resData.company._id);
      }

      handleClose();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Error al crear la empresa");
      } else {
        toast.error("Error de conexión con el servidor");
      }
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400">
            <FiBriefcase size={18} />
            <h4 className="font-bold text-white text-base">Crear Nueva Compañía</h4>
          </div>
          <button type="button" onClick={handleClose} className="text-slate-400 hover:text-white transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(handleCreateCompanySubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Nombre de la Empresa *
            </label>
            <input
              type="text"
              placeholder="Ej: Magnus MT S.A."
              className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
              {...register("companyname", { required: "El nombre de la empresa es obligatorio" })}
            />
            {errors.companyname && <ErrorMessage>{errors.companyname.message}</ErrorMessage>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Dirección Física
            </label>
            <input
              type="text"
              placeholder="Ej: Planta Industrial, Celdas Alfa"
              className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
              {...register("address", { required: "La dirección es obligatoria" })}
            />
            {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end mt-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-cyan-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors shadow-lg shadow-cyan-400/10"
            >
              <FiCheck /> Guardar Organización
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}