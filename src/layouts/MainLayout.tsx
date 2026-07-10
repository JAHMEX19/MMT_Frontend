import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Proyectos", href: "/projects" },
    { name: "Contacto", href: "/contact" },
  ];

  // =========================================================================
  // PALETA DE COLOR INTEGRADA CON LOS COLORES REALES DE TU NUEVO LOGO
  // =========================================================================
  const theme = {
  // Cambiamos el fondo a slate-900 puro para hacer que el verde y el cyan resalten al máximo
  logoBg: 'bg-slate-900 border border-slate-800/80 ring-1 ring-slate-800',
  logoPing: 'bg-teal-400/10',
  logoSub: 'text-cyan-400 font-bold',
  titleSpan: 'from-emerald-400 via-teal-400 to-cyan-400',
  btnGradient: 'from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400'
};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 flex flex-col">
      
      {/* =========================================================================
          HEADER PRINCIPAL REFINADO
          ========================================================================= */}
      <header className="sticky top-0 z-50 w-full bg-slate-950 border-b border-slate-900 backdrop-blur-md select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* BRANDING INTEGRADO CON EL LOGO SVG */}
          <Link to="/" className="flex items-center gap-4 shrink-0 group">
            {/* Contenedor del Isotipo con fondo oscuro integrado para que resalten los colores del SVG */}
            <div className={`relative flex items-center justify-center p-2.5 rounded-xl shadow-xl ring-1 transition-all duration-500 ${theme.logoBg} group-hover:scale-[1.03] group-hover:border-slate-700`}>
              <span className={`absolute inset-0 rounded-xl pointer-events-none animate-ping transition-all duration-700 ${theme.logoPing}`}></span>
              {/* Quitamos 'invert' para respetar el degradado verde/cyan original */}
              <img src="/mmt-svg.svg" alt="Magnus MMT Logo" className="w-9 h-9 relative z-10 object-contain" />
            </div>
            
            <div>
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent transition-all duration-700 flex items-center gap-1.5">
                Magnus <span className={`bg-gradient-to-r ${theme.titleSpan} bg-clip-text text-transparent font-black`}>MT</span>
              </h1>
              <p className={`text-[11px] font-mono font-bold tracking-[0.25em] uppercase transition-all duration-700 ${theme.logoSub}`}>
                Mechatronic Technologies
              </p>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border transition-all duration-200 ${
                    isActive
                      ? "text-cyan-400 bg-slate-900 border-slate-800 ring-1 ring-cyan-500/20"
                      : "text-slate-400 hover:text-white border-transparent hover:bg-slate-900/60"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Botón Iniciar Sesión con el degradado unificado al logo */}
          <div className="hidden md:flex items-center">
            <Link
              to="/auth/login"
              className={`bg-gradient-to-r ${theme.btnGradient} text-slate-950 font-mono font-black uppercase tracking-wider text-xs py-2.5 px-5 rounded-xl shadow-lg shadow-teal-500/5 active:scale-[0.98] transition-all duration-150`}
            >
              MMY System
            </Link>
          </div>

          {/* Botón de Menú Móvil */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
            >
              {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>

        </div>

        {/* =========================================================================
            MENÚ DESPLEGABLE MÓVIL
            ========================================================================= */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-900 bg-slate-950 animate-in fade-in duration-200">
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-colors ${
                      isActive
                        ? "text-cyan-400 bg-slate-900 border-slate-800"
                        : "text-slate-400 hover:text-white bg-slate-900/40 border-transparent"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Botón Móvil */}
              <div className="pt-4 border-t border-slate-800 mt-2"><span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-400" >
                Core_Interface v1.0.0
              </span>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-center bg-gradient-to-r ${theme.btnGradient} text-slate-950 font-mono font-black uppercase tracking-wider text-xs py-3 px-4 rounded-xl shadow-lg shadow-teal-500/5 active:scale-[0.98] transition-all duration-150`}
                >
                  
                  <p>MMT System</p>
                  
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* CONTENIDO DINÁMICO */}
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

       {/* Footer Fijo */}
          <div className="text-center lg:text-left text-xs text-slate-500 shrink-0">
            <p>&copy; {new Date().getFullYear()} Magnus MMT. Data & Process Automation.</p>
          </div>
        

    </div>
  );
}