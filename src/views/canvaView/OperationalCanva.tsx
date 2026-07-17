import { useState, useRef, type MouseEvent, useEffect, type DragEvent, type JSX } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  FiBriefcase, FiGrid, FiCpu, FiGitCommit, 
  FiActivity, FiChevronLeft, FiChevronRight,
  FiZoomIn, FiZoomOut, FiMaximize2, FiMove
} from "react-icons/fi";
import CreateDepartmentModal from "../../components/createDepartmentModal/CreateDepartmentModal"; 
import { getCanvasDetails } from "../../api/MainApi"; // Importa tu función de API corregida sin los ":"
import api from "../../config/axios"; // Para tus peticiones mutantes como reordenar
import { toast } from "sonner";

// Interfaces de tipado
interface CanvasNode {
  id: string;
  type: 'company' | 'department' | 'employee' | 'module' | 'process' | 'reading';
  title: string;
  subtitle: string;
  order: number;
}

interface LayoutContext {
  user: unknown;
  activeCompany: {
    _id: string;
    companyname: string;
    canvas?: string;
  } | undefined;
}

interface ModuleItem {
  type: CanvasNode['type'] | 'form';
  name: string;
  desc: string;
  icon: JSX.Element;
  color: string;
}

export default function OperationalCanvas() {
  const { activeCompany } = useOutletContext<LayoutContext>();
  const queryClient = useQueryClient();

  const [panelOpen, setPanelOpen] = useState(true);
  
  // ESTADOS DE NAVEGACIÓN (Zoom, Paneo y arrastre)
  const [zoom, setZoom] = useState<number>(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // NODOS REALES DEL ESTADO LOCAL
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [draggedNodeIndex, setDraggedNodeIndex] = useState<number | null>(null);
  const [isDepModalOpen, setIsDepModalOpen] = useState(false);

  // 1. PETICIÓN REAL: Obtiene los departamentos mapeando la llamada de Axios corregida
  const { data: canvasData, isLoading: isLoadingCanvas } = useQuery({
    queryKey: ["departments", activeCompany?._id],
    queryFn: () => getCanvasDetails(activeCompany!._id),
    enabled: !!activeCompany?._id, // Solo se dispara si hay compañía seleccionada
  });

  // 2. MUTACIÓN: Sincroniza de manera persistente el nuevo orden del Drag & Drop horizontal en la BD
  const updateOrderMutation = useMutation({
    mutationFn: async (sortedNodes: { id: string; order: number }[]) => {
      // Ajusta este endpoint según tu enrutador en Express
      const { data } = await api.put(`/department/order`, { sortedNodes });
      return data;
    },
    onSuccess: () => {
      toast.success("Distribución de planta sincronizada en la BD");
      // Refrescamos caché
      queryClient.invalidateQueries({ queryKey: ["departments", activeCompany?._id] });
    },
    onError: () => {
      toast.error("Error al guardar la nueva secuencia de departamentos");
    }
  });

  // 3. Sincronizar el estado local cuando la base de datos responda
  useEffect(() => {
    if (canvasData && canvasData.departments) {
      const mappedNodes: CanvasNode[] = canvasData.departments.map((dep: unknown) => ({
        id: (dep as { _id: string })._id,
        type: "department",
        title: (dep as { name: string }).name,
        subtitle: "Departamento Operativo",
        order: (dep as { order?: number }).order ?? 0
      }));

      // Ordenar secuencialmente por el campo order
      const sorted = mappedNodes.sort((a, b) => a.order - b.order);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNodes(sorted);
    } else {
      setNodes([]);
    }
  }, [canvasData]);

  // Limpieza y centrado cuando se cambia de empresa en el sidebar
  useEffect(() => {
    if (activeCompany) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosition({ x: 0, y: 0 });
      setZoom(1.0);
    }
  }, [activeCompany]);

  const availableModules: ModuleItem[] = [
    { type: "department", name: "Department Model", desc: "Áreas o celdas de trabajo", icon: <FiGrid />, color: "border-blue-500 text-blue-400 bg-blue-950/20" },
    { type: "process", name: "Process Model", desc: "Flujos y operaciones Lean", icon: <FiGitCommit />, color: "border-amber-500 text-amber-400 bg-amber-950/20" },
    { type: "form", name: "Form Model", desc: "Formularios de datos", icon: <FiActivity />, color: "border-rose-500 text-rose-400 bg-rose-950/20" },
    { type: "module", name: "Module Model", desc: "Hardware IoT asociado", icon: <FiCpu />, color: "border-emerald-500 text-emerald-400 bg-emerald-950/20" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleNativeWheel = (e: globalThis.WheelEvent) => {
      if (e.shiftKey) {
        e.preventDefault();
        const zoomFactor = 0.05;
        if (e.deltaY < 0) {
          setZoom((prev) => Math.min(prev + zoomFactor, 2.0));
        } else {
          setZoom((prev) => Math.max(prev - zoomFactor, 0.4));
        }
      }
    };

    canvas.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleNativeWheel);
  }, []);

  const handleAddNodeClick = (mod: ModuleItem) => {
    if (mod.type === "department") {
      setIsDepModalOpen(true);
    } else {
      // Para otros tipos de módulos que implementarás a futuro en memoria local
      const newNode: CanvasNode = {
        // eslint-disable-next-line react-hooks/purity
        id: Date.now().toString(),
        type: mod.type as CanvasNode['type'],
        title: `Nuevo ${mod.name}`,
        subtitle: "Click para configurar parámetros",
        order: nodes.length
      };
      setNodes([...nodes, newNode]);
    }
  };

  const handleDepartmentCreated = (newDepartmentNode: unknown) => {
    const typedNode = newDepartmentNode as CanvasNode;
    setNodes((prevNodes) => [...prevNodes, typedNode]);
    queryClient.invalidateQueries({ queryKey: ["departments", activeCompany?._id] });
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.4));
  const handleZoomReset = () => {
    setZoom(1.0);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('button') || 
      (e.target as HTMLElement).closest('.draggable-node')
    ) return;
    
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

  // --- DRAG AND DROP NATIVO HORIZONTAL ---
  const handleDragStart = (index: number) => {
    setDraggedNodeIndex(index);
  };

  const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (draggedNodeIndex === null || draggedNodeIndex === index) return;

    const updatedNodes = [...nodes];
    const draggedItem = updatedNodes[draggedNodeIndex];
    
    updatedNodes.splice(draggedNodeIndex, 1);
    updatedNodes.splice(index, 0, draggedItem);

    setDraggedNodeIndex(index);
    setNodes(updatedNodes);
  };

  const handleDragEnd = () => {
    setDraggedNodeIndex(null);
    
    // Generamos el payload para actualizar los campos `order` de cada documento en base de datos
    const sortedPayload = nodes.map((node, index) => ({
      id: node.id,
      order: index
    }));

    updateOrderMutation.mutate(sortedPayload);
  };

  if (!activeCompany) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-6 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
        <div className="text-center max-w-sm flex flex-col items-center gap-3">
          <div className="p-4 bg-slate-900 border border-slate-800 text-cyan-400 rounded-2xl shadow-xl">
            <FiBriefcase size={24} />
          </div>
          <h3 className="text-base font-bold text-white">Ninguna Organización Seleccionada</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Por favor selecciona una empresa del menú lateral o crea una nueva para poder configurar y desplegar tu arquitectura de procesos e IoT.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 min-h-[calc(100vh-8rem)] select-none">
      
      {/* 1. ENCABEZADO SUPERIOR DINÁMICO */}
      <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800/60 rounded-2xl px-6 py-4 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Lienzo Operativo</span>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
            Organización: {activeCompany.companyname}
          </h3>
        </div>
        <div className="text-xs text-slate-400 font-mono bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl">
          Nodos: <span className="text-cyan-400 font-bold">{nodes.length}</span>
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
              <h2 className="text-base font-bold text-white">Modelos</h2>
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
                  onClick={() => handleAddNodeClick(mod)}
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
          {/* CUADRÍCULA INTEGRAL */}
          <div 
            className="absolute inset-0 z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] opacity-70"
            style={{ 
              backgroundSize: `${16 * zoom}px ${16 * zoom}px`,
              backgroundPosition: `${position.x}px ${position.y}px`
            }} 
          />

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
            {isLoadingCanvas ? (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-mono">
                Cargando cadena de valor desde la base de datos...
              </div>
            ) : (
              <div 
                className="absolute origin-center h-full flex flex-row items-center gap-4 px-12"
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out' 
                }}
              >
                {nodes.map((node, index) => {
                  const currentMod = availableModules.find(m => m.type === node.type);
                  const isBeingDragged = index === draggedNodeIndex;
                  
                  return (
                    <div 
                      key={node.id} 
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`
                        draggable-node flex items-center transition-all duration-200 select-none
                        ${isBeingDragged ? "opacity-30 scale-95 cursor-grabbing" : "opacity-100 cursor-grab"}
                      `}
                    >
                      {/* Tarjeta del Nodo */}
                      <div className="w-80 flex items-center justify-between p-4 rounded-xl border bg-slate-950/95 shadow-xl border-slate-800/80 hover:border-slate-700 transition-colors group relative">
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 text-slate-400 transition-opacity pointer-events-none">
                          <FiMove size={12} />
                        </div>

                        <div className="flex items-center gap-3.5 pl-2">
                          <div className={`p-2.5 rounded-lg border ${currentMod?.color}`}>
                            {currentMod?.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white tracking-tight truncate w-36">{node.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 truncate w-36">{node.subtitle}</p>
                          </div>
                        </div>
                        
                        <button className="text-[11px] text-slate-400 hover:text-white px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors shrink-0">
                          Configurar
                        </button>
                      </div>

                      {/* Conector Lean Horizontal */}
                      {index < nodes.length - 1 && (
                        <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-500/50 to-slate-800 mx-1 relative shrink-0">
                          <div className="absolute -right-1 -top-[3px] w-2 h-2 rounded-full bg-cyan-400" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {nodes.length === 0 && (
                  <div className="text-center w-full text-slate-500 text-xs font-mono px-12">
                    No se encontraron departamentos. Instancia un "Department Model" para empezar.
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* RENDERIZADO DEL MODAL */}
      {activeCompany && activeCompany.canvas && (
        <CreateDepartmentModal
          isOpen={isDepModalOpen}
          onClose={() => setIsDepModalOpen(false)}
          canvasId={activeCompany.canvas}
          companyId={activeCompany._id}
          onDepartmentCreated={handleDepartmentCreated}
        />
      )}
    </div>
  );
}