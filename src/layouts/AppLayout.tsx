import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { FiBriefcase, FiX, FiCheck } from "react-icons/fi";
import NavbarComp from "../components/navbar/NavbarComp";
import SidebarComp from "../components/sidebar/SidebarComp";
import type { CompanyFormData } from "../types/types.ts";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import api from "../config/axios.ts";
import { isAxiosError } from "axios";
import ErrorMessage from "../components/errorMessage/ErrorMessage.tsx";
import { Toaster } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/MainApi.ts";
import Loading from "../components/loading/Loading.tsx";

export default function AppLayout() {
  // =========================================================================
  // 1. TODOS LOS HOOKS EN LA PARTE SUPERIOR (Reglas estricta de React)
  // =========================================================================

  // Petición para validar al usuario logueado
  const { data, isLoading, isError } = useQuery({
    queryFn: getUser,
    queryKey: ["user"],
    retry: 3, // Reintenta 3 veces en caso de fallo
    refetchOnWindowFocus: false,
  });

  // Configuración de React Hook Form
  const initialValuesCompanyForm = {
    companyname: "",
    address: "",
    owner: "",
    canvas: "",
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({ defaultValues: initialValuesCompanyForm });

  // Estados de interfaz locales
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // =========================================================================
  // 2. VALIDACIONES DE ESTADO (Elimina el parpadeo por completo)
  // =========================================================================

  if (isLoading) {
    // Retorna el Loader de Magnus MMT. Bloquea el HTML inferior para que no se "asome"
    return <Loading />;
  }

  if (isError) {
    // Redirección segura en caso de fallo de autenticación
    return <Navigate to="/auth/login" />;
  }

  // =========================================================================
  // 3. MANEJADORES DE ACCIONES (SUBMIT)
  // =========================================================================

  const handleCreateCompanySubmit = async (formData: CompanyFormData) => {
    try {
      const { data } = await api.post(`/api/v1/companies`, formData);
      toast.success(data.message || "Empresa creada exitonamente");
      reset();
      setIsCompanyModalOpen(false); // Cierra el modal únicamente si fue exitoso
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Error al crear la empresa");
      } else {
        toast.error("Error de conexión con el servidor");
      }
    }
  };

  // =========================================================================
  // 4. RENDERIZADO DEL DASHBOARD COMPLETO
  // =========================================================================

  if (data) {
    return (
      <>
        {/* Componente global de notificaciones */}
        <Toaster position="top-left" />

        <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 overflow-x-hidden">
          {/* Sidebar Lateral */}
          <SidebarComp
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onOpenCreateCompany={() => setIsCompanyModalOpen(true)}
          />

          {/* Contenedor Principal */}
          <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
            <NavbarComp
              sidebarOpen={sidebarOpen}
              onOpenSidenav={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Renderizado de las Sub-rutas de la Aplicación */}
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="mx-auto w-full max-w-7xl">
                <Outlet context={data } />
              </div>
            </main>
          </div>

          {/* Modulo de Creación de Compañía */}
          {isCompanyModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
                {/* Header del Modal */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <FiBriefcase size={18} />
                    <h4 className="font-bold text-white text-base">
                      Crear Nueva Compañía
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCompanyModalOpen(false);
                      reset();
                    }}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Formulario */}
                <form
                  onSubmit={handleSubmit(handleCreateCompanySubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Nombre de la Empresa *
                    </label>
                    <input
                      id="companyname"
                      type="text"
                      placeholder="Ej: Magnus MT S.A."
                      className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                      {...register("companyname", {
                        required: "El nombre de la empresa es obligatorio",
                      })}
                    />
                    {errors.companyname && (
                      <ErrorMessage>{errors.companyname.message}</ErrorMessage>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Dirección Física
                    </label>
                    <input
                      id="address"
                      type="text"
                      placeholder="Ej: Planta Industrial, Celdas Alfa"
                      className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                      {...register("address", {
                        required: "La dirección es obligatoria",
                      })}
                    />
                    {errors.address && (
                      <ErrorMessage>{errors.address.message}</ErrorMessage>
                    )}
                  </div>

                  {/* Botones de control */}
                  <div className="flex gap-3 justify-end mt-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCompanyModalOpen(false);
                        reset();
                      }}
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
          )}
        </div>
      </>
    );
  }
}
