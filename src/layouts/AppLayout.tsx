// =========================================================================
// 1. IMPORTACIONES Y DEPENDENCIAS
// =========================================================================
import { useState, type SetStateAction } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "sonner";

// Componentes de la Interfaz MMT
import NavbarComp from "../components/navbar/NavbarComp";
import SidebarComp from "../components/sidebar/SidebarComp";
import Loading from "../components/loading/Loading.tsx";
import CreateCompanyModal from "../components/createCompanyModal/CreateCompanyModal.tsx";

// Servicios de API
import { getUser } from "../api/MainApi.ts";

export default function AppLayout() {
  /**
   * ==========================================
   * 1. GESTIÓN DE ESTADO ASÍNCRONO (API)
   * ==========================================
   * TanStack Query maneja la caché y el ciclo de vida de la petición.
   */
  const { data, isLoading, isError } = useQuery({
    queryFn: getUser, 
    queryKey: ["user"], 
    retry: 3, // Tolerancia a fallos de red
    refetchOnWindowFocus: false, // Optimización: no saturar al servidor al cambiar de pestaña
  });

  /**
   * ==========================================
   * 2. ESTADOS LOCALES DE LA INTERFAZ (UI)
   * ==========================================
   */
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [activeCompanyId, setActiveCompanyId] = useState<string>("");

  /**
   * ==========================================
   * 3. RENDERIZADO CONDICIONAL DE CONTROL
   * ==========================================
   * Patrón "Early Return" para proteger la UI de datos nulos.
   */
  if (isLoading) return <Loading />;
  if (isError) return <Navigate to="/auth/login" />;

  /**
   * ==========================================
   * 4. CÁLCULO DE DATOS DERIVADOS (ESTADO DERIVADO)
   * ==========================================
   * Este bloque se ejecuta de forma síncrona, eliminando la necesidad de useEffect.
   */
  if (data) {
    // 4.1 Aseguramos un array válido para iterar
    const companies = data.companies || [];
    
    // 4.2 Lógica de selección: Toma el ID seleccionado, o por defecto el primero disponible.
    const currentActiveId = activeCompanyId || (companies[0] as { _id: string })?._id || "";
    
    // 4.3 Extracción del objeto completo de la compañía activa para pasarlo a las vistas
    const activeCompany = companies.find(
      (c: unknown) => (c as { _id: string })._id === currentActiveId
    );

    return (
      <>
        {/* Gestor global de notificaciones */}
        <Toaster position="top-left" />

        {/* Plataforma Principal (Contenedor Full-Screen fijo en modo oscuro) */}
        <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 overflow-x-hidden">
          
          {/* Menú de Navegación Lateral */}
          <SidebarComp
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onOpenCreateCompany={() => setIsCompanyModalOpen(true)}
            companies={companies} 
            activeCompanyId={currentActiveId} 
            onSelectCompany={(id) => setActiveCompanyId(id)} 
          />

          {/* Área Dinámica Principal */}
          <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
            <NavbarComp
              sidebarOpen={sidebarOpen}
              onOpenSidenav={() => setSidebarOpen(!sidebarOpen)}
              user={data} // <-- Inyectando la información del backend
            />

            {/* Inyección de Sub-rutas (Lienzo, Perfil, etc.) */}
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="w-full h-full">
                {/* EL NÚCLEO DEL DATO:
                  Inyectamos la sesión y la empresa activa en el Outlet.
                  Cualquier componente hijo (como OperationalCanvas) lo recuperará con useOutletContext().
                */}
                <Outlet context={{ user: data, activeCompany }} />
              </div>
            </main>
          </div>

          {/* Módulo Flotante para Alta de Unidades de Negocio */}
          <CreateCompanyModal 
            isOpen={isCompanyModalOpen} 
            onClose={() => setIsCompanyModalOpen(false)} 
            onCompanyCreated={(id: SetStateAction<string>) => setActiveCompanyId(id)} 
          />
        </div>
      </>
    );
  }

  // Fallback de seguridad en caso de estados huérfanos
  return null;
}