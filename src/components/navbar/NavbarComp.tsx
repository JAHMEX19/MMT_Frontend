// =========================================================================
// 1. IMPORTACIONES Y HOOKS GLOBALES
// =========================================================================
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiAlignJustify, FiSearch, FiBell, FiUser, FiLogOut } from "react-icons/fi";

// =========================================================================
// 2. INTERFACES Y CONTRATOS DE DATOS
// =========================================================================

// Definimos la estructura de los datos del usuario que consumirá la Navbar
interface UserData {
  _id: string;
  username?: string;
  email?: string;
  role?: string;
}

interface NavbarProps {
  sidebarOpen: boolean;
  onOpenSidenav: () => void;
  brandText?: string;
  user?: UserData; // Recibimos el usuario como prop opcional desde el AppLayout
}

export default function Navbar({ sidebarOpen, onOpenSidenav, brandText, user }: NavbarProps) {
  // =========================================================================
  // 3. ESTADOS LOCALES Y ENRUTAMIENTO
  // =========================================================================
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Diccionario para mapear las rutas a títulos legibles en la interfaz
  const routeTitles: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/profile": "Mi Perfil",
    "/admin/canvas": "Lienzo Operativo",
  };

  // Resolución del título actual basado en la URL
  const currentTitle = routeTitles[location.pathname] || brandText || "Dashboard";

  // =========================================================================
  // 4. LÓGICA DE NEGOCIO Y UTILIDADES
  // =========================================================================

  // Función auxiliar para extraer las iniciales del usuario dinámicamente
  const getInitials = () => {
    if (!user || !user.username) return "US"; // Fallback por defecto (USer)
    const firstInitial = user.username.charAt(0).toUpperCase();
    return `${firstInitial}`;
  };

  // =========================================================================
  // 5. RENDERIZADO DEL COMPONENTE
  // =========================================================================
  return (
    <nav className="z-40 flex h-20 w-full items-center justify-between border-b border-slate-800/60 bg-slate-900/50 px-6 backdrop-blur-xl">
      
      {/* ================= LADO IZQUIERDO ================= */}
      <div className="flex items-center gap-4">
        
        {/* BOTÓN COLAPSO DEL SIDEBAR */}
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

        {/* TÍTULO DINÁMICO DE LA VISTA */}
        <div>
          <h1 className="text-xl font-bold text-white capitalize tracking-tight mt-0.5">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* ================= LADO DERECHO ================= */}
      <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-full shadow-inner">
        
        {/* BARRA DE BÚSQUEDA GLOBAL */}
        <div className="hidden md:flex h-9 w-48 items-center rounded-full bg-slate-900 px-3 text-slate-400 border border-transparent focus-within:border-cyan-500/50 transition-all">
          <FiSearch className="h-4 w-4 text-slate-500 mr-2" />
          <input
            type="text"
            placeholder="Buscar módulo..."
            className="h-full w-full bg-transparent text-xs font-medium text-white outline-none placeholder:text-slate-600"
          />
        </div>

        {/* CENTRO DE NOTIFICACIONES */}
        <button className="relative text-slate-400 hover:text-cyan-400 p-2 hover:bg-slate-800/50 rounded-full transition-colors">
          <FiBell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400" />
        </button>

        {/* DIVISOR VISUAL */}
        <div className="h-5 w-px bg-slate-800" />

        {/* MENÚ DESPLEGABLE DEL PERFIL */}
        <div className="relative">
          {/* AVATAR DINÁMICO */}
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-bold text-sm tracking-wider hover:bg-cyan-900 transition-all"
            title="Opciones de perfil"
          >
            {getInitials()}
          </button>

          {/* DROPDOWN MENU */}
          {showProfileMenu && (
            <>
              {/* Capa invisible para cerrar el menú al hacer clic fuera */}
              <div className="fixed inset-0 z-10 h-full w-full" onClick={() => setShowProfileMenu(false)} />
              
              <div className="absolute right-0 mt-3 z-20 w-56 origin-top-right flex flex-col rounded-2xl border border-slate-800 bg-slate-950 p-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* INFO DEL USUARIO */}
                <div className="px-3 py-2 border-b border-slate-900 mb-1.5">
                  <p className="text-xs text-cyan-400 font-mono font-bold tracking-widest uppercase truncate">
                    {user?.role || "Gestor"}
                  </p>
                  <p className="text-sm font-semibold text-white truncate">
                    {user ? `${user.username}` : "Usuario Desconocido"}
                  </p>
                </div>

                {/* ACCIONES */}
                <Link 
                  to="/admin/profile" 
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
                >
                  <FiUser className="h-3.5 w-3.5 text-slate-500" /> Configurar Perfil
                </Link>

                <div className="my-1.5 h-px bg-slate-900" />

                <button 
                  onClick={() => {
                    localStorage.removeItem("AUTH_TOKEN");
                    navigate("/auth/login");
                  }}
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