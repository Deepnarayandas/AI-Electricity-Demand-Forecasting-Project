import { useState } from "react";
import AnimatedBg from "../components/AnimatedBg";
import { Line } from "react-chartjs-2";

export default function Dashboard() {

  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);

  const [form, setForm] = useState({
    temp: 32, dwpt: 24, rhum: 65,
    wdir: 180, wspd: 10, pres: 1012,
    year: 2025, month: 6, day: 15,
    hour: 18, minute: 0, moving_avg_3: 3500
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  // 🔮 Prediction
  const predict = async () => {

    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(form)
    });

    const result = await res.json();
    setData(result);
  };

  // 📈 Forecast
  const getForecast = async () => {

    const res = await fetch("http://127.0.0.1:8000/forecast-24h", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(form)
    });

    const result = await res.json();
    setForecast(result.forecast_24h);
  };

  return (

    <div className="p-6 relative">

      <AnimatedBg />

      <h1 className="text-2xl font-bold mb-4">
        📊 Smart Dashboard
      </h1>

      {/* Input */}
      <div className="grid grid-cols-3 gap-2">

        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
            className="p-2 bg-gray-800 border border-gray-700 rounded"
          />
        ))}

      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-4">

        <button
          onClick={predict}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Predict
        </button>

        <button
          onClick={getForecast}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Forecast 24h
        </button>

      </div>

      {/* Result Cards */}
      {data && (

        <div className="mt-6 grid grid-cols-3 gap-4">

          <div className="bg-gray-800 p-4 rounded">
            <p>Power Demand</p>
            <h2 className="text-xl font-bold">
              {data.predicted_power_demand} MW
            </h2>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <p>Level</p>
            <h2>{data.demand_level}</h2>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <p>Status</p>
            <h2 className={data.peak_alert ? "text-red-500" : "text-green-400"}>
              {data.peak_alert ? "⚠️ Peak Load" : "Normal"}
            </h2>
          </div>

        </div>
      )}

      {/* Graph */}
      {forecast.length > 0 && (

        <div className="mt-6">

          <Line
            data={{
              labels: Array.from({length: 24}, (_, i) => i),
              datasets: [{
                label: "Demand (MW)",
                data: forecast
              }]
            }}
          />

        </div>
      )}

    </div>
  );
}