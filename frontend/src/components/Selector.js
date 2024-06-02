
import React from 'react';

const CountrySelector = ({ selectedCountry, handleCountryChange, fetchedData }) => {
  return (
    <form className="form-inline">
      <select className="custom-select" value={selectedCountry} onChange={handleCountryChange}>
        {Array.from(fetchedData.keys()).map(country => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>
    </form>
  );
};

export default CountrySelector;