import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ResponsiveContainer, Label } from 'recharts';

const SelectedCountryChart = ({ selectedCountry, combinedData, isLogScale }) => {



  const firstDataPoint = combinedData[0];
   const isQuarterlyData = firstDataPoint && firstDataPoint.quarter && firstDataPoint.quarter.includes('Q');

   let data;
if (isQuarterlyData) {
   data = combinedData.map(item => ({ quarter: item.quarter, value: item[selectedCountry] }));
}else{
   data = combinedData.map(item => ({ Month: item.Month, value: item[selectedCountry] }));

}

  
console.log('Data:', data);
  return (
    <ResponsiveContainer width="95%" height={500}>
    <LineChart
      width={800}
      height={500}
      data={data}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={isQuarterlyData ? "quarter" : "Month"} >
         <Label value="Time Period" position='insideBottom' offset={-3} />
      </XAxis>
      <YAxis scale={isLogScale ? "log" : "auto"} domain={['auto', 'auto']}>
      <Label value={isQuarterlyData ? "GDP debt" : "Flights"} angle={-90} position='insideLeft' offset={-10} dy={-10}/>
      </YAxis>
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      <ReferenceLine x={isQuarterlyData ? "2020-Q1" : "2020-03"} stroke="red" label="COVID 19" isFront={false} />
    </LineChart>
    </ResponsiveContainer>
  );
};

export default SelectedCountryChart;