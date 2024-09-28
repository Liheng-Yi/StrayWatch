import React from 'react';
import './App.css';
import Map from './MainPage/Map/Map';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Shelter Map</h1>
      </header>
      <main>
        <Map />
      </main>
    </div>
  );
}

export default App;