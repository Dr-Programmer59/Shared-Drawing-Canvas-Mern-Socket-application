import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/home/Home';
import About from './components/About/About';
import Contact from './components/Contact/Conatct';
import {useState, useEffect} from 'react';
import Check from './components/drawing/check';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/drawing' element={<Check/>}/>
        <Route path='/drawing/:roomId' element={<Check/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
      </Routes>
    </Router>
  );
}

export default App;
