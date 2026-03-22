export default function About(){

return(

<div className="min-h-screen bg-gradient-to-r from-sky-100 to-cyan-100 py-16 px-6">

<div className="max-w-5xl mx-auto bg-white p-10 rounded-xl shadow-lg">

<h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
About This Project
</h1>

{/* PROJECT INTRODUCTION */}

<div className="mb-10">

<h2 className="text-2xl font-semibold mb-4 text-cyan-700">
Project Overview
</h2>

<p className="text-gray-700 leading-relaxed">
The AI Electricity Demand Forecasting System is designed to predict future
electricity demand and peak load using artificial intelligence and machine
learning techniques. Accurate electricity forecasting helps power grid
operators manage energy generation, distribution, and consumption efficiently.
</p>

<p className="text-gray-700 mt-3">
By analyzing historical electricity consumption data along with environmental
parameters such as temperature, humidity, and time-based features, the system
can forecast future electricity demand with improved accuracy.
</p>

</div>


{/* TECH STACK */}

<div className="mb-10">

<h2 className="text-2xl font-semibold mb-4 text-cyan-700">
Technology Stack
</h2>

<div className="grid md:grid-cols-2 gap-4 text-gray-700">

<ul className="list-disc ml-5">
<li>React.js – Frontend user interface</li>
<li>Tailwind CSS – Responsive UI styling</li>
<li>FastAPI / Python – Backend API</li>
<li>Machine Learning Models – LSTM & XGBoost</li>
</ul>

<ul className="list-disc ml-5">
<li>Pandas & NumPy – Data preprocessing</li>
<li>Scikit-learn – Model training and evaluation</li>
<li>Matplotlib / Visualization tools</li>
<li>Weather & Time-series datasets</li>
</ul>

</div>

</div>


{/* HOW THE SYSTEM WORKS */}

<div className="mb-10">

<h2 className="text-2xl font-semibold mb-4 text-cyan-700">
How the System Works
</h2>

<div className="grid md:grid-cols-3 gap-6">

<div className="bg-cyan-50 p-5 rounded-lg shadow-sm">

<h3 className="font-semibold mb-2">
1. Data Collection
</h3>

<p className="text-gray-700">
Historical electricity demand data along with weather and
time-based parameters are collected for model training.
</p>

</div>

<div className="bg-cyan-50 p-5 rounded-lg shadow-sm">

<h3 className="font-semibold mb-2">
2. Model Training
</h3>

<p className="text-gray-700">
Machine learning models such as LSTM and XGBoost analyze
patterns in electricity usage to learn demand behavior.
</p>

</div>

<div className="bg-cyan-50 p-5 rounded-lg shadow-sm">

<h3 className="font-semibold mb-2">
3. Demand Prediction
</h3>

<p className="text-gray-700">
Users enter environmental and time parameters and the
system predicts future electricity demand instantly.
</p>

</div>

</div>

</div>


{/* WHY THIS PROJECT IS USEFUL */}

<div className="mb-10">

<h2 className="text-2xl font-semibold mb-4 text-cyan-700">
Why This System is Useful
</h2>

<ul className="list-disc ml-6 text-gray-700 space-y-2">

<li>Helps power grid operators plan electricity generation efficiently.</li>

<li>Prevents electricity shortages and overload conditions.</li>

<li>Improves stability and reliability of the power grid.</li>

<li>Optimizes energy distribution and reduces wastage.</li>

<li>Supports smart grid and AI-driven energy management systems.</li>

</ul>

</div>


{/* PROJECT GOAL */}

<div>

<h2 className="text-2xl font-semibold mb-4 text-cyan-700">
Project Goal
</h2>

<p className="text-gray-700 leading-relaxed">
The main objective of this project is to develop an intelligent system
that can accurately forecast electricity demand and peak load. By using
AI-driven predictive models, this system can help energy providers
make informed decisions and improve the efficiency of power grid
operations.
</p>

</div>

</div>

</div>

)
}