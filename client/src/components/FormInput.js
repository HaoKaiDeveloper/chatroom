import React from "react";

const FormInput = ({ labelName, type, id, inputName, value, handleChange }) => {
  return (
    <label htmlFor={id} className="flex flex-col">
      {labelName} :
      <input
        type={type}
        id={id}
        name={inputName}
        value={value}
        onChange={handleChange}
        className="border-b border-stone-700 outline-none text-lg"
      />
    </label>
  );
};

export default FormInput;
