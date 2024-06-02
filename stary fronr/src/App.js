import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ReferenceArea } from 'recharts';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


const { Range } = Slider;
function App(){

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

  const renderCountrySelector = () => {
    return (
      <Form inline>
        <select value={selectedCountry} onChange={handleCountryChange}>
          {Array.from(fetchedData.keys()).map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </Form>
    );
  }

  const renderLoginForm = () => {
    return (
      <Form inline  style={{ display: 'flex' }}>
        <FormControl type="text" placeholder="Username" className="mr-sm-2" />
        <FormControl type="password" placeholder="Password" className="mr-sm-2" />
        <Button type="submit">Login</Button>
      </Form>
    );
  }

  const renderNavbar = () => {
    return (
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand href="#home">My App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link >Dataset 1</Nav.Link>
            <Nav.Link >Dataset 2</Nav.Link>
            <Nav.Link>Dataset 3</Nav.Link>
          </Nav>
          <div className="ml-auto">
            {renderCountrySelector()}
            {renderLoginForm()}
          </div>
        </Navbar.Collapse>
      </Navbar>
    );
  }

  const renderChart = () => {
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Add more colors if you have more countries
    const countries = Array.from(fetchedData.keys());

    return (
      <LineChart
        width={800}
        height={500}
        data={combinedData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="quarter" domain={['auto', '2022-Q1']} />
        <YAxis />
        <Tooltip />
        <Legend />
        {countries.map((country, index) => (
          <Line
            key={country}
            type="monotone"
            dataKey={country}
            stroke={colors[index % colors.length]}
            activeDot={{ r: 8 }}
          />
        ))}
        <ReferenceLine x="2020-Q1" stroke="red" label="Start" isFront={false} />
      </LineChart>
    );
  }


  return (
    <div className="d-flex flex-column align-items-center justify-content-center  pt-5">
    {renderNavbar()}
    <h1 className="mt-5">GDP Debt Quarterly</h1>
    <div>
      <p>Range with custom tooltip</p>
      <Range min={0} max={20} defaultValue={[3, 10]} />
    </div>
    <div className="w-80 h-80 mt-5">
      {renderChart()}
    </div>
  </div>
  );
}

export default App;




