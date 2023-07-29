import logo from './logo.svg';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import Homepage from './pages/Homepage/Homepage.tsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element = {< Homepage />}/>
      </Routes>
    </Router>
  );
}

export default App;
