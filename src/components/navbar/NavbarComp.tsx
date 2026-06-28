import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Importamos useLocation
import { FiAlignJustify, FiSearch, FiBell, FiMoon, FiSun, FiUser, FiLogOut } from "react-icons/fi";

interface NavbarProps {
  sidebarOpen: boolean;
  onOpenSidenav: () => void;
  brandText?: string; // Lo hacemos opcional porque ahora se puede autodetectar
}

export default function Navbar({ sidebarOpen, onOpenSidenav, brandText }: NavbarProps) {
  const [darkmode, setDarkmode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation(); // Hook para leer la ruta actual

  // Diccionario para mapear rutas a títulos limpios
  const routeTitles: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/profile": "Mi Perfil",
    "/admin/canvas": "Lienzo Operativo",
   
  };

  // 1. Prioridad al diccionario, 2. Si no existe, usa la prop brandText, 3. Por defecto "Dashboard"
  const currentTitle = routeTitles[location.pathname] || brandText || "Dashboard";

  const toggleDarkMode = () => {
    if (darkmode) {
      document.body.classList.remove("dark");
      setDarkmode(false);
    } else {
      document.body.classList.add("dark");
      setDarkmode(true);
    }
  };

  return (
    <nav className="z-40 flex h-20 w-full items-center justify-between border-b border-slate-800/60 bg-slate-900/50 px-6 backdrop-blur-xl">
      
      {/* LADO IZQUIERDO: Botón menú + Migas de pan dinámicas */}
      <div className="flex items-center gap-4">
        
        {/* BOTÓN CON ANIMACIÓN DE DESAPARICIÓN */}
        <button 
          onClick={onOpenSidenav} 
          className={`
            flex cursor-pointer text-xl text-slate-400 hover:text-cyan-400 p-2 
            hover:bg-slate-800/50 rounded-xl border border-slate-800/40
            transition-all duration-300 ease-in-out
            ${sidebarOpen 
              ? "scale-0 opacity-0 w-0 p-0 border-none pointer-events-none mr-0" 
              : "scale-100 opacity-100 w-10 mr-2"
            }
          `}
          title="Abrir menú"
        >
          <FiAlignJustify className="h-5 w-5" />
        </button>

        <div>
          
          <h1 className="text-xl font-bold text-white capitalize tracking-tight mt-0.5">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* LADO DERECHO: Buscador, Notificaciones, Tema y Perfil */}
      <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-full shadow-inner">
        
        {/* Barra de Búsqueda */}
        <div className="hidden md:flex h-9 w-48 items-center rounded-full bg-slate-900 px-3 text-slate-400 border border-transparent focus-within:border-cyan-500/50 transition-all">
          <FiSearch className="h-4 w-4 text-slate-500 mr-2" />
          <input
            type="text"
            placeholder="Buscar módulo..."
            className="h-full w-full bg-transparent text-xs font-medium text-white outline-none placeholder:text-slate-600"
          />
        </div>

        {/* Notificaciones */}
        <button className="relative text-slate-400 hover:text-cyan-400 p-2 hover:bg-slate-800/50 rounded-full transition-colors">
          <FiBell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400" />
        </button>

        {/* Interruptor de Tema */}
        <button 
          onClick={toggleDarkMode}
          className="text-slate-400 hover:text-amber-400 p-2 hover:bg-slate-800/50 rounded-full transition-colors"
        >
          {darkmode ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
        </button>

        <div className="h-5 w-px bg-slate-800" />

        {/* PERFIL */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-bold text-sm tracking-wider hover:bg-cyan-900 transition-all"
          >
            AM
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-10 h-full w-full" onClick={() => setShowProfileMenu(false)} />
              
              <div className="absolute right-0 mt-3 z-20 w-56 origin-top-right flex flex-col rounded-2xl border border-slate-800 bg-slate-950 p-3 shadow-2xl">
                <div className="px-3 py-2 border-b border-slate-900 mb-1.5">
                  <p className="text-xs text-cyan-400 font-mono font-bold tracking-widest uppercase">Operador Lean</p>
                  <p className="text-sm font-semibold text-white truncate">Adela Magnuson</p>
                </div>

                <Link 
                  to="/admin/profile" 
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
                >
                  <FiUser className="h-3.5 w-3.5 text-slate-500" /> Configurar Perfil
                </Link>

                <div className="my-1.5 h-px bg-slate-900" />

                <button 
                  onClick={() => alert("Cerrando sesión...")}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/20 transition-colors text-left w-full"
                >
                  <FiLogOut className="h-3.5 w-3.5" /> Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}