import { useState, useRef, type MouseEvent, useEffect, type DragEvent, type JSX } from "react";
import { useOutletContext, Link } from "react-router-dom"; // <-- Importamos Link para la navegación
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  FiBriefcase, FiGrid, FiCpu, FiGitCommit, 
  FiActivity, FiChevronLeft, FiChevronRight,
  FiZoomIn, FiZoomOut, FiMaximize2, FiMove, FiPlus, FiArrowRight
} from "react-icons/fi";
import CreateDepartmentModal from "../../components/createDepartmentModal/CreateDepartmentModal"; 
import CreateProcessModal from "../../components/createProcessModal/CreateProcessModal"; 
import { getCanvasDetails, getProcessesByDepartment } from "../../api/MainApi"; 
import api from "../../config/axios"; 
import { toast } from "sonner";

// Interfaces de tipado generales
interface CanvasNode {
  id: string;
  type: 'company' | 'department' | 'employee' | 'module' | 'process' | 'reading';
  title: string;
  subtitle: string;
  order: number;
}

interface ProcessNode {
  _id: string;
  name: string;
  description?: string;
  departmentId: string;
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

/* ==========================================================================
   COMPONENT DE COLUMNA: GESTIONA UN DEPARTAMENTO Y SUS PROCESOS VERTICALES
   ========================================================================== */
interface DepartmentColumnProps {
  node: CanvasNode;
  index: number;
  draggedNodeIndex: number | null;
  availableModules: ModuleItem[];
  onDragStart: (index: number) => void;
  onDragOver: (e: DragEvent, index: number) => void;
  onDragEnd: () => void;
  onOpenProcessModal: (departmentId: string) => void;
}

function DepartmentColumn({
  node,
  index,
  draggedNodeIndex,
  availableModules,
  onDragStart,
  onDragOver,
  onDragEnd,
  onOpenProcessModal
}: DepartmentColumnProps) {
  const queryClient = useQueryClient();
  const currentMod = availableModules.find(m => m.type === node.type);
  const isBeingDragged = index === draggedNodeIndex;

  // 1. OBTENER PROCESOS VERTICALES EXCLUSIVOS DE ESTE DEPARTAMENTO
  const { data: processData, isLoading: isLoadingProcesses } = useQuery({
    queryKey: ["processes", node.id],
    queryFn: () => getProcessesByDepartment(node.id),
    enabled: !!node.id
  });

  const [localProcesses, setLocalProcesses] = useState<ProcessNode[]>([]);
  const [draggedProcessIndex, setDraggedProcessIndex] = useState<number | null>(null);

  useEffect(() => {
    if (processData?.processes) {
      const sorted = [...processData.processes].sort((a, b) => a.order - b.order);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalProcesses(sorted);
    }
  }, [processData]);

  // 2. MUTACIÓN: Sincroniza el cambio vertical del Drag & Drop
  const updateProcessOrderMutation = useMutation({
    mutationFn: async (sortedProcesses: { id: string; order: number }[]) => {
      const { data } = await api.put(`/department/process/order`, { sortedProcesses });
      return data;
    },
    onSuccess: () => {
      toast.success("Flujo vertical guardado");
      queryClient.invalidateQueries({ queryKey: ["processes", node.id] });
    },
    onError: () => {
      toast.error("Error al guardar la secuencia vertical");
    }
  });

  const handleProcessDragStart = (e: DragEvent, pIndex: number) => {
    e.stopPropagation();
    setDraggedProcessIndex(pIndex);
  };

  const handleProcessDragOver = (e: DragEvent, pIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedProcessIndex === null || draggedProcessIndex === pIndex) return;

    const updated = [...localProcesses];
    const draggedItem = updated[draggedProcessIndex];
    updated.splice(draggedProcessIndex, 1);
    updated.splice(pIndex, 0, draggedItem);

    setDraggedProcessIndex(pIndex);
    setLocalProcesses(updated);
  };

