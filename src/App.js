import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Salary from "./components/salary";  
import Aminities from "./components/aminities"; 

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/salary" element={<Salary />} />  
        <Route path="/home" element={<Home />} />
        <Route path="/aminities" element={<Aminities />} /> 
      
      </Routes>
    </div>
  );
}

export default App;


