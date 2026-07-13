import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiX, FiActivity, FiUser, FiPlus, FiGrid } from "react-icons/fi";

interface CompanyData {
  _id: string;
  companyname: string;
  address?: string;
  canvas?: string;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onOpenCreateCompany: () => void;
  companies?: CompanyData[];
  activeCompanyId?: string;
  onSelectCompany?: (id: string) => void;
}

export default function Sidebar({
  open,
  onClose,
  onOpenCreateCompany,
  companies = [],
  activeCompanyId,
  onSelectCompany,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegister =
    location.pathname.includes("signup") ||
    location.pathname.includes("register");

  const theme = {
    logoBg: isRegister
      ? "from-purple-500 to-indigo-600 ring-purple-400/30"
      : "from-cyan-500 to-blue-600 ring-cyan-400/30",
    logoPing: isRegister ? "bg-purple-400/20" : "bg-cyan-400/20",
    logoSub: isRegister ? "text-purple-400" : "text-cyan-400",
  };

  // Eliminamos "Lienzo Operativo" de aquí para que no sea un botón estático colgado
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiActivity /> },
    { name: "Mi Perfil", path: "/admin/profile", icon: <FiUser /> },
  ];

  const handleCompanyClick = (companyId: string) => {
    if (onSelectCompany) onSelectCompany(companyId);

    // Redirecciona directamente a la vista del lienzo operativo al hacer clic en la empresa
    navigate("/admin/canvas");

    if (window.innerWidth < 1200) onClose();
  };

  return (
    <div
      className={`
        relative flex h-screen flex-col bg-slate-950 
        transition-all duration-300 ease-in-out shrink-0
        ${
          open
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
      <div
        className={`w-full flex flex-col flex-1 h-full ${!open ? "invisible" : ""}`}
      >
        {/* HEADER DINÁMICO INTEGRADO */}
        <div className="flex items-center gap-4 shrink-0 mb-8 mt-2 px-2">
          <div className={`relative flex items-center justify-center p-2.5 rounded-xl shadow-xl ring-1 transition-all duration-500 ${theme.logoBg} group-hover:scale-[1.03] group-hover:border-slate-700`}>
              <span className={`absolute inset-0 rounded-xl pointer-events-none animate-ping transition-all duration-700 ${theme.logoPing}`}></span>
              {/* Quitamos 'invert' para respetar el degradado verde/cyan original */}
              <img src="/mmt-svg.svg" alt="Magnus MMT Logo" className="w-9 h-9 relative z-10 object-contain" />
            </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white transition-all duration-700">
              Magnus MT
            </h1>
            <p
              className={`text-xs font-semibold tracking-widest uppercase transition-all duration-700 ${theme.logoSub}`}
            >
              MMT System
            </p>
          </div>
        </div>

        {/* 1. NAVEGACIÓN PRINCIPAL (Rutas del Core) */}
        <nav className="flex flex-col gap-2 shrink-0">
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
                <span
                  className={`text-lg ${isActive ? (isRegister ? "text-purple-400" : "text-cyan-400") : "text-slate-500"}`}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* 2. CONTENEDOR DE ORGANIZACIONES (Crece dinámicamente ocupando el espacio intermedio) */}
        <div className="mt-6 border-t border-slate-900 pt-5 flex flex-col flex-1 min-h-0">
          <p className="px-4 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-500 mb-2">
            Lienzos por Organización
          </p>

          {/* LISTA DE EMPRESAS CON SCROLL INDEPENDIENTE */}
          <div
            className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-0.5
            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-slate-900
            [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {companies.map((company) => {
              // Estás en el canvas de esta empresa si el ID coincide e incluye la ruta de canvas
              const isSelected =
                company._id === activeCompanyId &&
                location.pathname.includes("/canvas");
              return (
                <button
                  type="button"
                  key={company._id}
                  onClick={() => handleCompanyClick(company._id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                    isSelected
                      ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 font-bold shadow-lg shadow-cyan-950/20"
                      : "border-transparent bg-slate-900/20 text-slate-400 hover:bg-slate-900 hover:text-slate-300"
                  }`}
                >
                  <FiGrid
                    className={`shrink-0 ${isSelected ? "text-cyan-400" : "text-slate-500"}`}
                    size={14}
                  />
                  <span className="truncate flex-1">{company.companyname}</span>
                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 ring-4 ring-cyan-950/60" />
                  )}
                </button>
              );
            })}

            {companies.length === 0 && (
              <p className="px-4 py-2 text-[11px] text-slate-600 font-mono italic">
                No hay empresas activas.
              </p>
            )}
          </div>
        </div>

        {/* 3. PARTE INFERIOR: Botón de añadir empresa fijado al final */}
        <div className="mt-auto pt-4 border-t border-slate-900 shrink-0">
          <button
            onClick={() => {
              if (window.innerWidth < 1200) onClose();
              onOpenCreateCompany();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 border border-dashed border-slate-800 hover:border-cyan-500/30 hover:bg-slate-900 hover:text-slate-200 transition-all group"
            title="Nueva Compañía"
          >
            <span className="font-semibold">Nueva Compañía</span>
            <span className="p-1 rounded-md bg-slate-950 text-slate-500 group-hover:text-cyan-400 group-hover:bg-cyan-950/40 border border-slate-900 transition-all">
              <FiPlus size={12} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
