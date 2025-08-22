// authService.js
const API_BASE_URL = 'http://localhost:5000/api'; // Cambia esto por la URL de tu API .NET

class AuthService {
  async login(correo, contrasena) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo,
          contrasena
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async register(usuarioData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async validateToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async refreshToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('No se pudo renovar el token');
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper para hacer peticiones autenticadas
  async authenticatedRequest(url, options = {}) {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const config = {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      
      // Si el token expiró, intentar renovarlo
      if (response.status === 401) {
        const refreshResult = await this.refreshToken(token);
        if (refreshResult.success) {
          sessionStorage.setItem('token', refreshResult.data.token);
          // Reintentar la petición original con el nuevo token
          config.headers.Authorization = `Bearer ${refreshResult.data.token}`;
          return fetch(url, config);
        } else {
          // Si no se puede renovar, redirigir al login
          sessionStorage.clear();
          window.location.href = '/login';
          throw new Error('Sesión expirada');
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();