import React, { useState } from "react";
import PersonalDetails from "./screens/PersonalDetails";
import RestaurantDetails from "./screens/RestaurantDetails";
// import Timings from "./Timings";

const Dashboard = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(step + 1);

  return (
    <div className="container">
      {step === 1 && <PersonalDetails onNext={handleNext} />}
      {step === 2 && <RestaurantDetails onNext={handleNext} />}
    </div>
  );
};

export default Dashboard;