import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [counter, setCounter] = useState([]);

  useEffect(() => {
    getCount();
  }, []);

  const getCount = () => {
    axios.get('http://localhost:3333/api/counter').then((response) => {
      const result = response.data;
      setCounter(result);
    });
  };

  //create counter
  const handleAddCount = () => {
    axios.post('http://localhost:3333/api/counter').then(() => {
      //  console.log(getCount);
      getCount();
    });
  };

  //Delete All
  const handleDeleteAll = () => {
    axios.delete('http://localhost:3333/api/counter/').then(() => {
      //console.log(response.data);
      // axios.get('http://localhost:3333/api/counter').then((response) => {
      //   const result = response.data;
      //   setCounter(result);
      // });
      getCount();
    });
  };

  //Update
  const handleCount = (id, type) => {
    axios.put(`http://localhost:3333/api/counter/${id}?type=${type}`).then((response) => {
      const result = response.data;
      const updatedCounter = counter.map((count) => {
        if (count._id === result._id) {
          return result;
        }
        return count;
      });
      setCounter(updatedCounter);
    });
  };

  //Delete one
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3333/api/counter/${id}`).then((response) => {
      const result = response.data;
      const filteredCounter = counter.filter((count) => {
        return count._id !== result._id;
      });
      setCounter(filteredCounter);
    });
  };

  return (
    <div>
      <h1>Listing Counters - {counter.length}</h1>
      <button onClick={handleAddCount}>Add Counter</button>
      <button onClick={handleDeleteAll}>DeleteAll</button>
      {counter.map((eachCount, idx) => {
        return (
          <div key={idx}>
            <h5>{eachCount.count}</h5>
            <p>id: {eachCount._id}</p>
            <button onClick={() => handleCount(eachCount._id, 'inc')}>increment</button>
            <button onClick={() => handleCount(eachCount._id, 'dec')}>decrement</button>
            <button onClick={() => handleCount(eachCount._id, 'reset')}>reset</button>

            <button onClick={() => handleDelete(eachCount._id)}>delete</button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
