import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarComponent from './components/Navbar.js';
import ChartComponent from './components/Chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import SelectedCountryChart from './components/ChartSelected.js';
import CountrySelector from './components/Selector.js';




function App() {

  const [selectedCountry, setSelectedCountry] = useState('Poland');
  const [fetchedData, setFetchedData] = useState(new Map());
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1);
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    fetchData1();
    handleImport();
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
  }, [fetchedData]);

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

  const handleImport = () => {
    axios.post('/api/import-csv')
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
      <div className="container pt-5 mt-3 d-flex flex-column justify-content-center align-items-center" style={{ height: 'calc(100vh - 56px)' }}>
      <h2 className="mt-3">GDP debt for every country</h2>
        <ChartComponent fetchedData={fetchedData} combinedData={combinedData} />
      </div>
      <div className="container pt-5 mt-3 d-flex flex-column justify-content-center align-items-center" style={{ height: 'calc(100vh - 56px)' }}>
        <CountrySelector selectedCountry={selectedCountry} handleCountryChange={handleCountryChange} fetchedData={fetchedData} />
        <h2 className="mt-3">GDP debt for {selectedCountry}</h2>
        <SelectedCountryChart selectedCountry={selectedCountry} combinedData={combinedData} />
      </div>
    </div>
  );
}
export default App;
