import { FiCpu } from "react-icons/fi";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-slate-100 select-none antialiased">
      
      {/* Contenedor del Spinner Tecnológico */}
      <div className="relative flex items-center justify-center h-24 w-24 mb-6">
        
        {/* Anillo exterior con efecto de rotación continua */}
        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-500/10 border-t-cyan-400 border-r-cyan-400/40 animate-spin" />
        
        {/* Anillo intermedio que gira al revés para dar contraste mecánico */}
        <div className="absolute inset-2 rounded-xl border border-slate-800 border-b-cyan-500/60 border-l-cyan-500/20 animate-[spin_3s_infinite_linear_reverse]" />
        
        {/* Núcleo central con ícono de procesamiento */}
        <div className="absolute inset-4 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/5 animate-pulse">
          <FiCpu size={24} />
        </div>
      </div>

      {/* Textos de Estado de Carga */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h3 className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-slate-400">
          Iniciando <span className="text-cyan-400 animate-pulse">Core_Interface</span>
        </h3>
        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest animate-pulse">
          Verificando credenciales de acceso...
        </p>
      </div>

      {/* Barra de progreso inferior tipo escáner */}
      <div className="w-48 h-[2px] bg-slate-900 rounded-full overflow-hidden mt-6 relative border border-slate-800/50">
        <div className="h-full bg-cyan-400 w-1/3 rounded-full absolute animate-[loadingScan_1.5s_infinite_ease-in-out] shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
      </div>

      {/* Inyección de la animación personalizada para el escáner horizontal */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loadingScan {
          0% { left: -30%; }
          100% { left: 110%; }
        }
      `}} />
    </div>
  );
}