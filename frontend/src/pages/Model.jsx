import { useState } from "react";

export default function Model() {

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    temp:"",
    dwpt:"",
    rhum:"",
    wdir:"",
    wspd:"",
    pres:"",
    year:"",
    month:"",
    day:"",
    hour:"",
    minute:"",
    moving_avg_3:""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      const response = await fetch("http://127.0.0.1:8000/predict", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          temp: Number(form.temp),
          dwpt: Number(form.dwpt),
          rhum: Number(form.rhum),
          wdir: Number(form.wdir),
          wspd: Number(form.wspd),
          pres: Number(form.pres),
          year: Number(form.year),
          month: Number(form.month),
          day: Number(form.day),
          hour: Number(form.hour),
          minute: Number(form.minute),
          moving_avg_3: Number(form.moving_avg_3)
        })

      });

      const data = await response.json();

      if (data.predicted_power_demand !== undefined) {

        setResult(data);

      } else {

        alert("Prediction failed");

      }

    } catch (error) {

      console.error(error);
      alert("Server error");

    }

    setLoading(false);
  };

  return (

    <div className="max-w-xl mx-auto mt-10">

      <h2 className="text-2xl font-bold mb-6">
        Electricity Demand Prediction
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-3">

        <input name="temp" placeholder="Temperature" onChange={handleChange} className="border p-2"/>
        <input name="dwpt" placeholder="Dew Point" onChange={handleChange} className="border p-2"/>
        <input name="rhum" placeholder="Humidity" onChange={handleChange} className="border p-2"/>
        <input name="wdir" placeholder="Wind Direction" onChange={handleChange} className="border p-2"/>
        <input name="wspd" placeholder="Wind Speed" onChange={handleChange} className="border p-2"/>
        <input name="pres" placeholder="Pressure" onChange={handleChange} className="border p-2"/>

        <input name="year" placeholder="Year" onChange={handleChange} className="border p-2"/>
        <input name="month" placeholder="Month" onChange={handleChange} className="border p-2"/>
        <input name="day" placeholder="Day" onChange={handleChange} className="border p-2"/>
        <input name="hour" placeholder="Hour" onChange={handleChange} className="border p-2"/>
        <input name="minute" placeholder="Minute" onChange={handleChange} className="border p-2"/>

        <input name="moving_avg_3" placeholder="Moving Average (Last 3)" onChange={handleChange} className="border p-2"/>

        <button className="bg-blue-600 text-white p-3 rounded">
          {loading ? "Predicting..." : "Predict"}
        </button>

      </form>

      {/* RESULT DISPLAY */}

      {result && (

        <div className="mt-6 p-4 bg-green-100 rounded">

          <h3 className="text-xl font-bold mb-2">
            Predicted Power Demand
          </h3>

          <p className="text-lg font-semibold">
            {result.predicted_power_demand} {result.unit}
          </p>

          <p className="mt-2">
            Demand Level: <b>{result.demand_level}</b>
          </p>

          <p>
            Peak Alert:{" "}
            <b className={result.peak_alert ? "text-red-600" : "text-green-600"}>
              {result.peak_alert ? "YES ⚠️" : "NO ✅"}
            </b>
          </p>

        </div>

      )}

    </div>

  );
}