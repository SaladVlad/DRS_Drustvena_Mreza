import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://engine:5000/api/hello")
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error("Error fetching from API:", error));
  }, []);

  return (
    <div className="App">
      <h1>React App with Flask Backend</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
