import { useState, type SetStateAction } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "sonner";

import NavbarComp from "../components/navbar/NavbarComp";
import SidebarComp from "../components/sidebar/SidebarComp";
import Loading from "../components/loading/Loading.tsx";
import CreateCompanyModal from "../components/createCompanyModal/CreateCompanyModal.tsx";
import { getUser } from "../api/MainApi.ts";

export default function AppLayout() {
  // 1. Petición global del usuario y sus empresas
  const { data, isLoading, isError } = useQuery({
    queryFn: getUser,
    queryKey: ["user"],
    retry: 3, 
    refetchOnWindowFocus: false,
  });

  // 2. Estados de interfaz locales (el ID inicia vacío y sin useEffects)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [activeCompanyId, setActiveCompanyId] = useState<string>("");

  // 3. Validaciones de estado de carga y error de la API
  if (isLoading) return <Loading />;
  if (isError) return <Navigate to="/auth/login" />;

  // 4. Renderizado y cálculo dinámico una vez que tenemos data
  if (data) {
    const companies = data.companies || [];
    
    // Si activeCompanyId está vacío, por defecto calculamos el ID de la primera empresa disponible
    const currentActiveId = activeCompanyId || (companies[0] as { _id: string })?._id || "";
    
    // Encontramos el objeto completo de la empresa utilizando el ID resuelto
    const activeCompany = companies.find(
      (c: unknown) => (c as { _id: string })._id === currentActiveId
    );

    return (
      <>
        <Toaster position="top-left" />

        <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 overflow-x-hidden">
          {/* Sidebar Lateral */}
          <SidebarComp
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onOpenCreateCompany={() => setIsCompanyModalOpen(true)}
            companies={companies}
            activeCompanyId={currentActiveId} // <-- Le pasamos el ID resuelto al vuelo
            onSelectCompany={(id) => setActiveCompanyId(id)}
          />

          {/* Contenedor Principal */}
          <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
            <NavbarComp
              sidebarOpen={sidebarOpen}
              onOpenSidenav={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Sub-rutas inyectando el contexto de manera segura */}
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="mx-auto w-full max-w-7xl">
                <Outlet context={{ user: data, activeCompany }} />
              </div>
            </main>
          </div>

          {/* Modal de Creación de Compañía */}
          <CreateCompanyModal 
            isOpen={isCompanyModalOpen} 
            onClose={() => setIsCompanyModalOpen(false)} 
            onCompanyCreated={(id: SetStateAction<string>) => setActiveCompanyId(id)} 
          />
        </div>
      </>
    );
  }

  return null;
}