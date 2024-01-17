import React from "react";

const Dropdown = ({ name, options, value, onChange, placeholder, additionalClasses }) => {
  return (
    <div className={`relative w-[100%] mb-4 ${additionalClasses}`}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="input-box"
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
	  <i className="fi fi-rr-shield input-icon"></i>
    </div>
  );
};

export default Dropdown;
