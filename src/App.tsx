import React from "react";
import FinancialDashboard from "./components/FinancialDashboard.tsx"; // Importing your component

const App: React.FC = () => {
  return (
    <div>
      <h1>Welcome to My Financial Dashboard</h1>
      <FinancialDashboard /> {/* Rendering the FinancialDashboard component */}
    </div>
  );
};

export default App;

