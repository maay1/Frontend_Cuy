import React, { useState, useEffect } from "react";

const CompCliente = () => {
  // Estados para manejar la lista de clientes y formularios
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Estado del formulario
  const [formData, setFormData] = useState({
    idCliente: 0,
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    direccion: "",
    correo: "",
  });

  // Configuración de la API - Ajusta esta URL según tu backend
  const API_BASE_URL = "https://localhost:7000/api"; // Cambia por tu URL

  // Cargar clientes al montar el componente
  useEffect(() => {
    obtenerClientes();
  }, []);

  // Función para obtener todos los clientes
  const obtenerClientes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`);
      if (!response.ok) throw new Error("Error al obtener clientes");
      const data = await response.json();
      setClientes(data);
    } catch (err) {
      setError("Error al cargar los clientes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un nuevo cliente
  const crearCliente = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          dni: parseInt(formData.dni),
          telefono: parseInt(formData.telefono),
          direccion: formData.direccion,
          correo: formData.correo,
        }),
      });

      if (!response.ok) throw new Error("Error al crear cliente");

      await obtenerClientes(); // Recargar la lista
      cerrarModal();
      setError("");
    } catch (err) {
      setError("Error al crear cliente: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar un cliente
  const actualizarCliente = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/clientes/${formData.idCliente}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idCliente: formData.idCliente,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            dni: parseInt(formData.dni),
            telefono: parseInt(formData.telefono),
            direccion: formData.direccion,
            correo: formData.correo,
          }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar cliente");

      await obtenerClientes(); // Recargar la lista
      cerrarModal();
      setError("");
    } catch (err) {
      setError("Error al actualizar cliente: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un cliente
  const eliminarCliente = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este cliente?"))
      return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar cliente");

      await obtenerClientes(); // Recargar la lista
      setError("");
    } catch (err) {
      setError("Error al eliminar cliente: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Abrir modal para nuevo cliente
  const abrirModalNuevo = () => {
    setFormData({
      idCliente: 0,
      nombres: "",
      apellidos: "",
      dni: "",
      telefono: "",
      direccion: "",
      correo: "",
    });
    setModoEdicion(false);
    setMostrarModal(true);
    setError("");
  };

  // Abrir modal para editar cliente
  const abrirModalEdicion = (cliente) => {
    setFormData({
      idCliente: cliente.idCliente,
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      dni: cliente.dni.toString(),
      telefono: cliente.telefono.toString(),
      direccion: cliente.direccion,
      correo: cliente.correo,
    });
    setModoEdicion(true);
    setMostrarModal(true);
    setError("");
  };

  // Cerrar modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setFormData({
      idCliente: 0,
      nombres: "",
      apellidos: "",
      dni: "",
      telefono: "",
      direccion: "",
      correo: "",
    });
    setError("");
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (
      !formData.nombres.trim() ||
      !formData.apellidos.trim() ||
      !formData.dni.trim()
    ) {
      setError("Los campos nombres, apellidos y DNI son obligatorios");
      return;
    }

    if (modoEdicion) {
      actualizarCliente();
    } else {
      crearCliente();
    }
  };

  // Filtrar clientes por búsqueda
  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.dni.toString().includes(busqueda) ||
      cliente.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-primary mb-0">
              <i className="fas fa-users me-2"></i>
              Gestión de Clientes
            </h2>
            <button
              className="btn btn-primary"
              onClick={abrirModalNuevo}
              disabled={loading}
            >
              <i className="fas fa-plus me-2"></i>
              Nuevo Cliente
            </button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, apellido, DNI o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="text-muted">
            <small>Total de clientes: {clientesFiltrados.length}</small>
          </div>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando...</p>
        </div>
      )}

      {/* Tabla de clientes */}
      <div className="card shadow">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Nombres</th>
                  <th scope="col">Apellidos</th>
                  <th scope="col">DNI</th>
                  <th scope="col" className="d-none d-md-table-cell">
                    Teléfono
                  </th>
                  <th scope="col" className="d-none d-lg-table-cell">
                    Dirección
                  </th>
                  <th scope="col" className="d-none d-md-table-cell">
                    Correo
                  </th>
                  <th scope="col" className="text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.idCliente}>
                    <td className="fw-bold">{cliente.idCliente}</td>
                    <td>{cliente.nombres}</td>
                    <td>{cliente.apellidos}</td>
                    <td>
                      <span className="badge bg-secondary">{cliente.dni}</span>
                    </td>
                    <td className="d-none d-md-table-cell">
                      {cliente.telefono}
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <small className="text-muted">{cliente.direccion}</small>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <small>{cliente.correo}</small>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => abrirModalEdicion(cliente)}
                          disabled={loading}
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => eliminarCliente(cliente.idCliente)}
                          disabled={loading}
                          title="Eliminar"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {clientesFiltrados.length === 0 && !loading && (
              <div className="text-center py-5">
                <i className="fas fa-users fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No se encontraron clientes</h5>
                <p className="text-muted">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para crear/editar cliente */}
      {mostrarModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i
                      className={`fas ${
                        modoEdicion ? "fa-edit" : "fa-plus"
                      } me-2`}
                    ></i>
                    {modoEdicion ? "Editar Cliente" : "Nuevo Cliente"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={cerrarModal}
                  ></button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {error && (
                      <div className="alert alert-danger">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    )}

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="nombres" className="form-label">
                          Nombres <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="nombres"
                          name="nombres"
                          value={formData.nombres}
                          onChange={handleInputChange}
                          required
                          placeholder="Ingrese los nombres"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="apellidos" className="form-label">
                          Apellidos <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="apellidos"
                          name="apellidos"
                          value={formData.apellidos}
                          onChange={handleInputChange}
                          required
                          placeholder="Ingrese los apellidos"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="dni" className="form-label">
                          DNI <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="dni"
                          name="dni"
                          value={formData.dni}
                          onChange={handleInputChange}
                          required
                          placeholder="12345678"
                          min="10000000"
                          max="99999999"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="telefono" className="form-label">
                          Teléfono
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="telefono"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          placeholder="987654321"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="correo" className="form-label">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="correo"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        placeholder="ejemplo@correo.com"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="direccion" className="form-label">
                        Dirección
                      </label>
                      <textarea
                        className="form-control"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Ingrese la dirección completa"
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={cerrarModal}
                    >
                      <i className="fas fa-times me-2"></i>
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i
                            className={`fas ${
                              modoEdicion ? "fa-save" : "fa-plus"
                            } me-2`}
                          ></i>
                          {modoEdicion ? "Actualizar" : "Crear"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CompCliente;
