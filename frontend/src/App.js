import React, { useState } from "react";
import axios from "axios";
import "./App.scss";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import ErrorDisplay from "./components/ErrorDisplay";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ReferenceArea } from 'recharts';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      error: null,
      selectedCountry: 'Poland',
      fetchedData: new Map(), // Initialize fetchedData as a Map
      min: 0,
      max: combinedData.length - 1 || 0,
    };

  }

  handleCountryChange = (event) => {
    this.setState({ selectedCountry: event.target.value });
  }

  componentDidMount() {
    axios
      .get("/api")
      .then((response) => {
        this.setState({
          todos: response.data.data,
        });
      })
      .catch((e) => console.log("Error : ", e));


    this.fetchData1();
    this.handleImport();
  }

  fetchData1 = async () => {
    try {
      const response = await axios.get('/api/gdp-data'); // Replace with your Express.js backend URL
      const data = response.data; // This is the array of data objects
      const transformedData = data.reduce((acc, item) => {
        acc.set(item.TIME, item.data.map(({ quarter, value }) => ({ quarter, value })));
        return acc;
      }, new Map());
      this.setState({ fetchedData: transformedData }); // Update the state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  handleImport = () => {
    axios.post('/api/import-csv')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error importing CSV:', error);
      });
  }






  renderNavbar() {
    return (
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand href="#home">My App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={() => this.handleDatasetChange(1)}>Dataset 1</Nav.Link>
            <Nav.Link onClick={() => this.handleDatasetChange(2)}>Dataset 2</Nav.Link>
            <Nav.Link onClick={() => this.handleDatasetChange(3)}>Dataset 3</Nav.Link>
          </Nav>
          <div className="ml-auto">
            {this.renderCountrySelector()}
            {this.renderLoginForm()}
          </div>
        </Navbar.Collapse>
      </Navbar>
    );
  }

  renderCountrySelector() {
    return (
      <Form inline>
        <select value={this.state.selectedCountry} onChange={this.handleCountryChange}>
          {Array.from(this.state.fetchedData.keys()).map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </Form>
    );
  }

  renderLoginForm() {
    return (
      <Form inline onSubmit={this.handleLogin} style={{ display: 'flex' }}>
        <FormControl type="text" placeholder="Username" className="mr-sm-2" />
        <FormControl type="password" placeholder="Password" className="mr-sm-2" />
        <Button type="submit">Login</Button>
      </Form>
    );
  }
  renderChart() {


    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Add more colors if you have more countries
    const countries = Array.from(this.state.fetchedData.keys());

    const combinedData = [];
    this.state.fetchedData.forEach((value, key) => {
      value.forEach(item => {
        const existingItem = combinedData.find(d => d.quarter === item.quarter);
        if (existingItem) {
          existingItem[key] = item.value;
        } else {
          combinedData.push({ quarter: item.quarter, [key]: item.value });
        }
      });
    });
    console.log(combinedData);

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

  render() {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center  pt-5">
        {this.renderNavbar()}
        <h1 className="mt-5">GDP Debt Quarterly</h1>

        <ErrorDisplay error={this.state.error} className="mt-3" />
        <Slider.Range
          min={0}
          max={combinedData.length - 1}
          value={[this.state.min, this.state.max]}
          onChange={value => this.setState({ min: value[0], max: value[1] })}
        />
        <div className="w-80 h-80 mt-5">
          {this.renderChart()}
        </div>
      </div>
    );
  }
}
