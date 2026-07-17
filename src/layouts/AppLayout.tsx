// 1. IMPORTACIONES: Traemos las herramientas de React, librerías externas y nuestros componentes.
import { useState, type SetStateAction } from "react";
// Outlet: Es el "hueco" donde se renderizan las pantallas hijas de esta ruta.
// Navigate: Un componente que redirige al usuario a otra URL de forma automática.
import { Outlet, Navigate } from "react-router-dom";
// useQuery: El hook estrella de TanStack Query para gestionar peticiones HTTP, caché y sincronización.
import { useQuery } from "@tanstack/react-query";
// Toaster: Componente contenedor para mostrar notificaciones flotantes (toasts).
import { Toaster } from "sonner";

// Componentes propios de la interfaz (Navbar, Sidebar, Modales, etc.)
import NavbarComp from "../components/navbar/NavbarComp";
import SidebarComp from "../components/sidebar/SidebarComp";
import Loading from "../components/loading/Loading.tsx";
import CreateCompanyModal from "../components/createCompanyModal/CreateCompanyModal.tsx";
// getUser: Función que hace el fetch real a tu base de datos o API.
import { getUser } from "../api/MainApi.ts";

export default function AppLayout() {
  
  /**
   * ==========================================
   * 1. GESTIÓN DE ESTADO ASÍNCRONO (API)
   * ==========================================
   * useQuery automatiza el ciclo de vida de la petición. Nos da tres variables clave:
   * - data: La respuesta del servidor si todo sale bien.
   * - isLoading: true si la petición está en curso por primera vez.
   * - isError: true si la API falló tras los reintentos.
   */
  const { data, isLoading, isError } = useQuery({
    queryFn: getUser, // La función que dispara la petición Axios/Fetch.
    queryKey: ["user"], // Llave única en la caché. Si otra pantalla pide ["user"], React Query no vuelve a internet, usa la caché.
    retry: 3, // Si falla, reintenta automáticamente hasta 3 veces antes de marcar error.
    refetchOnWindowFocus: false, // Evita que la app vuelva a consultar a la API cada vez que el usuario cambia de pestaña en el navegador.
  });

  /**
   * ==========================================
   * 2. ESTADOS LOCALES DE LA INTERFAZ (UI)
   * ==========================================
   * useState guarda datos que, al cambiar, obligan a React a re-renderizar (redibujar) la pantalla.
   */
  // Controla si el menú lateral está visible o colapsado.
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Controla si el modal flotante para crear una empresa está abierto (true) o cerrado (false).
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  // Guarda el ID de la empresa que el usuario seleccionó para trabajar.
  const [activeCompanyId, setActiveCompanyId] = useState<string>("");

  /**
   * ==========================================
   * 3. RENDERIZADO CONDICIONAL DE CONTROL
   * ==========================================
   * Patrón "Early Return" (Retorno temprano): Si la app está cargando o falló, 
   * cortamos la ejecución aquí y mostramos otra cosa, protegiendo al código de abajo de leer datos inexistentes.
   */
  if (isLoading) return <Loading />; // Mientras la API responde, mostramos pantalla de carga.
  if (isError) return <Navigate to="/auth/login" />; // Si la sesión expiró o falló la API, expulsamos al usuario al Login.

  /**
   * ==========================================
   * 4. CÁLCULO DE DATOS DERIVADOS (MEMORIA PROPIA)
   * ==========================================
   * Este bloque solo se ejecuta si 'data' ya existe gracias a las validaciones anteriores.
   */
  if (data) {
    // Si el usuario no tiene empresas, aseguramos un array vacío para que no rompa la app al usar .map() o .find()
    const companies = data.companies || [];
    
    // LÓGICA SOBRE LA MARCHA:
    // Si el usuario no ha hecho clic en ninguna empresa (activeCompanyId está vacío ""),
    // tomamos por defecto el ID de la primera empresa del array. Si no hay ninguna, queda en "".
    const currentActiveId = activeCompanyId || (companies[0] as { _id: string })?._id || "";
    
    // Buscamos los datos completos de la empresa activa en base al ID que resolvimos arriba.
    const activeCompany = companies.find(
      (c: unknown) => (c as { _id: string })._id === currentActiveId
    );

    return (
      <>
        {/* Componente global de Sonner necesario para que los avisos/notificaciones aparezcan en pantalla */}
        <Toaster position="top-left" />

        {/* Contenedor estructural con Tailwind CSS */}
        <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 overflow-x-hidden">
          
          {/* SIDEBAR LATERAL 
              Le pasamos datos (props) y funciones para modificar nuestros estados locales (setters) */}
          <SidebarComp
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)} // Cambia el estado a false para ocultarlo
            onOpenCreateCompany={() => setIsCompanyModalOpen(true)} // Abre el modal de creación desde el menú
            companies={companies} // Pasa la lista completa de empresas de la API
            activeCompanyId={currentActiveId} // Pasa el ID resuelto dinámicamente
            onSelectCompany={(id) => setActiveCompanyId(id)} // Cuando el usuario hace clic en otra empresa, actualiza el estado local
          />

          {/* CONTENEDOR PRINCIPAL */}
          <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
            {/* BARRA DE NAVEGACIÓN SUPERIOR */}
            <NavbarComp
              sidebarOpen={sidebarOpen}
              onOpenSidenav={() => setSidebarOpen(!sidebarOpen)} // Invierte el valor actual (si es true pasa a false y viceversa)
            />

            {/* CONTENIDO DINÁMICO DE LAS SUB-RUTAS */}
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="mx-auto w-full max-w-7xl">
                {/* 
                  Outlet es donde React Router inyectará las vistas hijas (ej: /dashboard, /profile).
                  Al pasarle 'context', cualquier vista hija puede usar el hook `useOutletContext()` 
                  y acceder directamente a los datos del 'user' y la 'activeCompany' sin volver a hacer peticiones.
                */}
                <Outlet context={{ user: data, activeCompany }} />
              </div>
            </main>
          </div>

          {/* MODAL DE CREACIÓN DE EMPRESA */}
          <CreateCompanyModal 
            isOpen={isCompanyModalOpen} 
            onClose={() => setIsCompanyModalOpen(false)} 
            // Cuando la base de datos crea la empresa con éxito, nos devuelve su nuevo ID
            // y automáticamente lo marcamos como el ID activo en la app.
            onCompanyCreated={(id: SetStateAction<string>) => setActiveCompanyId(id)} 
          />
        </div>
      </>
    );
  }

  // Si por alguna razón extraña no hay data ni carga ni error, no renderiza nada en la pantalla.
  return null;
}