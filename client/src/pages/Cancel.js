import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/checkout"); // Redirect back to the checkout page
  };

  return (
    <div>
      <h1>Payment Canceled</h1>
      <p>You have canceled the payment process. If this was a mistake, you can retry your payment.</p>
      <button onClick={handleRetry}>Retry Payment</button>
    </div>
  );
};

export default Cancel;
