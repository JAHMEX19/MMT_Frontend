import { useState } from "react";

// 1. Definimos las interfaces de TypeScript para mantener el orden
interface MetricField {
  key: string;
  label: string;
  type: "number" | "string" | "boolean";
}

interface DynamicFormProps {
  metricsConfig: MetricField[];
  onSubmitLog: (formData: Record<string, unknown>) => void;
}

export default function DynamicForm({ metricsConfig, onSubmitLog }: DynamicFormProps) {
  // Guardamos los valores del formulario en un objeto dinámico { [key]: valor }
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  // Manejador único para cualquier tipo de input
  const handleChange = (key: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitLog(formData); // Enviamos los datos recolectados hacia el componente padre o API
    setFormData({}); // Limpiamos el formulario
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
      <h3 className="text-lg font-medium text-cyan-400 mb-2">Registrar Datos Manuales</h3>
      
      {metricsConfig.map((metric) => (
        <div key={metric.key} className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300">{metric.label}</label>
          
          {/* Renderizado condicional basado en el tipo de métrica */}
          {metric.type === "boolean" ? (
            <select
             value={formData[metric.key] === undefined ? "" : formData[metric.key] ? "true" : "false"}
              onChange={(e) => handleChange(metric.key, e.target.value === "true")}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="">Seleccione una opción...</option>
              <option value="true">Sí / Activo</option>
              <option value="false">No / Inactivo</option>
            </select>
          ) : (
            <input
              type={metric.type === "number" ? "number" : "text"}
              placeholder={`Ingrese ${metric.label.toLowerCase()}`}
              value={formData[metric.key] === undefined ? "" : formData[metric.key] as string | number}
              onChange={(e) => 
                handleChange(metric.key, metric.type === "number" ? Number(e.target.value) : e.target.value)
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-2.5 px-4 rounded-lg transition-colors mt-4"
      >
        Guardar Registro
      </button>
    </form>
    </>
  );
}