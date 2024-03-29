import React from "react";

const GenderCheckBox = () => {
  return (
    <div className="flex">
      <div className="form-control">
        <label className={`label gap-2 cursor-pointer`}>
          <span className="label-text text-color-red">Male</span>
          <input type="checkbox" className="checkbox border-green-800" />
        </label>
      </div>
      <div className="form-control">
        <label className={`label gap-2 cursor-pointer`}>
          <span className="label-text">Female</span>
          <input type="checkbox" className="checkbox border-green-900" />
        </label>
      </div>
    </div>
  );
};

export default GenderCheckBox;
