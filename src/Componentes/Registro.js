import React, { useState } from 'react';

const Register = ({ onToggleMode, onRegisterSuccess, onLogin }) => {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    rol: 'cliente' // Por defecto cliente, admin se asignaría desde panel admin
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validar nombre de usuario
    if (!formData.nombreUsuario.trim()) {
      errors.nombreUsuario = 'El nombre de usuario es requerido';
    } else if (formData.nombreUsuario.length < 3) {
      errors.nombreUsuario = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.nombreUsuario.length > 50) {
      errors.nombreUsuario = 'El nombre no puede exceder 50 caracteres';
    }

    // Validar correo
    if (!formData.correo.trim()) {
      errors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      errors.correo = 'Ingresa un correo válido';
    } else if (formData.correo.length > 100) {
      errors.correo = 'El correo no puede exceder 100 caracteres';
    }

    // Validar contraseña
    if (!formData.contrasena) {
      errors.contrasena = 'La contraseña es requerida';
    } else if (formData.contrasena.length < 6) {
      errors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    } else if (formData.contrasena.length > 255) {
      errors.contrasena = 'La contraseña es demasiado larga';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmarContrasena) {
      errors.confirmarContrasena = 'Confirma tu contraseña';
    } else if (formData.contrasena !== formData.confirmarContrasena) {
      errors.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Llamada a tu API .NET
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreUsuario: formData.nombreUsuario,
          correo: formData.correo,
          contrasena: formData.contrasena,
          rol: formData.rol
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Registro exitoso
        if (onRegisterSuccess) {
          onRegisterSuccess(data.message || 'Usuario registrado correctamente');
        }

        // Si la respuesta incluye token (auto-login después del registro)
        if (data.token && data.usuario) {
          // Guardar datos de sesión
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
          
          // Llamar función de login si está disponible
          if (onLogin) {
            onLogin(data.usuario);
          }
        } else {
          // Si no hay auto-login, mostrar mensaje y cambiar a login
          alert('Registro exitoso. Ahora puedes iniciar sesión.');
          if (onToggleMode) {
            onToggleMode();
          }
        }
      } else {
        setError(data.message || 'Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setError('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Completa el formulario para registrarte
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            {/* Nombre de Usuario */}
            <div>
              <label htmlFor="nombreUsuario" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de Usuario *
              </label>
              <input
                id="nombreUsuario"
                name="nombreUsuario"
                type="text"
                autoComplete="username"
                required
                maxLength="50"
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  validationErrors.nombreUsuario ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Tu nombre de usuario"
                value={formData.nombreUsuario}
                onChange={handleChange}
                disabled={isLoading}
              />
              {validationErrors.nombreUsuario && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.nombreUsuario}</p>
              )}
            </div>

            {/* Correo */}
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                autoComplete="email"
                required
                maxLength="100"
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  validationErrors.correo ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="ejemplo@correo.com"
                value={formData.correo}
                onChange={handleChange}
                disabled={isLoading}
              />
              {validationErrors.correo && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.correo}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña *
              </label>
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  validationErrors.contrasena ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Mínimo 6 caracteres"
                value={formData.contrasena}
                onChange={handleChange}
                disabled={isLoading}
              />
              {validationErrors.contrasena && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.contrasena}</p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña *
              </label>
              <input
                id="confirmarContrasena"
                name="confirmarContrasena"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  validationErrors.confirmarContrasena ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Repite tu contraseña"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                disabled={isLoading}
              />
              {validationErrors.confirmarContrasena && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmarContrasena}</p>
              )}
            </div>

            {/* Rol (oculto por defecto, solo visible si es necesario) */}
            <input
              type="hidden"
              name="rol"
              value={formData.rol}
            />
          </div>

          {/* Error general */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Botón de registro */}
          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registrando...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </div>

          {/* Link para cambiar a login */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="font-medium text-indigo-600 hover:text-indigo-500 underline"
                disabled={isLoading}
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;