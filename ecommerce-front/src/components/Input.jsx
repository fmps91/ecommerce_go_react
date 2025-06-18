
/* const InputCustom = ({value,type="text",required=false}) => {

    
    const animationMessages =
    "animate__animated animate__fadeIn animate__fast";

    return(
        <div>
            <Input></Input>
          {required?
            <small 
            className="animate__animated animate__fadeIn animate__fast" 
            style={{ color: "#ff4d4f", display: "block", marginTop: 4 }}
          >
            Este campo es requerido
          </small>
            :
            <div>  </div>
        }
        </div>

    );
} */

import React, { useState, useEffect } from 'react';
import { Input } from 'antd';


const InputCustom = ({ 
  value: initialValue = "", 
  type = "text", 
  required = false, 
  placeholder = "",
  onChange,
  label = "",
  size=""
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isTouched, setIsTouched] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Sincronizar el valor inicial
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  // Validación
  useEffect(() => {
    if (isTouched && required) {
      setHasError(inputValue.trim() === "");
    }
  }, [inputValue, isTouched, required]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange && onChange(newValue);
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <div style={{ marginBottom: 0 }}>
      {label && <label style={{ display: 'block', marginBottom: 8 }}>{label}</label>}
      
      <Input
        type={type}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        status={hasError ? 'error' : ''}
        size={size}
        style={{width:"100%"}}
      />
      
      {hasError && (
        <div 
        className="animate__animated animate__fadeIn animate__fast" 
          style={{ color: '#ff4d4f', marginTop: 4, fontSize: 12 }}
        >
          Este campo es requerido
        </div>
      )}
    </div>
  );
};

export default InputCustom;