  const handleProcessDragEnd = (e: DragEvent) => {
    e.stopPropagation();
    setDraggedProcessIndex(null);

    const sortedPayload = localProcesses.map((proc, idx) => ({
      id: proc._id,
      order: idx
    }));

    updateProcessOrderMutation.mutate(sortedPayload);
  };

  return (
    <div 
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={`flex flex-col items-center gap-4 transition-all duration-200 select-none ${
        isBeingDragged ? "opacity-30 scale-95 cursor-grabbing" : "opacity-100"
      }`}
    >
      {/* 1. Celda Madre: Departamento */}
      <div className="w-80 flex items-center justify-between p-4 rounded-xl border bg-slate-950/95 shadow-xl border-slate-800/80 hover:border-slate-700 transition-colors group relative cursor-grab active:cursor-grabbing">
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
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onOpenProcessModal(node.id);
          }}
          className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-white px-2.5 py-1.5 bg-amber-950/20 hover:bg-amber-500 rounded-lg border border-amber-500/30 transition-colors shrink-0"
        >
          <FiPlus size={12} />
          Proceso
        </button>
      </div>

      {localProcesses.length > 0 && <div className="w-0.5 h-4 bg-amber-500/40" />}

      {/* 2. Pila de Procesos */}
      <div className="flex flex-col gap-3 items-center w-full">
        {isLoadingProcesses ? (
          <div className="text-[10px] text-slate-500 font-mono">Cargando flujos...</div>
        ) : (
          localProcesses.map((proc, pIdx) => (
            <div key={proc._id} className="flex flex-col items-center w-full">
              
              {/* Tarjeta del Proceso con enlace integrado */}
              <div
                draggable
                onDragStart={(e) => handleProcessDragStart(e, pIdx)}
                onDragOver={(e) => handleProcessDragOver(e, pIdx)}
                onDragEnd={handleProcessDragEnd}
                className={`w-72 flex items-center justify-between p-3 bg-slate-900 border border-amber-500/20 hover:border-amber-500/50 rounded-xl shadow-lg cursor-grab active:cursor-grabbing transition-all group ${
                  pIdx === draggedProcessIndex ? "opacity-30 scale-95" : "opacity-100"
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="p-1.5 bg-amber-950/40 border border-amber-500/40 text-amber-400 rounded-lg shrink-0">
                    <FiGitCommit size={14} />
                  </div>
                  <div className="overflow-hidden">
                    <h5 className="text-xs font-bold text-slate-200 truncate">{proc.name}</h5>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {proc.description || "Sin descripción estándar"}
                    </p>
                  </div>
                </div>

                {/* BOTÓN INTERACTIVO DE NAVEGACIÓN HACIA EL DETALLE */}
                <Link
                  to={`/admin/processes/${proc._id}`}
                  onClick={(e) => e.stopPropagation()} // Evita activar el arrastre al hacer clic
                  className="p-1.5 bg-slate-950 hover:bg-amber-500 border border-slate-800 hover:border-amber-400 text-slate-400 hover:text-slate-950 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                  title="Abrir monitoreo del proceso"
                >
                  <FiArrowRight size={12} />
                </Link>
              </div>

              {pIdx < localProcesses.length - 1 && (
                <div className="w-0.5 h-3 bg-amber-500/30" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   COMPONENT PRINCIPAL DEL LIENZO OPERATIVO
   ========================================================================== */
export default function OperationalCanvas() {
  const { activeCompany } = useOutletContext<LayoutContext>();
  const queryClient = useQueryClient();

  const [panelOpen, setPanelOpen] = useState(true);
  const [zoom, setZoom] = useState<number>(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [draggedNodeIndex, setDraggedNodeIndex] = useState<number | null>(null);
  
  const [isDepModalOpen, setIsDepModalOpen] = useState(false);
  const [isProcModalOpen, setIsProcModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");

  const { data: canvasData, isLoading: isLoadingCanvas } = useQuery({
    queryKey: ["departments", activeCompany?._id],
    queryFn: () => getCanvasDetails(activeCompany!._id),
    enabled: !!activeCompany?._id,
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (sortedNodes: { id: string; order: number }[]) => {
      const { data } = await api.put(`/department/order`, { sortedNodes });
      return data;
    },
    onSuccess: () => {
      toast.success("Distribución de planta sincronizada en la BD");
      queryClient.invalidateQueries({ queryKey: ["departments", activeCompany?._id] });
    },
    onError: () => {
      toast.error("Error al guardar la nueva secuencia de departamentos");
    }
  });

  useEffect(() => {
    if (canvasData?.departments) {
      const mappedNodes: CanvasNode[] = canvasData.departments.map((dep: { _id: string; name: string; order: number }) => ({
        id: dep._id,
        type: "department",
        title: dep.name,
        subtitle: "Departamento Operativo",
        order: dep.order ?? 0
      }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNodes(mappedNodes.sort((a, b) => a.order - b.order));
    } else {
      setNodes([]);
    }
  }, [canvasData]);

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
        if (e.deltaY < 0) setZoom((prev) => Math.min(prev + zoomFactor, 2.0));
        else setZoom((prev) => Math.max(prev - zoomFactor, 0.4));
      }
    };

    canvas.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleNativeWheel);
  }, []);

  const handleAddNodeClick = (mod: ModuleItem) => {
    if (mod.type === "department") {
      setIsDepModalOpen(true);
    } else {
      toast.info("Para agregar un proceso, usa el botón rápido '+' de tu departamento");
    }
  };

  const handleDepartmentCreated = (newDepartmentNode: unknown) => {
    const departmentNode = newDepartmentNode as CanvasNode;
    setNodes((prevNodes) => [...prevNodes, departmentNode]);
    queryClient.invalidateQueries({ queryKey: ["departments", activeCompany?._id] });
  };

  const handleProcessCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["processes", selectedDepartmentId] });
  };

  const handleOpenProcessModal = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setIsProcModalOpen(true);
  };

  const handleMouseDown = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('.draggable-node')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handleHorizontalDragStart = (index: number) => {
    setDraggedNodeIndex(index);
  };

  const handleHorizontalDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (draggedNodeIndex === null || draggedNodeIndex === index) return;

    const updatedNodes = [...nodes];
    const draggedItem = updatedNodes[draggedNodeIndex];
    updatedNodes.splice(draggedNodeIndex, 1);
    updatedNodes.splice(index, 0, draggedItem);

    setDraggedNodeIndex(index);
    setNodes(updatedNodes);
  };

  const handleHorizontalDragEnd = () => {
    setDraggedNodeIndex(null);
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
        </div>
      </div>
    );
  }

  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.4));
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2.0));

  return (
    <div className="flex flex-col gap-4 min-h-[calc(100vh-8rem)] select-none">
      {/* 1. ENCABEZADO SUPERIOR */}
      <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800/60 rounded-2xl px-6 py-4 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Lienzo Operativo Matrix VSM</span>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">Organización: {activeCompany.companyname}</h3>
        </div>
        <div className="text-xs text-slate-400 font-mono bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl">
          Celdas: <span className="text-cyan-400 font-bold">{nodes.length}</span>
        </div>
      </div>

      {/* 2. AREA DE TRABAJO GENERAL */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 relative">
        {/* PANEL IZQUIERDO: Modelos */}
        <div className={`flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md transition-all duration-300 ease-in-out shrink-0 z-20 ${panelOpen ? "w-full lg:w-80 p-4" : "w-0 p-0 border-none overflow-hidden pointer-events-none"}`}>
          <div className={`w-full lg:w-[286px] flex flex-col h-full ${!panelOpen && "invisible"}`}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-white">Modelos MMT</h2>
              <button onClick={() => setPanelOpen(false)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400"><FiChevronLeft size={18} /></button>
            </div>
            <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[55vh] mt-4">
              {availableModules.map((mod) => (
                <button key={mod.type} onClick={() => handleAddNodeClick(mod)} className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${mod.color}`}>
                  <div className="text-xl mt-0.5">{mod.icon}</div>
                  <div>
                    <div className="text-xs font-bold text-white">{mod.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{mod.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LIENZO DE RENDERIZADO */}
        <div ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)} className={`flex-1 flex flex-col bg-slate-900/10 border border-slate-800/80 rounded-2xl relative overflow-hidden backdrop-blur-sm min-h-[550px] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
          <div className="absolute inset-0 z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] opacity-70" style={{ backgroundSize: `${16 * zoom}px ${16 * zoom}px`, backgroundPosition: `${position.x}px ${position.y}px` }} />

          {!panelOpen && (
            <button onClick={() => setPanelOpen(true)} className="absolute left-0 top-6 z-20 bg-slate-900 border border-l-0 border-slate-800 text-cyan-400 pl-2 pr-3 py-2 rounded-r-xl flex items-center gap-1.5"><FiChevronRight size={16} /><span className="text-xs font-bold font-mono">Modelos</span></button>
          )}

          {/* ESPACIO DINÁMICO BIDIMENSIONAL */}
          <div className="flex-1 relative z-10 w-full h-full">
            {isLoadingCanvas ? (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-mono">Sincronizando matriz...</div>
            ) : (
              <div 
                className="absolute origin-center h-full flex flex-row items-start gap-8 pt-16 px-12"
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out' 
                }}
              >
                {nodes.map((node, index) => (
                  <div key={node.id} className="draggable-node flex flex-row items-start shrink-0">
                    <DepartmentColumn
                      node={node}
                      index={index}
                      draggedNodeIndex={draggedNodeIndex}
                      availableModules={availableModules}
                      onDragStart={handleHorizontalDragStart}
                      onDragOver={handleHorizontalDragOver}
                      onDragEnd={handleHorizontalDragEnd}
                      onOpenProcessModal={handleOpenProcessModal}
                    />

                    {index < nodes.length - 1 && (
                      <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-500/40 to-slate-800 mt-6 mx-1 relative shrink-0">
                        <div className="absolute -right-1 -top-[3px] w-2 h-2 rounded-full bg-cyan-400" />
                      </div>
                    )}
                  </div>
                ))}

                {nodes.length === 0 && (
                  <div className="text-center w-full text-slate-500 text-xs font-mono pt-12">No hay celdas operativas en esta empresa.</div>
                )}
              </div>
            )}
          </div>

          {/* CONTROLES DE ZOOM */}
          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl shadow-2xl backdrop-blur-md">
            <button onClick={handleZoomOut} className="p-2 text-slate-400 hover:text-white"><FiZoomOut size={16} /></button>
            <span className="text-[10px] font-mono font-bold text-slate-400 px-2">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="p-2 text-slate-400 hover:text-white"><FiZoomIn size={16} /></button>
            <div className="w-px h-4 bg-slate-800 mx-1" />
            <button onClick={() => setZoom(1.0)} className="p-2 text-slate-400 hover:text-cyan-400" title="Restaurar vista"><FiMaximize2 size={15} /></button>
          </div>
        </div>
      </div>

      <CreateDepartmentModal
        isOpen={isDepModalOpen}
        onClose={() => setIsDepModalOpen(false)}
        canvasId={activeCompany.canvas || ""}
        companyId={activeCompany._id}
        onDepartmentCreated={handleDepartmentCreated}
      />

      <CreateProcessModal
        isOpen={isProcModalOpen}
        onClose={() => setIsProcModalOpen(false)}
        departmentId={selectedDepartmentId}
        onProcessCreated={handleProcessCreated}
      />
    </div>
  );
}