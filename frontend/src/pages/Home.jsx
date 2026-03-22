import { Link } from "react-router-dom";

export default function Home() {

  return (

    <div
      className="h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://eu-images.contentstack.com/v3/assets/blt8eb3cdfc1fce5194/blta28402e027d784b4/6973dbb02eb5cfe88327a3ae/High_voltage_lines_with_stylized_blue_electricity_transmitting_on_them.jpg')"
      }}
    >

      {/* Overlay */}
      <div className="bg-black/60 w-full h-full flex flex-col items-center justify-center text-white text-center px-4">

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          ⚡ AI Electricity Demand Forecasting
        </h1>

        {/* Description */}
        <p className="max-w-xl text-gray-200 mb-6">
          Smart grid system using AI (XGBoost + LSTM) to predict electricity demand,
          detect peak load, and visualize power trends.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mb-10">

          <Link
            to="/model"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
          >
            Start Prediction
          </Link>

          <Link
            to="/dashboard"
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded"
          >
            View Dashboard
          </Link>

        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">

          <div className="bg-white/10 p-4 rounded">
            <h3 className="font-bold">⚡ Smart Prediction</h3>
            <p className="text-sm text-gray-300">
              AI-powered demand forecasting
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded">
            <h3 className="font-bold">📊 Visualization</h3>
            <p className="text-sm text-gray-300">
              Graphs and demand trends
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded">
            <h3 className="font-bold">🚨 Peak Alerts</h3>
            <p className="text-sm text-gray-300">
              Detect high load instantly
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="mt-10 text-sm text-gray-400">
          © 2026 Smart Grid AI Project
        </p>

      </div>

    </div>

  );

}