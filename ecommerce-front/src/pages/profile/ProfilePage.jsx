import { useEffect } from "react"
import { AiFillUnlock } from "react-icons/ai"
import { FaEdit } from "react-icons/fa"
import Navbar from "../../components/navbar/navbar"
import { useAuth } from "../../contexts/AuthContext"
import { useFormProfile } from "./Hooks/useFormProfile"

const ProfilePage = () => {
  const {
    //formData,
    //tempData,
    isEditing,
    isLoading,
    showPassword,
    errors, // Ahora recibimos errors del hook
    setShowPassword,
    handleInputChange,
    handleEdit,
    handleCancel,
    handleSubmit,
    getFieldValue,
  } = useFormProfile()




  return (
    <div className="container min-vh-100 bg-light py-5">
      <Navbar
        ///onSearch={handleSearch}
      />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            {/* Header del perfil */}
            <div className="text-center mb-4">
              {/* <div className="position-relative d-inline-block">
                <img
                  src="/placeholder.svg?height=120&width=120"
                  alt="Avatar"
                  className="rounded-circle border border-4 border-white shadow-lg"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <span className="position-absolute bottom-0 end-0 bg-success rounded-circle p-2">
                  <i className="bi bi-check text-white"></i>
                </span>
              </div> */}
              <h2 className="mt-3 mb-1 fw-bold">Información de Usuario</h2>

            </div>

            {/* Mostrar error general si existe */}
            {errors.general && (
              <div className="alert alert-danger mb-4">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {errors.general}
              </div>
            )}

            {/* Card del perfil */}
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-4">
                <div>
                  <p className="text-muted mb-0 small">Gestiona tu información personal</p>
                </div>

                {!isEditing ? (
                  <button onClick={handleEdit} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                    <FaEdit className="me-1" />
                    Editar
                  </button>
                ) : (
                    <div className="btn-group">
                      <button onClick={handleCancel} className="btn btn-outline-secondary btn-sm" disabled={isLoading}>
                        <i className="bi bi-x-lg me-1"></i>
                      Cancelar
                    </button>
                      <button onClick={handleSubmit} className="btn btn-primary btn-sm" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1"></span>
                          Guardando...
                        </>
                        ) : (
                            <>
                              <i className="bi bi-check-lg me-1"></i>
                          Guardar
                        </>
                          )}
                      </button>
                    </div>
                  )}
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {/* Campo Nombre */}
                  <div className="row mb-4">
                    <div className="col-sm-3">
                      <label className="form-label fw-semibold text-muted">
                        <i className="bi bi-person me-2"></i>
                        Nombre
                      </label>
                    </div>
                    <div className="col-sm-9">
                      {!isEditing ? (
                        <p className="form-control-plaintext fw-semibold">{getFieldValue("Name")}</p>
                      ) : (
                          <>
                            <input
                              type="text"
                              className={`form-control ${errors.name ? "is-invalid" : ""}`}
                              name="name"
                              value={getFieldValue("Name")}
                              onChange={handleInputChange}
                              placeholder="Ingresa tu nombre completo"
                            />
                            {errors.name && (
                              <div className="invalid-feedback">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.name}
                              </div>
                            )}
                          </>
                        )}
                    </div>
                  </div>

                  {/* Campo Email */}
                  <div className="row mb-4">
                    <div className="col-sm-3">
                      <label className="form-label fw-semibold text-muted">
                        <i className="bi bi-envelope me-2"></i>
                        Email
                      </label>
                    </div>
                    <div className="col-sm-9">
                      {!isEditing ? (
                        <p className="form-control-plaintext fw-semibold">{getFieldValue("Email")}</p>
                      ) : (
                          <>
                            <input
                              type="email"
                              className={`form-control ${errors.email ? "is-invalid" : ""}`}
                              name="email"
                              value={getFieldValue("Email")}
                              onChange={handleInputChange}
                              placeholder="ejemplo@correo.com"
                            />
                            {errors.email && (
                              <div className="invalid-feedback">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.email}
                              </div>
                            )}
                          </>
                        )}
                    </div>
                  </div>

                  {/* Campo Contraseña */}
                  <div className="row mb-4">
                    <div className="col-sm-3">
                      <label className="form-label fw-semibold text-muted">
                        <i className="bi bi-lock me-2"></i>
                        Contraseña
                      </label>
                    </div>
                    <div className="col-sm-9">
                      {!isEditing ? (
                        <div className="d-flex align-items-center">
                          <p className="form-control-plaintext fw-semibold me-2">
                            {showPassword ? getFieldValue("Password") || "Sin contraseña" : "••••••••••"}
                          </p>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <AiFillUnlock size="16" />
                          </button>
                        </div>
                      ) : (
                          <>
                            <div className="input-group">
                              <input
                                type={showPassword ? "text" : "password"}
                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                name="password"
                                value={getFieldValue("Password")}
                                onChange={handleInputChange}
                                placeholder="Mínimo 6 caracteres"
                              />
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <AiFillUnlock size="16" />
                              </button>
                            </div>
                            {errors.password && (
                              <div className="invalid-feedback d-block">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.password}
                              </div>
                            )}
                          </>
                        )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
