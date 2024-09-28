import React from 'react';
import './App.css';
import Map from './MainPage/Map/Map';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>StrayWatch</h1>
      </header>
      <main>
        <Map />
      </main>
    </div>
  );
};

export default App;
