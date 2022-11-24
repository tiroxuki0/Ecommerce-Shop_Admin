import React from "react";

const QuantityBox = (props) => {
  const { itemQuantity } = props;

  return (
    <>
      <div className="quantity_box">
        <button type="button">x</button>
        <span className="quantity_count">{itemQuantity}</span>
      </div>
    </>
  );
};

export default QuantityBox;
