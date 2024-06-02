import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Label ,ReferenceLine} from 'recharts';

const SelectedCountryChart = ({ selectedCountry, combinedData }) => {
  const data = combinedData.map(item => ({ quarter: item.quarter, value: item[selectedCountry] }));

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
      <XAxis dataKey="quarter" >
         <Label value="Quarters" position='insideBottom' offset={-5} />
      </XAxis>
      <YAxis scale="log" domain={['auto', 'auto']}>
      <Label value="GDP debt" angle={-90} position='insideLeft' />
      </YAxis>
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      <ReferenceLine x="2020-Q1" stroke="red" label="Start" isFront={false} />
    </LineChart>
    </ResponsiveContainer>
  );
};

export default SelectedCountryChart;