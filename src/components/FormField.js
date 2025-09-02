import React from 'react';

function FormField({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder = '', 
  required = false,
  disabled = false,
  rows = null
}) {
  const InputComponent = rows ? 'textarea' : 'input';

  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      
      <InputComponent
        id={name}
        name={name}
        type={InputComponent === 'input' ? type : undefined}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`form-input ${error ? 'error' : ''}`}
      />
      
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export default FormField;
