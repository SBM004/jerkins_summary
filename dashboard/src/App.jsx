import { useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar.jsx'
import PackagePage from './pages/package.jsx'

function App() {


  return (
    <>
    <Router >
     <Navbar/>
      <Routes>
        <Route path="/" element={<PackagePage/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
