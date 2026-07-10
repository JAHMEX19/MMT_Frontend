import { useOutletContext } from "react-router-dom";
import { FiUser, FiMail, FiShield, FiBriefcase, FiCalendar } from "react-icons/fi";

// Definimos la estructura de la data que viene desde el backend a través del AppLayout
interface UserRouteData {
  _id: string;
  username: string;
  email: string;
  role: string;
  handle:string;
  createdAt?: string;
  userId?: string; // Agregado para reflejar el userId que viene del backend
  // Agrega aquí propiedades adicionales si tu backend las incluye (ej. companies)
}

export default function ProfileView() {
  // Consumimos la data real inyectada por el componente padre <Outlet context={data} />
  const data = useOutletContext<UserRouteData>();

  // Formateador de fecha por si deseas pintar de forma legible el 'createdAt' de MongoDB
  const memberSince = data?.createdAt 
    ? new Date(data.createdAt).toLocaleDateString("es-ES", { year: "numeric", month: "long" })
    : "No registrado";

  console.log("Datos del usuario en ProfileView:", data); // Debugging: Verifica que la data se reciba correctamente  
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
          
          <div>
            <h2 className="text-lg font-bold text-white">@{data?.handle || "Cargando..."}</h2>
            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 capitalize">
              <FiShield size={12} /> {data?.role || "Usuario"}
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
              <span className="text-sm text-white font-medium">{data?.username || "N/A"}</span>
            </div>

            {/* Campo: Correo Electrónico */}
            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FiMail size={12} /> Correo Electrónico
              </span>
              <span className="text-sm text-white font-medium">{data?.email || "N/A"}</span>
            </div>

            {/* Campo: Identificador Único (ID) */}
            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FiBriefcase size={12} /> ID de Registro
              </span>
              <span className="text-sm text-cyan-400 font-mono text-xs truncate">
                {data?.userId || "N/A"}
              </span>
            </div>

            {/* Campo: Nivel de Acceso */}
            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FiShield size={12} /> Privilegios del Core
              </span>
              <span className="text-sm text-emerald-400 font-medium font-mono text-xs uppercase">
                {data?.role === "admin" ? "Root Access / Full Privileges" : "Standard Access"}
              </span>
            </div>

          </div>

          {/* Botón de Acción Futuro */}
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