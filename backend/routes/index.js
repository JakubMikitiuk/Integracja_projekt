const express = require("express");
const serverResponses = require("../utils/helpers/responses");
const messages = require("../config/messages");
const { Todo } = require("../models/todos/todo");
const { DeathCount } = require("../models/todos/deathcount");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

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

  router.post("/import-csv", (req, res) => {
    DeathCount.countDocuments({}, (err, count) => {
      if (err) {
        console.error(e);
        serverResponses.sendError(res, messages.BAD_REQUEST, err);
      } else if (count > 0) {
        
        serverResponses.sendError(res, messages.NOT_FOUND, 'Collection is not empty');
        console.error('Collection is not empty');
      } else {
        const deathCounts = [];
  
        fs.createReadStream(path.join(__dirname, '..', 'data', 'Zgony.csv'))
          .pipe(csv())
          .on('data', (row) => {
            const deathCount = new DeathCount({
              week: row['Nr tygodnia'],
              year2016: row['2016'],
              year2017: row['2017'],
              year2018: row['2018'],
              year2019: row['2019'],
              year2020: row['2020'],
              year2021: row['2021'],
              year2022: row['2022'],
              year2023: row['2023'],
            });
  
            deathCounts.push(deathCount);
          })
          .on('end', () => {
            Promise.all(deathCounts.map(deathCount => deathCount.save()))
              .then((results) => {
                serverResponses.sendSuccess(res, messages.SUCCESSFUL, results);
              })
              .catch((e) => {
                console.error(e);
                serverResponses.sendError(res, messages.BAD_REQUEST, e);
              });
          });
      }
    });
  });
  //it's a prefix before api it is useful when you have many modules and you want to
  //differentiate b/w each module you can use this technique
  app.use("/api", router);
};
module.exports = routes;
