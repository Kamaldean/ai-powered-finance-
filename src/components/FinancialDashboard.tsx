import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

// Constants moved outside the component
const ITEMS_PER_PAGE = 5;
const currencies = ["USD", "EUR", "GBP", "GHS"];

interface BudgetItem {
  category: string;
  suggested: number;
  spent: number;
}

interface SpendingDataItem {
  month: string;
  amount: number;
}

const FinancialDashboard: React.FC = () => {
  const navigate = useNavigate();
  // const [spendingData, setSpendingData] = useState<SpendingDataItem[]>([]);
  // const [budget, setBudget] = useState<BudgetItem[]>([]);
  // const [goals, setGoals] = useState<{ name: string; amount: number; saved: number }[]>([]);
  // const [newGoal, setNewGoal] = useState({ name: "", amount: 0, saved: 0 });
  //const [goalPage, setGoalPage] = useState(0);
  const [budgetPage, setBudgetPage] = useState(0);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [currency, setCurrency] = useState("USD");
  const [alerts, setAlerts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    setLoading(true); // Start loading
    axios
      .get("http://localhost:5000/api/spending-trends")
      .then((response) => {
        if (Array.isArray(response.data)) {
          // setSpendingData(response.data);
        } else {
          setError("Failed to load spending trends.");
        }
      })
      .catch(() =>
        setError("Error fetching spending trends. Please try again.")
      )
      .finally(() => setLoading(false)); // Stop loading

    axios
      .get("http://localhost:5000/api/budget-recommendations")
      .then((response) => {
        if (Array.isArray(response.data)) {
          //  setBudget(response.data);
        } else {
          setError("Failed to load budget recommendations.");
        }
      })
      .catch(() =>
        setError("Error fetching budget recommendations. Please try again.")
      )
      .finally(() => setLoading(false)); // Stop loading
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // useEffect(() => {
  //   const overusedBudgets = budget.filter((item) => item.spent > item.suggested);
  //   setAlerts(overusedBudgets.map((item) => `Over budget in ${item.category}!`));
  // }, [budget]);

  // const handleAddGoal = () => {
  //   if (newGoal.amount <= 0) {
  //     setError("Goal amount must be greater than zero.");
  //     return;
  //   }
  //   setGoals([...goals, newGoal]);
  //   setNewGoal({ name: "", amount: 0, saved: 0 });
  //   setError(null); // Clear any previous errors
  // };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className={`p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex justify-between">
        <button
          aria-label="Toggle Dark Mode"
          onClick={() => setDarkMode(!darkMode)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          aria-label="Logout"
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="col-span-full flex justify-end">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="p-2 border rounded bg-transparent"
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="col-span-full text-center">
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <motion.div
          className="col-span-full bg-red-500 text-white p-4 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>{error}</p>
        </motion.div>
      )}

      {alerts.length > 0 && (
        <motion.div
          className="col-span-full bg-red-500 text-white p-4 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {alerts.map((alert, index) => (
            <p key={index}>{alert}</p>
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`p-6 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Spending Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <></>
          {/* <LineChart data={spendingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" animationDuration={1000} />
          </LineChart> */}
        </ResponsiveContainer>
      </motion.div>

      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}
      >
        <h2 className="text-2xl font-bold mb-4">Budget Recommendations</h2>
        {budget.slice(budgetPage * ITEMS_PER_PAGE, (budgetPage + 1) * ITEMS_PER_PAGE).map((item) => (
          <div key={item.category} className="mb-2">
            <p>{item.category}: ${item.suggested}</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${(item.spent / item.suggested) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
        {budget.length > (budgetPage + 1) * ITEMS_PER_PAGE && (
          <button onClick={() => setBudgetPage(budgetPage + 1)}>Next</button>
        )}
      </motion.div> */}
    </div>
  );
};

export default FinancialDashboard;
