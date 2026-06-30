import { useState, useRef, type MouseEvent, useEffect } from "react";
import { 
  FiBriefcase, FiGrid, FiUsers, FiCpu, FiGitCommit, 
  FiActivity, FiChevronLeft, FiChevronRight,
  FiZoomIn, FiZoomOut, FiMaximize2
} from "react-icons/fi";

interface CanvasNode {
  id: string;
  type: 'company' | 'department' | 'employee' | 'module' | 'process' | 'reading';
  title: string;
  subtitle: string;
}

export default function OperationalCanvas() {
  const [panelOpen, setPanelOpen] = useState(true);
  
  // ESTADOS DE NAVEGACIÓN (Zoom y Paneo)
  const [zoom, setZoom] = useState<number>(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Nodos de simulación (Estructura base de base de datos)
  const [nodes, setNodes] = useState<CanvasNode[]>([
    { id: "1", type: "company", title: "Magnus MT HQ", subtitle: "Modelo Base de Empresa" },
    { id: "2", type: "department", title: "Línea de Ensamble A", subtitle: "Departamento Operativo" },
    { id: "3", type: "process", title: "Inyección de Plástico", subtitle: "Ciclo de Proceso Lean" },
    { id: "4", type: "reading", title: "Sensor ESP32 Core", subtitle: "Adquisición de Datos OEE" },
  ]);

  const availableModules = [
    { type: "company", name: "Company Model", desc: "Nodo raíz de organización", icon: <FiBriefcase />, color: "border-cyan-500 text-cyan-400 bg-cyan-950/20" },
    { type: "department", name: "Department Model", desc: "Áreas o celdas de trabajo", icon: <FiGrid />, color: "border-blue-500 text-blue-400 bg-blue-950/20" },
    { type: "employee", name: "Employee Model", desc: "Operadores y asignaciones", icon: <FiUsers />, color: "border-purple-500 text-purple-400 bg-purple-950/20" },
    { type: "process", name: "Process Model", desc: "Flujos y operaciones Lean", icon: <FiGitCommit />, color: "border-amber-500 text-amber-400 bg-amber-950/20" },
    { type: "module", name: "Module Model", desc: "Hardware IoT asociado", icon: <FiCpu />, color: "border-emerald-500 text-emerald-400 bg-emerald-950/20" },
    { type: "reading", name: "Reading Model", desc: "Métricas y telemetría de sensores", icon: <FiActivity />, color: "border-rose-500 text-rose-400 bg-rose-950/20" },
  ];

  // INTERCEPTOR NATIVO: Evita que Shift + Rueda mueva la pantalla vertical u horizontalmente
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleNativeWheel = (e: globalThis.WheelEvent) => {
      if (e.shiftKey) {
        e.preventDefault(); // Bloqueo estricto del scroll del navegador
        
        const zoomFactor = 0.05;
        if (e.deltaY < 0) {
          setZoom((prev) => Math.min(prev + zoomFactor, 2.0));
        } else {
          setZoom((prev) => Math.max(prev - zoomFactor, 0.4));
        }
      }
    };

    // Escuchador nativo con passive: false para permitir el preventDefault sin restricciones
    canvas.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleNativeWheel);
  }, []);

  const handleAddNode = (mod: typeof availableModules[0]) => {
    const newNode: CanvasNode = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now().toString(),
      type: mod.type as CanvasNode['type'],
      title: `Nuevo ${mod.name}`,
      subtitle: "Click para configurar parámetros"
    };
    setNodes([...nodes, newNode]);
  };

  // MANEJADORES DE ZOOM MANUAL (BOTONES)
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.4));
  const handleZoomReset = () => {
    setZoom(1.0);
    setPosition({ x: 0, y: 0 });
  };

  // MANEJADORES DE ARRASTRE (PANNING)
  const handleMouseDown = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  return (
    <div className="flex flex-col gap-4 min-h-[calc(100vh-8rem)] select-none">
      
      {/* 1. ENCABEZADO SUPERIOR */}
      <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800/60 rounded-2xl px-6 py-4 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Lienzo Operativo</span>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">Mapeo Estructural: Company Core</h3>
        </div>
        <div className="text-xs text-slate-400 font-mono bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl">
          Nodos en Cadena: <span className="text-cyan-400 font-bold">{nodes.length}</span>
        </div>
      </div>

      {/* Contenedor Bajo (Herramientas + Lienzo) */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 relative">
        
        {/* PANEL IZQUIERDO: Herramientas Colapsable */}
        <div 
          className={`
            flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md
            transition-all duration-300 ease-in-out shrink-0 z-20
            ${panelOpen 
              ? "w-full lg:w-80 p-4 opacity-100" 
              : "w-0 p-0 opacity-0 border-none overflow-hidden pointer-events-none"
            }
          `}
        >
          <div className={`w-full lg:w-[286px] flex flex-col h-full ${!panelOpen && "invisible"}`}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-white">Caja de Modelos</h2>
              <button 
                onClick={() => setPanelOpen(false)}
                className="hidden lg:flex p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <FiChevronLeft size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Haz clic para instanciar el modelo.</p>
            
            <div className="
              flex flex-col gap-2.5 overflow-y-auto max-h-[55vh] pr-1
              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-slate-800/60
              [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-cyan-500/30
            ">
              {availableModules.map((mod) => (
                <button
                  key={mod.type}
                  onClick={() => handleAddNode(mod)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${mod.color}`}
                >
                  <div className="text-xl mt-0.5">{mod.icon}</div>
                  <div>
                    <div className="text-xs font-bold text-white">{mod.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{mod.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ÁREA CENTRAL: El Lienzo Operativo */}
        <div 
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          className={`
            flex-1 flex flex-col bg-slate-900/10 border border-slate-800/80 rounded-2xl relative overflow-hidden backdrop-blur-sm min-h-[520px]
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          `}
        >
          
          {/* CUADRÍCULA INTEGRAL REACALCULADA */}
          <div 
            className="absolute inset-0 z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] opacity-70"
            style={{ 
              backgroundSize: `${16 * zoom}px ${16 * zoom}px`,
              backgroundPosition: `${position.x}px ${position.y}px`
            }} 
          />

          {/* PESTAÑA PARA REABRIR PANEL */}
          {!panelOpen && (
            <button
              onClick={() => setPanelOpen(true)}
              className="absolute left-0 top-6 z-20 bg-slate-900 border border-l-0 border-slate-800 text-cyan-400 hover:text-white pl-2 pr-3 py-2 rounded-r-xl flex items-center gap-1.5 shadow-xl hover:bg-slate-800 transition-all"
            >
              <FiChevronRight size={16} />
              <span className="text-xs font-bold tracking-wider uppercase font-mono">Modelos</span>
            </button>
          )}

          {/* CONTROLES FLOTANTES DE ZOOM */}
          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl shadow-2xl backdrop-blur-md">
            <button 
              onClick={handleZoomOut}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            >
              <FiZoomOut size={16} />
            </button>
            
            <span 
              onClick={handleZoomReset}
              className="text-[10px] font-mono font-bold text-slate-400 hover:text-cyan-400 px-2 cursor-pointer"
              title="Shift + Rueda para Zoom rápido"
            >
              {Math.round(zoom * 100)}%
            </span>

            <button 
              onClick={handleZoomIn}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            >
              <FiZoomIn size={16} />
            </button>
            
            <div className="w-px h-4 bg-slate-800 mx-1" />

            <button 
              onClick={handleZoomReset}
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors"
            >
              <FiMaximize2 size={15} />
            </button>
          </div>

          {/* ESPACIO DINÁMICO DE TRABAJO */}
          <div className="flex-1 relative z-10 w-full h-full">
            <div 
              className="absolute origin-center w-full flex flex-col gap-6 items-center py-12"
              style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out' 
              }}
            >
              {nodes.map((node, index) => {
                const currentMod = availableModules.find(m => m.type === node.type);
                
                return (
                  <div key={node.id} className="flex flex-col items-center w-full max-w-md mx-auto">
                    
                    {/* Tarjeta del Nodo */}
                    <div className="w-full flex items-center justify-between p-4 rounded-xl border bg-slate-950/95 shadow-xl border-slate-800/80 hover:border-slate-700 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-lg border ${currentMod?.color}`}>
                          {currentMod?.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{node.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{node.subtitle}</p>
                        </div>
                      </div>
                      
                      <button className="text-xs text-slate-500 hover:text-white px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors">
                        Configurar
                      </button>
                    </div>

                    {/* Conector Lean */}
                    {index < nodes.length - 1 && (
                      <div className="h-6 w-0.5 bg-gradient-to-b from-cyan-500/50 to-slate-800 my-1 relative">
                        <div className="absolute -bottom-1 -left-[3px] w-2 h-2 rounded-full bg-cyan-400" />
                      </div>
                    )}

                  </div>
                );
              })}

              {nodes.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm font-medium">
                  El lienzo está vacío. Instancia módulos para trazar tu cadena de valor.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}