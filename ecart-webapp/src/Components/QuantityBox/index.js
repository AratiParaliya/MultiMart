import Button from "@mui/material/Button";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";


const QuantityBox = ({ qty, onIncrease, onDecrease }) => {
  return (
    <div className="quantityDrop d-flex align-items-center">
      
      <Button onClick={onDecrease} disabled={qty <= 1}>
        <FaMinus />
      </Button>

      {/* ✅ USE qty FROM PROPS */}
      <input type="text" value={qty} readOnly />

      <Button onClick={onIncrease}>
        <FaPlus />
      </Button>

    </div>
  );
};
export default QuantityBox;