import { useState, useRef, type MouseEvent, useEffect, type DragEvent } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  FiBriefcase, FiGitCommit, FiZoomIn, FiZoomOut, 
  FiMaximize2, FiMove, FiPlus, FiArrowRight, FiGrid
} from "react-icons/fi";
import CreateDepartmentModal from "../../components/createDepartmentModal/CreateDepartmentModal"; 
import CreateProcessModal from "../../components/createProcessModal/CreateProcessModal"; 
import { getCanvasDetails, getProcessesByDepartment } from "../../api/MainApi"; 
import api from "../../config/axios"; 
import { toast } from "sonner";

// =========================================================================
// 1. INTERFACES Y CONTRATOS DE DATOS (TypeScript)
// =========================================================================

/** Estructura de cada nodo horizontal en el canvas (Departamento) */
interface CanvasNode {
  id: string;
  type: 'company' | 'department' | 'employee' | 'module' | 'process' | 'reading';
  title: string;
  subtitle: string;
  order: number;
}

/** Estructura de un proceso perteneciente a la jerarquía vertical de un departamento */
interface ProcessNode {
  _id: string;
  name: string;
  description?: string;
  departmentId: string;
  order: number;
}

/** Objeto de contexto inyectado desde el AppLayout mediante useOutletContext */
interface LayoutContext {
  user: unknown;
  activeCompany: {
    _id: string;
    companyname: string;
    canvas?: string;
  } | undefined;
}

/* =========================================================================
   2. COMPONENTE HIJO: COLUMNA DE DEPARTAMENTO (Pila Vertical de Procesos)
   =========================================================================
   Responsabilidad: Renderizar la celda madre del departamento y la secuencia
   vertical de procesos asignados. Maneja su propio Drag & Drop local.
   ========================================================================= */
interface DepartmentColumnProps {
  node: CanvasNode;
  index: number;
  draggedNodeIndex: number | null;
  onDragStart: (index: number) => void;
  onDragOver: (e: DragEvent, index: number) => void;
  onDragEnd: () => void;
  onOpenProcessModal: (departmentId: string) => void;
}

