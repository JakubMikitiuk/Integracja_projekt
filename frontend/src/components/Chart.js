import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ResponsiveContainer, Label } from 'recharts';

const ChartComponent = ({ fetchedData, combinedData }) => {
    const generateColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);
 
    
    const countries = Array.from(fetchedData.keys());
    const colors = countries.map(() => generateColor());

  return (
    <ResponsiveContainer width="95%" height={500}>
    <LineChart
      width={800}
      height={500}
      data={combinedData}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="quarter" >
         <Label value="Quarters" position='insideBottom' offset={-5} />
      </XAxis>
      <YAxis>
      <Label value="GDP debt" angle={-90} position='insideLeft' />
      </YAxis>
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
    </ResponsiveContainer>
  );
};

export default ChartComponent;