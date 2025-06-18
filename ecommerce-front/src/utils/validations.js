export function validarCampo(valor, tipo) {
  // Validar campo vacío o nulo
  if (valor === null || valor === undefined || valor === '') {
    return false;
  }

  // Validar según el tipo
  if (tipo === 'text'){
    return typeof valor === 'string' && valor.trim().length > 0;
  }
  else if(tipo==="password") {
    return typeof valor === 'string' && valor.trim().length > 0;
  } 
  else if (tipo === 'boolean') {
    return typeof valor === 'boolean';
  }
  else if (tipo=== 'email'){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  } 
  else if (tipo === 'time') {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    return typeof valor === 'string' && timeRegex.test(valor);
  } 
  else if (tipo === 'select') {
    return valor !== '' && valor !== null && valor !== undefined;
  } 
  else if (tipo === 'array') {
    return Array.isArray(valor) && valor.length > 0;
  }

  return false;
}