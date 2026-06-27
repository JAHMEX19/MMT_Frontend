import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

const FEATURES = [
  {
    tag: "HiveCore Network",
    title: "Sincronización en Tiempo Real",
    description: "Recolección estructurada de datos en piso, optimización modular y despliegue ágil basado en la eficiencia de procesos.",
    stat: "99.8%",
    statLabel: "Eficiencia de Red"
  },
  {
    tag: "Lean Production",
    title: "Monitoreo Inteligente OEE",
    description: "Visualiza la disponibilidad, rendimiento y calidad de tus líneas de manufactura al instante de forma automatizada.",
    stat: "+14.2%",
    statLabel: "Productividad Incrementada"
  },
  {
    tag: "Standard Work",
    title: "Optimización Estructurada",
    description: "Sincroniza los flujos de operación eliminando desperdicios y estandarizando cada celda de trabajo en tu planta.",
    stat: "0.4s",
    statLabel: "Latencia de Datos"
  }
];

export default function AuthLayout() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Detectamos la ruta actual para saber de qué lado poner el formulario
  const location = useLocation();
  // Si la URL contiene "signup" o "register", movemos el panel
  const isRegister = location.pathname.includes('signup') || location.pathname.includes('register');

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % FEATURES.length);
        setIsTransitioning(false);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    if (index === activeIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <>
      <Toaster position='top-left' />
      
      {/* Añadimos 'relative' para poder posicionar los paneles absolutos en pantallas grandes */}
      <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
        
        {/* =========================================================================
            SECCIÓN DE FORMULARIO (<Outlet />)
            Se mueve a la izquierda por defecto (Login) o a la derecha (Register)
           ========================================================================= */}
        <div className={`flex flex-col justify-between w-full lg:w-1/2 h-full p-8 sm:p-12 md:p-20 bg-slate-950 border-slate-850/50 shadow-2xl z-20 
          lg:overflow-y-auto scrollbar-none transition-all duration-700 ease-in-out lg:absolute lg:top-0 lg:bottom-0 lg:left-0
          ${isRegister ? 'lg:translate-x-full lg:border-l' : 'lg:translate-x-0 lg:border-r'}`}
        >
          {/* Header Fijo */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <span className="absolute inset-0 rounded-xl bg-cyan-400/20 animate-ping pointer-events-none"></span>
              <img src="/doble.svg" alt="Magnus Icon" className="w-9 h-9 invert relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                Magnus MT
              </h1>
              <p className="text-xs text-cyan-400 font-semibold tracking-widest uppercase">
                MMT System
              </p>
            </div>
          </div>

          {/* Contenido Dinámico */}
          <div className="w-full max-w-sm mx-auto my-auto py-10 shrink-0">
            <Outlet />
          </div>

          {/* Footer Fijo */}
          <div className="text-center lg:text-left text-xs text-slate-500 shrink-0">
            <p>&copy; {new Date().getFullYear()} Magnus MMT. Data & Process Automation.</p>
          </div>
        </div>

        {/* =========================================================================
            SECCIÓN DEL CARRUSEL INFORMATIVO
            Se mueve a la derecha por defecto (Login) o a la izquierda (Register)
           ========================================================================= */}
        <div className={`hidden lg:flex lg:w-1/2 h-full bg-slate-900 items-center justify-center relative overflow-hidden p-12 z-10
          transition-all duration-700 ease-in-out lg:absolute lg:top-0 lg:bottom-0
          ${isRegister ? 'lg:left-0 lg:translate-x-0' : 'lg:left-1/2 lg:translate-x-0'}`}
        >
          {/* Fondo Decorativo Cyber-Lean */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-30 -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>

          {/* Tarjeta y Textos del Carrusel */}
          <div className="w-full max-w-md z-10 flex flex-col gap-8">
            
            {/* Métrica de Estado Viva */}
            <div className="w-full p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl backdrop-blur-xl shadow-xl flex items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
              
              <div className={`flex flex-col gap-1 transition-all duration-300 transform ${
                isTransitioning ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'
              }`}>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                  {FEATURES[activeIndex].statLabel}
                </span>
                <div className="text-4xl font-black text-white tracking-tight tabular-nums">
                  {FEATURES[activeIndex].stat}
                </div>
              </div>

              {/* Micro Indicadores Analíticos Animados */}
              <div className="flex gap-1 items-end h-10 px-2">
                <div className="w-1.5 bg-slate-800 h-6 rounded-full overflow-hidden">
                  <div className="w-full bg-cyan-500 h-1/2 animate-pulse"></div>
                </div>
                <div className="w-1.5 bg-slate-800 h-10 rounded-full overflow-hidden">
                  <div className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 h-4/5"></div>
                </div>
                <div className="w-1.5 bg-slate-800 h-8 rounded-full overflow-hidden">
                  <div className="w-full bg-cyan-400 h-2/3 animate-pulse delay-75"></div>
                </div>
              </div>
            </div>

            {/* Bloque Informativo */}
            <div className={`flex flex-col items-center text-center gap-4 min-h-[180px] transition-all duration-300 ease-in-out transform ${
              isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-[10px] text-cyan-300 font-semibold tracking-widest uppercase">
                  {FEATURES[activeIndex].tag}
                </span>
              </div>

              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight max-w-sm">
                {FEATURES[activeIndex].title.includes("Tiempo Real") ? (
                  <>Sincronización en <span className="bg-gradient-to-r from-cyan-400 to-sky-300 bg-clip-text text-transparent">Tiempo Real</span></>
                ) : FEATURES[activeIndex].title.includes("OEE") ? (
                  <>Monitoreo Inteligente <span className="bg-gradient-to-r from-cyan-400 to-sky-300 bg-clip-text text-transparent">OEE</span></>
                ) : (
                  <>Optimización <span className="bg-gradient-to-r from-cyan-400 to-sky-300 bg-clip-text text-transparent">Estructurada</span></>
                )}
              </h2>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal max-w-sm">
                {FEATURES[activeIndex].description}
              </p>
            </div>

            {/* Puntos de Navegación del Carrusel (Dots) */}
            <div className="flex justify-center gap-2.5 mt-2">
              {FEATURES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === activeIndex ? 'w-8 bg-cyan-500' : 'w-2 bg-slate-800 hover:bg-slate-700'
                  }`}
                  aria-label={`Ir a la diapositiva ${index + 1}`}
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </>
  );
}