import { Link } from "react-router-dom";
import { 
  FiCpu, 
  FiLayers, 
  FiActivity, 
  FiTrendingUp, 
  FiShield, 
  FiDatabase, 
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { useEffect, useState } from "react";

// Data unificada basada en la presentación real de Magnus MMT
const MECHATRONIC_PROJECTS = [
  {
    title: "Celdas de Manufactura Flexibles",
    category: "Ingeniería & Proyectos",
    description: "Diseño y programación de lógica de control industrial y tableros a medida.",
    tag: "Proyectos Mecatrónicos",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Nodos de Adquisición IoT Robustos",
    category: "Ecosistema IoT",
    description: "Hardware de bajo costo para captura y transmisión perimetral de señales en piso.",
    tag: "MMT Core",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Líneas Automatizadas con Monitoreo",
    category: "Plataforma MMT System",
    description: "Integración completa de hardware y software para cálculo de disponibilidad y rendimiento.",
    tag: "MMT System",
    img: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=600"
  }
];

export default function HomeView() {

  // Fases del Camino MMT (Página 3 de tu documento)
  const fasesCamino = [
    {
      fase: "FASE 01",
      title: "Ingeniería & Proyectos",
      description: "Diseño de sistemas mecatrónicos, tableros de control e ingeniería operativa a la medida.",
      icon: FiCpu
    },
    {
      fase: "FASE 02",
      title: "MMT System",
      description: "Centralización de datos operacionales, métricas en tiempo real e indicadores clave (OEE) accesibles desde cualquier lugar.",
      icon: FiActivity
    },
    {
      fase: "FASE 03",
      title: "MMT Core",
      description: "Dispositivos de adquisición de datos robustos y económicos que conectan de forma directa tus máquinas.",
      icon: FiDatabase
    }
  ];

  // Pilares tecnológicos (Páginas 4 y 5 de tu documento)
  const capacidades = [
    { title: "Automatización de Procesos", desc: "Diseño, programación y despliegue de lógica de control industrial a medida para potenciar la consistencia operativa.", icon: FiCpu },
    { title: "Gestión & Consultoría", desc: "Mapeo de cuellos de botella, optimización de inventarios y reestructuración estratégica de flujos de trabajo en planta.", icon: FiTrendingUp },
    { title: "Big Data & IA", desc: "Procesamiento avanzado mediante agentes digitales y analíticas predictivas orientadas al piso de producción.", icon: FiLayers },
    { title: "Ciberseguridad Industrial", desc: "Protección integral del ecosistema perimetral, la infraestructura Cloud y las redes de adquisición de datos.", icon: FiShield }
  ];

  // Estado para controlar el carrusel de proyectos
  const [currentProject, setCurrentProject] = useState(0);

  // Efecto para la rotación automática del carrusel cada 4 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProject((prev) => (prev + 1) % MECHATRONIC_PROJECTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % MECHATRONIC_PROJECTS.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + MECHATRONIC_PROJECTS.length) % MECHATRONIC_PROJECTS.length);
  };

  return (
    <div className="space-y-20 animate-in fade-in duration-500 pb-12">
      
      {/* =========================================================================
          1. HERO SECTION (Fusión reparada y unificada con el Carrusel)
          ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 sm:p-12 md:p-16 text-center lg:text-left shadow-2xl">
        {/* Fondo decorativo con mallas y sombras de tu logo */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px]"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px]"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Lado Izquierdo: Textos Principales y Botones */}
          <div className="max-w-xl space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto lg:mx-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-400">
                Core_Interface v1.0.0
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
              Evolución Industrial e <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent font-black">
                Inteligencia Operacional
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Diseñamos soluciones mecatrónicas donde el software, el hardware y el talento humano operan en perfecta sinergia para optimizar flujos de trabajo.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/auth/login"
                className="w-full sm:w-auto text-center bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-mono font-black uppercase tracking-wider text-xs py-3.5 px-6 rounded-xl shadow-lg shadow-teal-500/5 active:scale-95 transition-all duration-150"
              >
                Acceder a MMT System
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto text-center px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Contactar Ingeniería
              </Link>
            </div>
          </div>

          {/* Lado Derecho: Carrusel de Proyectos Mecatrónicos de Magnus */}
          <div className="w-full lg:w-[380px] shrink-0 relative group/carousel mx-auto lg:mx-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-70 group-hover/carousel:opacity-100 transition-opacity" />

            <div className="relative rounded-2xl border border-slate-800/80 bg-slate-950 overflow-hidden shadow-2xl flex flex-col h-[340px]">
              
              {/* Bloque superior de la Imagen con controles */}
              <div className="relative w-full h-44 overflow-hidden bg-slate-900 border-b border-slate-900">
                <img 
                  src={MECHATRONIC_PROJECTS[currentProject].img} 
                  alt={MECHATRONIC_PROJECTS[currentProject].title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover/carousel:scale-105 opacity-60"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <span className="absolute top-3 left-3 text-[9px] font-mono font-black bg-slate-950/80 backdrop-blur-md border border-slate-800 text-emerald-400 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {MECHATRONIC_PROJECTS[currentProject].tag}
                </span>

                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 z-20">
                  <button 
                    onClick={prevProject}
                    className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white backdrop-blur-sm transition-colors"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={nextProject}
                    className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white backdrop-blur-sm transition-colors"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Bloque de Información Técnica */}
              <div className="p-5 flex-1 flex flex-col justify-between text-left">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                    // {MECHATRONIC_PROJECTS[currentProject].category}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                    {MECHATRONIC_PROJECTS[currentProject].title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 pt-1">
                    {MECHATRONIC_PROJECTS[currentProject].description}
                  </p>
                </div>

                {/* Dots del carrusel */}
                <div className="flex gap-1.5 justify-center pt-2">
                  {MECHATRONIC_PROJECTS.map((_, idx) => (
                    <span 
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        idx === currentProject ? "w-6 bg-teal-400" : "w-1 bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. NUESTRA FILOSOFÍA DE TRABAJO (Página 2 del PDF)
          ========================================================================= */}
      <section className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-[0.3em]">
          Nuestra Filosofía
        </h2>
        <p className="text-xl sm:text-1xl font-bold tracking-tight text-white leading-relaxed">
          &ldquo;Creatividad para crear valor, disciplina para enfrentar los retos y humildad para servir.&rdquo; 
        </p>
      </section>

      {/* =========================================================================
          3. EL CAMINO MMT - LAS 3 FASES (Página 3 del PDF)
          ========================================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col gap-1 border-b border-slate-900 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiLayers className="text-emerald-400" /> Evolución: El Camino MMT
          </h2>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Fases estructuradas de optimización y madurez tecnológica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fasesCamino.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-slate-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {item.fase}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-cyan-400 transition-colors">
                    <IconComponent size={16} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          4. CAPACIDADES Y SOLUCIONES TÉCNICAS (Páginas 4 y 5 del PDF)
          ========================================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col gap-1 border-b border-slate-900 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiCpu className="text-cyan-400" /> Ecosistema de Ingeniería Integrada
          </h2>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Sistemas mecatrónicos orientados a potenciar tus líneas de producción.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {capacidades.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <div 
                key={index} 
                className="flex gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-900 hover:bg-slate-900 hover:border-slate-800 transition-all duration-200"
              >
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 shrink-0 h-11 w-11 flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{cap.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-md">{cap.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}