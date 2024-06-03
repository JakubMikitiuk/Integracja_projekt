const express = require("express");

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { GdpData } = require('../models/gdpModel');
const { FlightsData } = require('../models/FlightsModel');

const routes = (app) => {
  const router = express.Router();


  router.get('/gdp-data', async (req, res) => {
    try {
      const data = await GdpData.find();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post("/import-csv", async (req, res) => {
    try {
      const count = await GdpData.countDocuments({});

      if (count > 0) {
        res.status(400).json({ message: "Already exists" });
        return;
      }

      const stream = fs.createReadStream(path.join(__dirname, '..', 'data', 'GDP_DATA.csv')).pipe(csv({ separator: ';' }));
      const results = [];

      for await (const row of stream) {
        console.log('Row from CSV:', row); 

       
        const dataPoints = Object.keys(row).map(key => {
          if (key.includes('Q')) { 
            return {
              quarter: key,
              value: parseFloat(row[key].replace(',', '.'))
            };
          }
        }).filter(Boolean); 

        const data = new GdpData({
          TIME: row['TIME'],
          data: dataPoints
        });

        const result = await data.save();
        results.push(result);
      }
      res.status(200).json({ message: " SUCCESSFUL ", data: results });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  });




  router.get('/gdp-data2', async (req, res) => {
    try {
      const data = await FlightsData.find();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  //flights data
  router.post("/import-csv2", async (req, res) => {
    try {
      const count = await FlightsData.countDocuments({});

      if (count > 0) {
        res.status(400).json({ message: "Already exists" });
        return;
      }

      const stream = fs.createReadStream(path.join(__dirname, '..', 'data', 'Lotniczy.csv')).pipe(csv({ separator: ';;' }));
      const results = [];

      for await (const row of stream) {
        console.log('Row from CSV:', row); 

      
        const dataPoints = Object.keys(row).map(key => {
   
          if (key.includes('-')) {
            return {
              Month: key,
              value: parseFloat(row[key].replace(/\s/g, ''))
            };
          }
        }).filter(Boolean); 

        const data = new FlightsData({
          TIME: row['TIME'],
          data: dataPoints
        });

        const result = await data.save();
        results.push(result);
      }

      res.status(200).json({ message: " SUCCESSFUL ", data: results });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  });

  app.use("/api", router);
};
module.exports = routes;
