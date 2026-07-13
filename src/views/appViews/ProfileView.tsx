import { useOutletContext } from "react-router-dom";
import { FiUser, FiMail, FiShield, FiBriefcase, FiCalendar } from "react-icons/fi";

// Definimos la estructura exacta del usuario
interface UserData {
  _id: string;
  username: string;
  email: string;
  role: string;
  handle: string;
  createdAt?: string;
  userId?: string;
  admin?: boolean; // Por si usas la propiedad admin devuelta por el backend
}

// Estructura del contexto global que viene del Outlet en AppLayout
interface LayoutContext {
  user: UserData;
  activeCompany: unknown;
}

export default function ProfileView() {
  // Destructuramos 'user' (que mapea con el 'data' del backend) desde el objeto del contexto
  const { user } = useOutletContext<LayoutContext>();

  // Formateador de fecha para pintar de forma legible el 'createdAt' de MongoDB
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("es-ES", { year: "numeric", month: "long" })
    : "No registrado";

  console.log("Datos del usuario extraídos en ProfileView:", user); // Debugging
  
  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-300">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Tarjeta Principal de Perfil */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center gap-4 shadow-xl">
            
            {/* Avatar con Estilo */}
            <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-inner shadow-cyan-500/5">
              <FiUser size={40} />
            </div>
            
            {/* Handle y Rol */}
            <div>
              <h2 className="text-lg font-bold text-white">@{user?.handle || "Cargando..."}</h2>
              <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 capitalize">
                <FiShield size={12} /> {user?.role || (user?.admin ? "Admin" : "Usuario")}
              </span>
            </div>

            <div className="w-full border-t border-slate-800 my-2" />

            {/* Datos Rápidos en la Tarjeta */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1"><FiCalendar /> Miembro desde:</span>
              <span className="text-white capitalize">{memberSince}</span>
            </div>
          </div>

          {/* Panel de Detalles e Información de Cuenta */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <h3 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
              Detalles de la Cuenta
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Campo: Nombre Completo */}
              <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FiUser size={12} /> Nombre Completo
                </span>
                <span className="text-sm text-white font-medium">{user?.username || "N/A"}</span>
              </div>

              {/* Campo: Correo Electrónico */}
              <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FiMail size={12} /> Correo Electrónico
                </span>
                <span className="text-sm text-white font-medium">{user?.email || "N/A"}</span>
              </div>

              {/* Campo: Identificador Único (ID) */}
              <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FiBriefcase size={12} /> ID de Registro
                </span>
                <span className="text-sm text-cyan-400 font-mono text-xs truncate">
                  {user?.userId || "N/A"}
                </span>
              </div>

              {/* Campo: Nivel de Acceso */}
              <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FiShield size={12} /> Privilegios del Core
                </span>
                <span className="text-sm text-emerald-400 font-medium font-mono text-xs uppercase">
                  {user?.admin || user?.role === "admin" ? "Root Access / Full Privileges" : "Standard Access"}
                </span>
              </div>

            </div>

            {/* Botón de Acción */}
            <div className="flex justify-end mt-2 pt-4 border-t border-slate-800">
              <button 
                type="button"
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
                onClick={() => alert("Funcionalidad para cambiar contraseña en desarrollo")}
              >
                Cambiar Contraseña
              </button>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}