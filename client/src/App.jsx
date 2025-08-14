import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import OAuthCallback from './pages/OAuthCallback';
import ListFiles from './pages/ListFiles';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<OAuthCallback />} /> {/* 👈 Add this */}
        <Route path="/list-files" element={<ListFiles />} />
      </Routes>
    </Router>
  );
}

export default App;
