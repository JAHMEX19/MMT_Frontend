import { Link, useLocation } from "react-router-dom";
import { FiX, FiActivity, FiUser, FiLayers, FiPlus } from "react-icons/fi";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onOpenCreateCompany: () => void; // NUEVA PROP: Para detonar el formulario/modal
}

export default function Sidebar({ open, onClose, onOpenCreateCompany }: SidebarProps) {
  const location = useLocation();

  // =========================================================================
  // PALETAS DE COLOR DINÁMICAS (Transición de 700ms basada en la ruta)
  // =========================================================================
  const isRegister = location.pathname.includes('signup') || location.pathname.includes('register');

  const theme = {
    logoBg: isRegister ? 'from-purple-500 to-indigo-600 ring-purple-400/30' : 'from-cyan-500 to-blue-600 ring-cyan-400/30',
    logoPing: isRegister ? 'bg-purple-400/20' : 'bg-cyan-400/20',
    logoText: isRegister ? 'to-purple-400' : 'to-cyan-400',
    logoSub: isRegister ? 'text-purple-400' : 'text-cyan-400',
    titleSpan: isRegister ? 'from-purple-400 to-indigo-300' : 'from-cyan-400 to-sky-300',
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiActivity /> },
    { name: "Mi Perfil", path: "/admin/profile", icon: <FiUser /> },
    { name: "Lienzo Operativo", path: "/admin/canvas", icon: <FiLayers /> },
  ];

  return (
    <div
      className={`
        /* Estructura base y transiciones */
        relative flex h-screen flex-col bg-slate-950 
        transition-all duration-300 ease-in-out shrink-0
        
        /* Manejo de estados dinámicos de ancho y bordes */
        ${open 
          ? "w-72 p-6 border-r border-slate-800 opacity-100" 
          : "w-0 p-0 opacity-0 border-r-0 overflow-hidden"
        }
      `}
    >
      {/* Botón para cerrar */}
      <button 
        onClick={onClose} 
        className="absolute top-5 right-5 text-slate-400 hover:text-cyan-400 p-1 hover:bg-slate-900 rounded-lg transition-colors z-50"
        title="Cerrar menú"
      >
        <FiX size={20} />
      </button>

      {/* Contenedor interno */}
      <div className={`w-full flex flex-col flex-1 ${!open ? "invisible" : ""}`}>
        
        {/* HEADER DINÁMICO INTEGRADO */}
        <div className="flex items-center gap-4 shrink-0 mb-8 mt-2 px-2">
          <div className={`relative flex items-center justify-center bg-gradient-to-br p-3 rounded-xl shadow-lg ring-1 transition-all duration-700 ${theme.logoBg}`}>
            <span className={`absolute inset-0 rounded-xl pointer-events-none animate-ping transition-all duration-700 ${theme.logoPing}`}></span>
            <img src="/doble.svg" alt="Magnus Icon" className="w-5 h-5 invert relative z-10" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white transition-all duration-700">
              Magnus MT
            </h1>
            <p className={`text-xs font-semibold tracking-widest uppercase transition-all duration-700 ${theme.logoSub}`}>
              MMT System
            </p>
          </div>
        </div>

        {/* Lista de enlaces principales */}
        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1200 && onClose()}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? isRegister
                      ? "bg-purple-950/40 border border-purple-500/30 text-purple-400 font-bold shadow-lg shadow-purple-500/5"
                      : "bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 font-bold shadow-lg shadow-cyan-500/5"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                <span className={`text-lg ${isActive ? (isRegister ? "text-purple-400" : "text-cyan-400") : "text-slate-500"}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}

          {/* =========================================================================
              SECCIÓN DE CREACIÓN DE COMPAÑÍA (BOTÓN INTEGRADO)
             ========================================================================= */}
          <div className="my-4 border-t border-slate-900 pt-4">
            <p className="px-4 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-500 mb-2">
              Organizaciones
            </p>
            
            <button
              onClick={() => {
                // Cerramos el menú en móvil si se ejecuta el trigger
                if (window.innerWidth < 1200) onClose();
                onOpenCreateCompany();
              }}
              className="
                w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium 
                text-slate-400 border border-dashed border-slate-800 hover:border-cyan-500/30 
                hover:bg-slate-900 hover:text-slate-200 transition-all group
              "
              title="Nueva Compañía"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg text-slate-500 group-hover:text-cyan-400 transition-colors">
                  <FiLayers />
                </span>
                <span className="text-left">Nueva Compañía</span>
              </div>
              
              <span className="p-1 rounded-md bg-slate-950 text-slate-500 group-hover:text-cyan-400 group-hover:bg-cyan-950/40 border border-slate-900 transition-all">
                <FiPlus size={14} />
              </span>
            </button>
          </div>

        </nav>
      </div>
    </div>
  );
}