function DepartmentColumn({
  node,
  index,
  draggedNodeIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
  onOpenProcessModal
}: DepartmentColumnProps) {
  const queryClient = useQueryClient();
  const isBeingDragged = index === draggedNodeIndex;

  // --- CONSULTA HTTP ASÍNCRONA (TanStack Query) ---
  // Obtiene los procesos asociados al ID del departamento.
  // La opción 'select' transforma y ordena los datos directamente al recibirlos,
  // eliminando la necesidad de hooks 'useEffect' y evitando re-renders en cascada.
  const { data: remoteProcesses = [], isLoading: isLoadingProcesses } = useQuery({
    queryKey: ["processes", node.id],
    queryFn: () => getProcessesByDepartment(node.id),
    enabled: !!node.id, // Solo se ejecuta si el ID del nodo es válido
    select: (data) => {
      if (!data?.processes) return [];
      return [...data.processes].sort((a, b) => a.order - b.order) as ProcessNode[];
    }
  });

  // --- ESTADOS LOCALES PARA INTERACCIÓN REORDENABLE (DnD) ---
  const [draggedProcessIndex, setDraggedProcessIndex] = useState<number | null>(null);
  const [localProcesses, setLocalProcesses] = useState<ProcessNode[] | null>(null);

  // Derivación de estado: Si hay un arrastre activo se usa la lista local interactiva,
  // de lo contrario se renderiza la respuesta sincronizada de la base de datos.
  const displayProcesses = localProcesses ?? remoteProcesses;

  // --- MUTACIÓN HTTP: Persistencia de orden vertical ---
  const updateProcessOrderMutation = useMutation({
    mutationFn: async (sortedProcesses: { id: string; order: number }[]) => {
      const { data } = await api.put(`/department/process/order`, { sortedProcesses });
      return data;
    },
    onSuccess: () => {
      toast.success("Flujo vertical guardado");
      setLocalProcesses(null); // Libera la copia local tras confirmar el guardado
      queryClient.invalidateQueries({ queryKey: ["processes", node.id] }); // Invalida caché para refrescar
    },
    onError: () => {
      toast.error("Error al guardar la secuencia vertical");
      setLocalProcesses(null);
    }
  });

  // --- CONTROLADORES DRAG & DROP VERTICAL (PROCESOS) ---
  const handleProcessDragStart = (e: DragEvent, pIndex: number) => {
    e.stopPropagation(); // Evita que se dispare el evento de arrastre del departamento padre
    setDraggedProcessIndex(pIndex);
    setLocalProcesses([...displayProcesses]); // Crea la copia local de trabajo
  };

  const handleProcessDragOver = (e: DragEvent, pIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedProcessIndex === null || draggedProcessIndex === pIndex || !localProcesses) return;

    // Intercambio dinámico de elementos para ofrecer retroalimentación visual fluida
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

    if (!localProcesses) return;

    // Prepara el arreglo normalizado con los nuevos índices para el Backend
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
      {/* 2.1 CELDA PADRE: DEPARTAMENTO */}
      <div className="w-80 flex items-center justify-between p-4 rounded-xl border bg-slate-950/95 shadow-xl border-slate-800/80 hover:border-slate-700 transition-colors group relative cursor-grab active:cursor-grabbing">
        {/* Indicador visual de movimiento (icono visible al hacer Hover) */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 text-slate-400 transition-opacity pointer-events-none">
          <FiMove size={12} />
        </div>

        <div className="flex items-center gap-3.5 pl-2">
          <div className="p-2.5 rounded-lg border border-blue-500 text-blue-400 bg-blue-950/20">
            <FiGrid size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight truncate w-36">{node.title}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate w-36">{node.subtitle}</p>
          </div>
        </div>
        
        {/* Botón interactivo para añadir proceso hijo */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Evita iniciar el arrastre al hacer clic
            onOpenProcessModal(node.id);
          }}
          className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-white px-2.5 py-1.5 bg-amber-950/20 hover:bg-amber-500 rounded-lg border border-amber-500/30 transition-colors shrink-0 cursor-pointer"
        >
          <FiPlus size={12} />
          Proceso
        </button>
      </div>

      {/* Línea conectora gráfica vertical */}
      {displayProcesses.length > 0 && <div className="w-0.5 h-4 bg-amber-500/40" />}

      {/* 2.2 PILA VERTICAL DE PROCESOS */}
      <div className="flex flex-col gap-3 items-center w-full">
        {isLoadingProcesses ? (
          <div className="text-[10px] text-slate-500 font-mono">Cargando flujos...</div>
        ) : (
          displayProcesses.map((proc, pIdx) => (
            <div key={proc._id} className="flex flex-col items-center w-full">
              
              {/* Tarjeta individual de proceso */}
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

                {/* Enlace directo a la vista detallada del proceso */}
                <Link
                  to={`/admin/processes/${proc._id}`}
                  onClick={(e) => e.stopPropagation()} // Previene falsos activadores de arrastre
                  className="p-1.5 bg-slate-950 hover:bg-amber-500 border border-slate-800 hover:border-amber-400 text-slate-400 hover:text-slate-950 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                  title="Abrir monitoreo del proceso"
                >
                  <FiArrowRight size={12} />
                </Link>
              </div>

              {/* Conector gráfico inter-procesos */}
              {pIdx < displayProcesses.length - 1 && (
                <div className="w-0.5 h-3 bg-amber-500/30" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   3. COMPONENTE PRINCIPAL: OperationalCanvas (Lienzo Bidimensional VSM)
   =========================================================================
   Gestor central de la experiencia de usuario: Administra la cámara (Pan & Zoom),
   el reordenamiento de departamentos y el diseño adaptable de pantalla completa.
   ========================================================================= */
export default function OperationalCanvas() {
  const { activeCompany } = useOutletContext<LayoutContext>();
  const queryClient = useQueryClient();

  // --- ESTADOS DE CÁMARA / VIEWPORT ---
  const [zoom, setZoom] = useState<number>(1.0); // Factor de escala (0.4x a 2.0x)
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Posición de traslación (X, Y)
  const [isDragging, setIsDragging] = useState(false); // Bandera para indicar cuando el ratón arrastra el lienzo
  
  // Referencias mutables para el cálculo exacto del movimiento del ratón sin activar renders extras
  const dragStart = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- ESTADOS DE DATOS Y MODALES ---
  const [draggedNodeIndex, setDraggedNodeIndex] = useState<number | null>(null);
  const [localNodes, setLocalNodes] = useState<CanvasNode[] | null>(null);

  const [isDepModalOpen, setIsDepModalOpen] = useState(false);
  const [isProcModalOpen, setIsProcModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");

  // --- OBTENCIÓN Y TRANSFORMACIÓN DE DEPARTAMENTOS ---
  // Utiliza 'select' para formatear la respuesta del Backend directamente en la capa de datos
  const { data: remoteNodes = [], isLoading: isLoadingCanvas } = useQuery({
    queryKey: ["departments", activeCompany?._id],
    queryFn: () => getCanvasDetails(activeCompany!._id),
    enabled: !!activeCompany?._id,
    select: (data) => {
      if (!data?.departments) return [];
      return data.departments
        .map((dep: { _id: string; name: string; order: number }) => ({
          id: dep._id,
          type: "department" as const,
          title: dep.name,
          subtitle: "Departamento Operativo",
          order: dep.order ?? 0
        }))
        .sort((a: CanvasNode, b: CanvasNode) => a.order - b.order);
    }
  });

  // Lista activa de nodos a desplegar
  const nodes = localNodes ?? remoteNodes;

  // --- MUTACIÓN HTTP: Guardar secuencia horizontal de departamentos ---
  const updateOrderMutation = useMutation({
    mutationFn: async (sortedNodes: { id: string; order: number }[]) => {
      const { data } = await api.put(`/department/order`, { sortedNodes });
      return data;
    },
    onSuccess: () => {
      toast.success("Distribución de planta sincronizada en la BD");
      setLocalNodes(null);
      queryClient.invalidateQueries({ queryKey: ["departments", activeCompany?._id] });
    },
    onError: () => {
      toast.error("Error al guardar la nueva secuencia de departamentos");
      setLocalNodes(null);
    }
  });

  // --- ESCUCHADOR NATIVO: Zoom con la rueda del ratón (Shift + Scroll) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleNativeWheel = (e: globalThis.WheelEvent) => {
      if (e.shiftKey) {
        e.preventDefault(); // Inhibe el desplazamiento de la página por defecto
        const zoomFactor = 0.05;
        if (e.deltaY < 0) setZoom((prev) => Math.min(prev + zoomFactor, 2.0));
        else setZoom((prev) => Math.max(prev - zoomFactor, 0.4));
      }
    };

    // 'passive: false' permite el uso estricto de e.preventDefault()
    canvas.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleNativeWheel);
  }, []);

  // --- EVENTOS DE REFRESH PARA MODALES ---
  const handleDepartmentCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["departments", activeCompany?._id] });
  };

  const handleProcessCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["processes", selectedDepartmentId] });
  };

  const handleOpenProcessModal = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setIsProcModalOpen(true);
  };

  // --- LÓGICA DE PANNING (Navegación arrastrando el fondo) ---
  const handleMouseDown = (e: MouseEvent) => {
    // Si la interacción ocurre sobre un elemento clickeable o arrastrable, ignora el Panning
    if (
      (e.target as HTMLElement).closest('button') || 
      (e.target as HTMLElement).closest('a') || 
      (e.target as HTMLElement).closest('.draggable-node')
    ) return;

    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  // --- LÓGICA DRAG & DROP HORIZONTAL (DEPARTAMENTOS) ---
  const handleHorizontalDragStart = (index: number) => {
    setDraggedNodeIndex(index);
    setLocalNodes([...nodes]);
  };

  const handleHorizontalDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (draggedNodeIndex === null || draggedNodeIndex === index || !localNodes) return;

    const updatedNodes = [...localNodes];
    const draggedItem = updatedNodes[draggedNodeIndex];
    updatedNodes.splice(draggedNodeIndex, 1);
    updatedNodes.splice(index, 0, draggedItem);

    setDraggedNodeIndex(index);
    setLocalNodes(updatedNodes);
  };

  const handleHorizontalDragEnd = () => {
    setDraggedNodeIndex(null);
    if (!localNodes) return;

    const sortedPayload = localNodes.map((node, index) => ({
      id: node.id,
      order: index
    }));

    updateOrderMutation.mutate(sortedPayload);
  };

  // Ajustes interactivos manuales de Zoom mediante los controles flotantes
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.4));
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2.0));

  // --- RETORNO TEMPRANO: ESTADO SIN ORGANIZACIÓN ACTIVADA ---
  if (!activeCompany) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)] w-full p-6 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
        <div className="text-center max-w-sm flex flex-col items-center gap-3">
          <div className="p-4 bg-slate-900 border border-slate-800 text-cyan-400 rounded-2xl shadow-xl">
            <FiBriefcase size={24} />
          </div>
          <h3 className="text-base font-bold text-white">Ninguna Organización Seleccionada</h3>
        </div>
      </div>
    );
  }

  // --- RENDERIZADO DEL ECOSISTEMA DEL CANVAS ---
  return (
    // 'h-[calc(100vh-7rem)]' restringe exactamente el lienzo al alto total visible del viewport
    <div className="flex flex-col gap-4 h-[calc(100vh-7rem)] w-full select-none">
      
      {/* 1. ENCABEZADO SUPERIOR CON ACCIÓN PRINCIPAL REUBICADA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl px-6 py-4 backdrop-blur-md shrink-0 w-full">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Lienzo Operativo Matrix VSM</span>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">Organización: {activeCompany.companyname}</h3>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-xs text-slate-400 font-mono bg-slate-950/60 border border-slate-800 px-3 py-2 rounded-xl">
            Celdas: <span className="text-cyan-400 font-bold">{nodes.length}</span>
          </div>

          {/* Botón principal para la creación de nuevos departamentos */}
          <button
            onClick={() => setIsDepModalOpen(true)}
            className="flex items-center gap-2 text-xs font-bold text-cyan-950 bg-cyan-400 hover:bg-cyan-300 px-4 py-2 rounded-xl transition-all shadow-lg shadow-cyan-950/50 cursor-pointer shrink-0"
          >
            <FiPlus size={16} />
            <span>Nuevo Departamento</span>
          </button>
        </div>
      </div>

      {/* 2. ÁREA DE TRABAJO COMPLETA Y DINÁMICA */}
      <div className="flex-1 w-full min-h-0 relative">
        <div 
          // La 'key' única resetea el canvas (zoom y traslación) automáticamente al cambiar de empresa
          key={activeCompany._id}
          ref={canvasRef} 
          onMouseDown={handleMouseDown} 
          onMouseMove={handleMouseMove} 
          onMouseUp={() => setIsDragging(false)} 
          onMouseLeave={() => setIsDragging(false)} 
          className={`w-full h-full flex flex-col bg-slate-900/10 border border-slate-800/80 rounded-2xl relative overflow-hidden backdrop-blur-sm ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* Malla de puntos de fondo adaptativa según la escala del Zoom */}
          <div 
            className="absolute inset-0 z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] opacity-70" 
            style={{ 
              backgroundSize: `${16 * zoom}px ${16 * zoom}px`, 
              backgroundPosition: `${position.x}px ${position.y}px` 
            }} 
          />

          {/* MATRIZ ESCALABLE EN DOS DIMENSIONES */}
          <div className="flex-1 relative z-10 w-full h-full">
            {isLoadingCanvas ? (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-mono">
                Sincronizando matriz...
              </div>
            ) : (
              <div 
                className="absolute origin-center h-full flex flex-row items-start gap-8 pt-12 px-12 will-change-transform"
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out' 
                }}
              >
                {/* Iteración de nodos de departamentos */}
                {nodes.map((node: CanvasNode, index: number) => (
                  <div key={node.id} className="draggable-node flex flex-row items-start shrink-0">
                    <DepartmentColumn
                      node={node}
                      index={index}
                      draggedNodeIndex={draggedNodeIndex}
                      onDragStart={handleHorizontalDragStart}
                      onDragOver={handleHorizontalDragOver}
                      onDragEnd={handleHorizontalDragEnd}
                      onOpenProcessModal={handleOpenProcessModal}
                    />

                    {/* Conector gráfico horizontal entre departamentos */}
                    {index < nodes.length - 1 && (
                      <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-500/40 to-slate-800 mt-6 mx-1 relative shrink-0">
                        <div className="absolute -right-1 -top-[3px] w-2 h-2 rounded-full bg-cyan-400" />
                      </div>
                    )}
                  </div>
                ))}

                {nodes.length === 0 && (
                  <div className="text-center w-full text-slate-500 text-xs font-mono pt-12">
                    No hay celdas operativas en esta empresa. Haz clic en "Nuevo Departamento" para comenzar.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CONTROLES FLOTANTES DE ZOOM Y NAVEGACIÓN */}
          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl shadow-2xl backdrop-blur-md">
            <button onClick={handleZoomOut} className="p-2 text-slate-400 hover:text-white" title="Reducir Zoom">
              <FiZoomOut size={16} />
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-400 px-2">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="p-2 text-slate-400 hover:text-white" title="Aumentar Zoom">
              <FiZoomIn size={16} />
            </button>
            <div className="w-px h-4 bg-slate-800 mx-1" />
            <button 
              onClick={() => { setZoom(1.0); setPosition({ x: 0, y: 0 }); }} 
              className="p-2 text-slate-400 hover:text-cyan-400" 
              title="Restaurar vista inicial (Centrar)"
            >
              <FiMaximize2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. MODALES FLOTANTES DE ALTA */}
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