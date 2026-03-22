import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Model from "./pages/Model"
import About from "./pages/About"
import Dashboard from "./pages/Dashboard"


function App(){

return(

<BrowserRouter>

<Navbar/>

<Routes>

<Route path="/" element={<Home/>} />

<Route path="/model" element={<Model/>} />

<Route path="/about" element={<About/>} />

<Route path="/dashboard" element={<Dashboard/>} />

</Routes>

</BrowserRouter>

)

}

export default App
