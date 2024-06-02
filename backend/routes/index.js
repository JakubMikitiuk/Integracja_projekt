const express = require("express");
const serverResponses = require("../utils/helpers/responses");
const messages = require("../config/messages");
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
        serverResponses.sendError(res, messages.ALREADY_EXIST, 'Collection is not empty');
        return;
      }

      const stream = fs.createReadStream(path.join(__dirname, '..', 'data', 'GDP_DATA.csv')).pipe(csv({ separator: ';' }));
      const results = [];

      for await (const row of stream) {
        console.log('Row from CSV:', row); // Log the row from the CSV file

        // Create an array of data points for each quarter
        const dataPoints = Object.keys(row).map(key => {
          if (key.includes('Q')) { // Only process the properties representing quarters
            return {
              quarter: key,
              value: parseFloat(row[key].replace(',', '.'))
            };
          }
        }).filter(Boolean); // Remove undefined values

        const data = new GdpData({
          TIME: row['TIME'],
          data: dataPoints
        });

        const result = await data.save();
        results.push(result);
      }

      serverResponses.sendSuccess(res, messages.SUCCESSFUL, results);
    } catch (e) {
      console.error(e);
      serverResponses.sendError(res, messages.BAD_REQUEST, e);
    }
  });



//flights data
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
        serverResponses.sendError(res, messages.ALREADY_EXIST, 'Collection is not empty');
        return;
      }

      const stream = fs.createReadStream(path.join(__dirname, '..', 'data', 'Lotniczy.csv')).pipe(csv({ separator: ';;' }));
      const results = [];

      for await (const row of stream) {
        console.log('Row from CSV:', row); // Log the row from the CSV file

        // Create an array of data points for each quarter
        // Create an array of data points for each month
        const dataPoints = Object.keys(row).map(key => {
          // Only process the properties representing months
          if (key.includes('-')) {
            return {
              Month: key,
              value: parseFloat(row[key].replace(/\s/g, ''))
            };
          }
        }).filter(Boolean); // Remove undefined values

        const data = new FlightsData({
          TIME: row['TIME'],
          data: dataPoints
        });

        const result = await data.save();
        results.push(result);
      }

      serverResponses.sendSuccess(res, messages.SUCCESSFUL, results);
    } catch (e) {
      console.error(e);
      serverResponses.sendError(res, messages.BAD_REQUEST, e);
    }
  });
  //it's a prefix before api it is useful when you have many modules and you want to
  //differentiate b/w each module you can use this technique
  app.use("/api", router);
};
module.exports = routes;
