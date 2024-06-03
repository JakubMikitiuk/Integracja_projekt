import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarComponent from './components/Navbar.js';
import ChartComponent from './components/Chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import SelectedCountryChart from './components/ChartSelected.js';
import CountrySelector from './components/Selector.js';
import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";



function App() {

  const user = localStorage.getItem("token");

  const [selectedCountry, setSelectedCountry] = useState('Poland');
  const [fetchedData, setFetchedData] = useState(new Map());
  const [fetchedData2, setFetchedData2] = useState(new Map());
  const [combinedData, setCombinedData] = useState([]);
  const [combinedData2, setCombinedData2] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [activeFetchData, setFetchActiveData] = useState([]);
  const [isLogScale, setIsLogScale] = useState(false);









  useEffect(() => {

    handleImport();
    fetchData1();
    fetchData2();
  }, []);

  useEffect(() => {
    const combinedData = [];
    fetchedData.forEach((value, key) => {
      value.forEach(item => {
        const existingItem = combinedData.find(d => d.quarter === item.quarter);
        if (existingItem) {
          existingItem[key] = item.value;
        } else {
          combinedData.push({ quarter: item.quarter, [key]: item.value });
        }
      });
    });
    console.log('Combined data:', combinedData);
    setCombinedData(combinedData);
    setActiveData(combinedData);
    setFetchActiveData(fetchedData);
  }, [fetchedData]);

  useEffect(() => {
    const combinedData2 = [];
    fetchedData2.forEach((value, key) => {
      if (key !== 'Month') { // Add this condition
        value.forEach(item => {
          const existingItem = combinedData2.find(d => d.Month === item.Month);
          if (existingItem) {
            existingItem[key] = item.value;
          } else {
            combinedData2.push({ Month: item.Month, [key]: item.value });
          }
        });
      }
    });
    console.log('Combined data2:', combinedData2);
    setCombinedData2(combinedData2);
    if (!activeData.length) {
      setFetchActiveData(fetchedData2);
      setActiveData(combinedData2);
    }
  }, [fetchedData2]);

  const toggleScale = () => {
    setIsLogScale(!isLogScale);
  };



  const handleDownloadALL = () => {
    const dataStr = JSON.stringify(activeData);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `ALL_data.json`;
    link.href = url;
    link.click();
  };

  const handleDownload = () => {
    const firstDataPoint = activeData[0];
    const isQuarterlyData = firstDataPoint && firstDataPoint.quarter && firstDataPoint.quarter.includes('Q');
    let data;
    if (isQuarterlyData) {
      data = activeData.map(item => ({ quarter: item.quarter, value: item[selectedCountry] }));
    } else {
      data = activeData.map(item => ({ Month: item.Month, value: item[selectedCountry] }));
    }
    const dataStr = JSON.stringify(data);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${selectedCountry}_data.json`;
    link.href = url;
    link.click();
  };

  const swapData = () => {
    if (activeData === combinedData) {
      setActiveData(combinedData2);
    } else {
      setActiveData(combinedData);
    }
    if (activeFetchData === fetchedData) {
      setFetchActiveData(fetchedData2);
    } else {
      setFetchActiveData(fetchedData);
    }
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  }

  const fetchData1 = async () => {
    try {
      const response = await axios.get('/api/gdp-data');
      const data = response.data;
      const transformedData = data.reduce((acc, item) => {
        acc.set(item.TIME, item.data.map(({ quarter, value }) => ({ quarter, value })));
        return acc;
      }, new Map());
      setFetchedData(transformedData);
      console.log('Data fetched:', transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchData2 = async () => {
    try {
      const response = await axios.get('/api/gdp-data2');
      const data = response.data;
      const transformedData = data.reduce((acc, item) => {
        acc.set(item.TIME, item.data.map(({ Month, value }) => ({ Month, value })));
        return acc;
      }, new Map());
      setFetchedData2(transformedData);
      console.log('Data fetched2:', transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleImport = () => {
    axios.post('/api/import-csv')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error importing CSV:', error);
      });

    axios.post('/api/import-csv2')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error importing CSV:', error);
      });
  }

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavbarComponent />
      </nav>

      {user ? (
        <><div className="container pt-5 mt-3 d-flex flex-column justify-content-center align-items-center" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="d-flex">
            <button className="btn btn-primary mr-2" onClick={swapData}>Swap Data</button>
            <button className="btn btn-secondary" onClick={toggleScale}>Toggle Scale</button>
            <button className="btn btn-info ml-2" onClick={handleDownloadALL}>Download Data</button>
          </div>

          <h2 className="mt-3">Chart for every country</h2>
          <ChartComponent fetchedData={activeFetchData} combinedData={activeData} isLogScale={isLogScale} />
        </div><div className="container pt-5 mt-3 d-flex flex-column justify-content-center align-items-center" style={{ height: 'calc(100vh - 56px)' }}>
            <CountrySelector selectedCountry={selectedCountry} handleCountryChange={handleCountryChange} fetchedData={activeFetchData} />
            <div className="d-flex">
              <button className="btn btn-primary mr-2" onClick={swapData}>Swap Data</button>
              <button className="btn btn-secondary" onClick={toggleScale}>Toggle Scale</button>
              <button className="btn btn-info ml-2" onClick={handleDownload}>Download Data</button>
            </div>
            <h2 className="mt-3">Chart for {selectedCountry}</h2>
            <SelectedCountryChart selectedCountry={selectedCountry} combinedData={activeData} isLogScale={isLogScale} />
          </div>

        </>



      ) : (
        <Routes>
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>

      )}




    </div>
  );
}
export default App;
