// =========================================================================
// 1. IMPORTACIONES
// =========================================================================
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiX, FiActivity, FiUser, FiPlus, FiGrid } from "react-icons/fi";

// =========================================================================
// 2. INTERFACES Y TIPADOS (Contratos de TypeScript)
// =========================================================================

// Define la estructura exacta que esperamos recibir de la base de datos para una empresa
interface CompanyData {
  _id: string;
  companyname: string;
  address?: string;
  canvas?: string;
}

// Define las propiedades (props) que el AppLayout le pasará a este Sidebar
interface SidebarProps {
  open: boolean; // Controla si el menú está visible o colapsado
  onClose: () => void; // Función para cerrar el menú (útil en móviles)
  onOpenCreateCompany: () => void; // Función para disparar el modal de nueva empresa
  companies?: CompanyData[]; // Arreglo con la lista de empresas del usuario
  activeCompanyId?: string; // ID de la empresa que está actualmente seleccionada
  onSelectCompany?: (id: string) => void; // Función para cambiar la empresa activa en el estado global
}

export default function Sidebar({
  open,
  onClose,
  onOpenCreateCompany,
  companies = [], // Valor por defecto: arreglo vacío para evitar errores de .map()
  activeCompanyId,
  onSelectCompany,
}: SidebarProps) {
  
  // =========================================================================
  // 3. HOOKS DE ENRUTAMIENTO Y ESTADO LÓGICO
  // =========================================================================
  
  const location = useLocation(); // Nos permite saber en qué URL estamos actualmente (para pintar botones activos)
  const navigate = useNavigate(); // Nos permite forzar redirecciones mediante código

  // Detector de contexto: Verifica si estamos en alguna ruta de registro para cambiar la paleta visual
  const isRegister =
    location.pathname.includes("signup") ||
    location.pathname.includes("register");

  // Configuración dinámica del tema (Identidad Visual MMT)
  const theme = {
    logoBg: isRegister
      ? "from-purple-500 to-indigo-600 ring-purple-400/30"
      : "from-cyan-500 to-blue-600 ring-cyan-400/30",
    logoPing: isRegister ? "bg-purple-400/20" : "bg-cyan-400/20",
    logoSub: isRegister ? "text-purple-400" : "text-cyan-400",
  };

  // Rutas estáticas del sistema (Menú principal)
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiActivity /> },
    { name: "Mi Perfil", path: "/admin/profile", icon: <FiUser /> },
  ];

  // =========================================================================
  // 4. MANEJADORES DE EVENTOS (Actions)
  // =========================================================================

  // Se ejecuta cuando el usuario hace clic en el nombre de una empresa en la lista
  const handleCompanyClick = (companyId: string) => {
    // 1. Avisa al Layout padre que cambie el ID de la empresa activa
    if (onSelectCompany) onSelectCompany(companyId);

    // 2. Redirecciona al usuario inmediatamente al área de trabajo (Lienzo Operativo)
    navigate("/admin/canvas");

    // 3. UX Móvil: Si la pantalla es menor a 1200px (tablet/celular), oculta el sidebar automáticamente
    if (window.innerWidth < 1200) onClose();
  };

  // =========================================================================
  // 5. RENDERIZADO DEL COMPONENTE (JSX)
  // =========================================================================
  return (
    <div
      className={`
        relative flex h-screen flex-col bg-slate-950 
        transition-all duration-300 ease-in-out shrink-0
        ${
          open // Control de apertura/cierre con Tailwind dinámico
            ? "w-72 p-6 border-r border-slate-800 opacity-100"
            : "w-0 p-0 opacity-0 border-r-0 overflow-hidden"
        }
      `}
    >
      {/* Botón Flotante para cerrar el menú en resoluciones pequeñas */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-slate-400 hover:text-cyan-400 p-1 hover:bg-slate-900 rounded-lg transition-colors z-50"
        title="Cerrar menú"
      >
        <FiX size={20} />
      </button>

      {/* Contenedor interno: Se oculta si el sidebar está cerrado para evitar clics fantasma */}
      <div
        className={`w-full flex flex-col flex-1 h-full ${!open ? "invisible" : ""}`}
      >
        
        {/* ================= HEADER: LOGO Y MARCA ================= */}
        <div className="flex items-center gap-4 shrink-0 mb-8 mt-2 px-2">
          <div className={`relative flex items-center justify-center p-2.5 rounded-xl shadow-xl ring-1 transition-all duration-500 ${theme.logoBg} group-hover:scale-[1.03] group-hover:border-slate-700`}>
              <span className={`absolute inset-0 rounded-xl pointer-events-none animate-ping transition-all duration-700 ${theme.logoPing}`}></span>
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

        {/* ================= ZONA 1: NAVEGACIÓN PRINCIPAL ================= */}
        <nav className="flex flex-col gap-2 shrink-0">
          {menuItems.map((item) => {
            // Compara la URL actual con la ruta del botón para encenderlo
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

        {/* ================= ZONA 2: LISTA DE ORGANIZACIONES ================= */}
        <div className="mt-6 border-t border-slate-900 pt-5 flex flex-col flex-1 min-h-0">
          <p className="px-4 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-500 mb-2">
            Lienzos por Organización
          </p>

          {/* Contenedor con Scrollbar personalizado estilo industrial */}
          <div
            className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-0.5
            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-slate-900
            [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {companies.map((company) => {
              // Lógica de "Activo": El ID debe coincidir Y el usuario debe estar dentro de la ruta /canvas
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
                  {/* 'truncate' evita que nombres de empresas muy largos rompan el diseño */}
                  <span className="truncate flex-1">{company.companyname}</span>
                  
                  {/* Indicador visual luminoso (Punto encendido) si la empresa está seleccionada */}
                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 ring-4 ring-cyan-950/60" />
                  )}
                </button>
              );
            })}

            {/* Mensaje de respaldo si el arreglo de empresas está vacío */}
            {companies.length === 0 && (
              <p className="px-4 py-2 text-[11px] text-slate-600 font-mono italic">
                No hay empresas activas.
              </p>
            )}
          </div>
        </div>

        {/* ================= ZONA 3: ACCIONES RÁPIDAS (Botón Añadir) ================= */}
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