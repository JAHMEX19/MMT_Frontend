import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import type { RegisterFormData } from "../../types/types.ts";
import ErrorMessage from "../../components/errorMessage/ErrorMessage.tsx";
import { toast } from "sonner";
import api from "../../config/axios.ts";

export default function RegisterView() {

  // Valores iniciales para el formulario de registro
  const initalValues = {
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  // Configuración de React Hook Form
  const {
    register,
    getValues,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ defaultValues: initalValues });

  // Función para manejar el registro del usuario
  const handleRegister = async (formData: RegisterFormData) => {
    try {
      const { data } = await api.post(`/api/v1/auth/signup`, formData);
      toast.success(data.message);
      console.log(data);
      reset();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Error al registrar el usuario");
      } else {
        toast.error("Error de conexión con el servidor");
      }
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6 animate-fade-in">
        {/* Título de la vista */}
        <div className="flex flex-col gap-1 text-center lg:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Crea tu cuenta
          </h2>
          <p className="text-sm text-slate-400">
            Ingresa tus datos para unirte al panel de Magnus y comenzar.
          </p>
        </div>

        {/* Formulario de Registro */}
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col gap-4"
        >
          {/* Campo: Nombre Completo */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="Ej. John Doe"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
              {...register("username", { required: "El nombre de usuario es obligatorio" })}
            />
            {errors.username && <ErrorMessage>{errors.username.message} </ErrorMessage>}
          </div>

          {/* Campo: Correo Electrónico */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="usuario@magnusmmt.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "E-mail no válido",
                },
              })}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message} </ErrorMessage>
            )}
          </div>

          {/* Campo: Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
              {...register("password", {
                required: "El password es obligatorio",
                minLength: {
                  value: 6,
                  message: "Password debe tener al menos 6 caracteres",
                },
              })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message} </ErrorMessage>
            )}
          </div>

          {/* Campo: Confirmar Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password_confirmation"
              className="text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Confirmar Password
            </label>
            <input
              id="password_confirmation"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
              {...register("password_confirmation", {
                required: "Confirmar es obligatorio",
                validate: (value) => value === getValues("password") || "Las contraseñas no coinciden",
              })}
            />
            {errors.password_confirmation && (
              <ErrorMessage>
                {errors.password_confirmation.message}{" "}
              </ErrorMessage>
            )}
          </div>

          {/* Términos y Condiciones */}
          <div className="flex items-center gap-2 my-1">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-purple-500 focus:ring-purple-500/30 focus:ring-offset-slate-950"
            />
            <label
              htmlFor="terms"
              className="text-xs text-slate-400 select-none"
            >
              Acepto los términos de servicio y políticas de Magnus MMT.
            </label>
          </div>

          {/* Botón de Acción Principal Modificado a los tonos de Register */}
          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all duration-150"
          >
            Registrarse en el Sistema
          </button>
        </form>

        {/* Enlace alternativo para Login */}
        <div className="text-center mt-2">
          <p className="text-sm text-slate-400">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-150 underline underline-offset-4"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}