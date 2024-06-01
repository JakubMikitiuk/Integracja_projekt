import React, { useState } from "react";
import axios from "axios";
import "./App.scss";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import ErrorDisplay from "./components/ErrorDisplay";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      error: null,
      selectedCountry: 'Poland',
      fetchedData: new Map(), // Initialize fetchedData as a Map
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
        this.setState({ error: error.message }); // update error state
      });
  }





  handleAddTodo = (value) => {
    axios
      .post("/api/todos", { text: value })
      .then(() => {
        this.setState({
          todos: [...this.state.todos, { text: value }],
        });
      })
      .catch((e) => {
        console.log("Error : ", e);
        this.setState({ error: e.message }); // update error state
      });
  };

  render() {

    return (
      <div className="App" style={{ height: '100vh' }}>
        <Navbar bg="dark" variant="dark" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Navbar.Brand href="#home">My App</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link onClick={() => this.handleDatasetChange(1)}>Dataset 1</Nav.Link>
              <Nav.Link onClick={() => this.handleDatasetChange(2)}>Dataset 2</Nav.Link>
              <Nav.Link onClick={() => this.handleDatasetChange(3)}>Dataset 3</Nav.Link>
            </Nav>
          </div>
          <select value={this.state.selectedCountry} onChange={this.handleCountryChange}>
            {Array.from(this.state.fetchedData.keys()).map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <Form inline onSubmit={this.handleLogin} style={{ display: 'flex' }}>
            <FormControl type="text" placeholder="Username" className="mr-sm-2" />
            <FormControl type="password" placeholder="Password" className="mr-sm-2" />
            <Button type="submit">Login</Button>
          </Form>
        </Navbar>
        <div className="container-fluid h-100">
          <div className="row h-100">
            <div className="col">
              <div className="App container">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12 col-sm-8 col-md-8 offset-md-2">
                      <h1>Todos</h1>
                      <div className="todo-app">
                        <AddTodo handleAddTodo={this.handleAddTodo} />
                        <button onClick={this.handleImport}>Import CSV</button>
                        <button onClick={this.fetchData1}>Fetch GDP Data</button>
                        <TodoList todos={this.state.todos} />
                        <ErrorDisplay error={this.state.error} /> {/* use ErrorDisplay */}
                      </div>

                      <LineChart
                        width={500}
                        height={300}
                        data={this.state.fetchedData.get(this.state.selectedCountry)}
                        margin={{
                          top: 5, right: 30, left: 20, bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="quarter" /> {/* X-axis represents "TIME" */}
                        <YAxis scale="log" domain={['auto', 'auto']} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} /> {/* Line represents "Value" */}
                      </LineChart>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
