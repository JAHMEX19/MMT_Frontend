import { Link } from "react-router-dom";

export default function LoginView() {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá tu lógica para conectar useAuth con el AuthController del backend
    console.log("Iniciando sesión...");
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      
      {/* Título de la vista */}
      <div className="flex flex-col gap-1 text-center lg:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Bienvenido
        </h2>
        <p className="text-sm text-slate-400">
          Ingresa tus credenciales para acceder al panel de Magnus.
        </p>
      </div>

      {/* Formulario de Login */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Campo: Correo Electrónico */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="usuario@magnusmmt.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
          />
        </div>

        {/* Campo: Contraseña */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Password
            </label>
            {/* Link opcional por si el operador olvida sus credenciales */}
            <Link 
              to="/auth/forgot-password" 
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              ¿Olvidaste tu constraseña?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
          />
        </div>

        {/* Recordar sesión */}
        <div className="flex items-center gap-2 my-1">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-cyan-500/30 focus:ring-offset-slate-950"
          />
          <label htmlFor="remember" className="text-xs text-slate-400 select-none">
            Mantener sesión iniciada en esta terminal
          </label>
        </div>

        {/* Botón de Acción Principal */}
        <button
          type="submit"
          className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/10 active:scale-[0.98] transition-all duration-150"
        >
          Iniciar Sesión
        </button>
      </form>

      {/* Enlace alternativo para ir a Register */}
      <div className="text-center mt-2">
        <p className="text-sm text-slate-400">
          ¿No tienes una cuenta ?{" "}
          <Link
            to="/auth/signup"
            className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-150 underline underline-offset-4"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>

    </div>
  );
}
