import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './page/accueil';
import Test from './page/test';
import Navbar from "./coponent/navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}
