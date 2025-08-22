import React, { useState } from "react";

const Login = ({ onLogin, onToggleMode }) => {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.correo || !formData.contrasena) {
      setError("Por favor, completa todos los campos");
      setIsLoading(false);
      return;
    }

    if (!formData.correo.includes("@")) {
      setError("Por favor, ingresa un correo válido");
      setIsLoading(false);
      return;
    }

    try {
      // CORREGIDO: Cambiar los nombres de los campos para que coincidan con el backend
      const response = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.correo,     // Cambiar "correo" por "email"
          password: formData.contrasena, // Cambiar "contrasena" por "password"
        }),
      });

      // Verificar si la respuesta es JSON válida
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("El servidor no respondió con JSON válido");
      }

      const data = await response.json();

      if (response.ok) {
        // Guardar token y datos del usuario
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("usuario", JSON.stringify(data.user)); // Cambiar "usuario" por "user"

        // Llamar a la función onLogin del componente padre
        if (onLogin) {
          onLogin(data.user); // Cambiar "usuario" por "user"
        }
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      
      // Mensajes de error más específicos
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setError("No se puede conectar al servidor. Verifica que el backend esté ejecutándose en el puerto 5050.");
      } else if (error.message.includes('JSON')) {
        setError("Error en la respuesta del servidor. Verifica la configuración del backend.");
      } else {
        setError("Error de conexión. Por favor, intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="correo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Correo Electrónico
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="ejemplo@correo.com"
                value={formData.correo}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Tu contraseña"
                value={formData.contrasena}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="font-medium text-indigo-600 hover:text-indigo-500 underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;