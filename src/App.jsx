import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CompanyPage from './pages/CompanyPage';
import './index.css';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/company/:slug" element={<CompanyPage />} />
          </Routes>
          <footer className="footer">
            <p>Data sourced from LeetCode Premium • Progress synced to cloud</p>
          </footer>
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
