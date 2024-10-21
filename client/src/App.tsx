import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainPage from './Pages';
import 'bootstrap/dist/css/bootstrap.min.css';




function App() {
  return (
    <BrowserRouter>
      <MainPage />
    </BrowserRouter>
  );
}

export default App;
