import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavbarComp from "../components/navbar/NavbarComp";
import SidebarComp from "../components/sidebar/SidebarComp";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Sidebar */}
      <SidebarComp
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />

      {/* Contenedor Principal */}
      <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
        
        {/* NUEVO: Le pasamos 'sidebarOpen' al Navbar */}
        <NavbarComp
          sidebarOpen={sidebarOpen}
          onOpenSidenav={() => setSidebarOpen(!sidebarOpen)}
          brandText="Lienzo Operativo"
        />

        {/* Espacio del Contenido */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}