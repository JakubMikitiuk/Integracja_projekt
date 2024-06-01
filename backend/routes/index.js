const express = require("express");
const serverResponses = require("../utils/helpers/responses");
const messages = require("../config/messages");
const { Todo } = require("../models/todos/todo");
const { DeathCount } = require("../models/todos/deathcount");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { GdpData } = require('../models/todos/gdpModel');

const routes = (app) => {
  const router = express.Router();

  router.post("/todos", (req, res) => {
    const todo = new Todo({
      text: req.body.text,
    });

    todo
      .save()
      .then((result) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, result);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });

  router.get("/", (req, res) => {
    Todo.find({}, { __v: 0 })
      .then((todos) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, todos);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });

  router.get('/gdp-data', async (req, res) => {
    try {
      const data = await GdpData.find();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post("/import-csv", async (req, res) => {
    try {
      const count = await GdpData.countDocuments({});
  
      if (count > 0) {
        serverResponses.sendError(res, messages.BAD_REQUEST, 'Collection is not empty');
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

  //it's a prefix before api it is useful when you have many modules and you want to
  //differentiate b/w each module you can use this technique
  app.use("/api", router);
};
module.exports = routes;
