import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ResponsiveContainer, Label } from 'recharts';

const ChartComponent = ({ fetchedData, combinedData, isLogScale}) => {
    const generateColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);
 
    
    const countries = Array.from(fetchedData.keys());
    const colors = countries.map(() => generateColor());

    const firstDataPoint = combinedData[0];
    console.log('First data point:', firstDataPoint);

    const isQuarterlyData = firstDataPoint && firstDataPoint.quarter && firstDataPoint.quarter.includes('Q');

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
      <XAxis dataKey={isQuarterlyData ? "quarter" : "Month"} >
         <Label value={isQuarterlyData ? "GDP debt" : "Flights"}  position='insideBottom' offset={-3} />
      </XAxis>
      <YAxis scale={isLogScale ? "log" : "auto"} domain={['auto', 'auto']}>
      <Label value={isQuarterlyData ? "GDP debt" : "Flights"} angle={-90} position='insideLeft' offset={-10} dy={-10}/>
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
   
      <ReferenceLine x={isQuarterlyData ? "2020-Q1" : "2020-03"} stroke="red" label="COVID 19" isFront={false} />
    </LineChart>
    </ResponsiveContainer>
   
  );
};

export default ChartComponent;