import { Link } from "react-router-dom";
import { 
  FiCpu, 
  FiLayers, 
  FiActivity, 
  FiDatabase, 
  FiChevronLeft,
  FiChevronRight,
  FiLink
} from "react-icons/fi";
import { useEffect, useState } from "react";

// Data unificada basada en la presentación real de Magnus MMT
const MECHATRONIC_PROJECTS = [
  {
    title: "Proyectos Mecatrónicos",
    category: "Ingeniería",
    description: "Análisis, diseño e implementación de proyectos mecatrónicos, integración de sistemas y optimización de procesos.",
    tag: "Proyectos Mecatrónicos",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "MMT Core",
    category: "Hardware",
    description: "Hardware de bajo costo para captura y transmisión perimetral de señales en piso.",
    tag: "MMT Core",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "MMT System",
    category: "Software",
    description: "Integración completa de hardware y software para cálculo de disponibilidad y rendimiento.",
    tag: "MMT System",
    img: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=600"
  }
];

export default function HomeView() {

  // Fases corregidas en orden lógico de automatización industrial
  const fasesCamino = [
    {
      fase: "Ingeniería",
      title: "Proyectos de ingeniería",
      description: "Diseño de sistemas mecatrónicos, integración de automatización, agentes digitales y dispositivos de recolección de datos. All in One Solutions.",
      icon: FiCpu
    },
    {
      fase: "Hardware",
      title: "MMT Core",
      description: "Dispositivos de adquisición de datos robustos y económicos que conectan tu operación a la plataforma MMT System.",
      icon: FiDatabase
    },
    {
      fase: "Software",
      title: "MMT System",
      description: "Centralización de datos operacionales, métricas en tiempo real e indicadores clave (OEE) accesibles desde cualquier lugar.",
      icon: FiActivity
    }
  ];

  // Ecosistema Magnus MT completo con sus 5 pilares técnicos
  const capacidades = [
    {
      title: "Optimización Lean y Monitoreo de OEE",
      desc: "Capturamos datos directo desde el piso de producción en tiempo real. Eliminamos los registros manuales para identificar cuellos de botella y calcular la eficiencia real de tu proceso.",
      icon: FiCpu
    },
    {
      title: "Convergencia IT / OT",
      desc: "Conectamos el mundo físico con el digital. Creamos un puente seguro entre tus equipos de planta (sensores y PLCs) y nuestra plataforma en la nube para centralizar tu operación.",
      icon: FiLink
    },
    {
      title: "Conectividad Industrial Modular",
      desc: "Diseño flexible y compatible. Soportamos los protocolos estándar de la industria, garantizando que el sistema se adapte a tu infraestructura actual sin importar la marca.",
      icon: FiLayers
    },

    {
      title: "Trazabilidad y Respaldo de Datos",
      desc: "Almacenamos tu telemetría e historiales de forma masiva, segura e inmutable. La información crítica de tu planta siempre estará lista y disponible para auditorías de calidad.",
      icon: FiDatabase
    }
  ];

  const [currentProject, setCurrentProject] = useState(0);

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
      
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 sm:p-12 md:p-16 text-center lg:text-left shadow-2xl">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px]"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px]"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="max-w-xl space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto lg:mx-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-400">
                {new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
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

          {/* Lado Derecho: Carrusel */}
          <div className="w-full lg:w-[380px] shrink-0 relative group/carousel mx-auto lg:mx-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-70 group-hover/carousel:opacity-100 transition-opacity" />

            <div className="relative rounded-2xl border border-slate-800/80 bg-slate-950 overflow-hidden shadow-2xl flex flex-col h-[340px]">
              
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

      {/* 2. NUESTRA FILOSOFÍA DE TRABAJO */}
      <section className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-[0.3em]">
          Nuestra Filosofía
        </h2>
        <p className="text-xl font-bold tracking-tight text-white leading-relaxed">
          &ldquo;Creatividad para crear valor, disciplina para enfrentar los retos y humildad para servir.&rdquo; 
        </p>
      </section>

      {/* 3. EL CAMINO MMT - LAS 3 FASES */}
      <section className="space-y-8">
        <div className="flex flex-col gap-1 border-b border-slate-900 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiLayers className="text-emerald-400" /> Servicios
          </h2>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Fases de integración tecnológica para transformar tu planta en un ecosistema inteligente.
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

      {/* 4. CAPACIDADES Y SOLUCIONES TÉCNICAS */}
      <section className="space-y-8">
        <div className="flex flex-col gap-1 border-b border-slate-900 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiCpu className="text-cyan-400" /> Ecosistema
          </h2>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Ingeniería Basada en Estándares y Metodologías Globales.
          </p>
        </div>

        {/* Ajustado a grid de 3 columnas en pantallas grandes para balancear los 5 elementos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
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
                  <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}