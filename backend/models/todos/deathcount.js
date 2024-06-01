const mongoose = require('mongoose');

const DeathCountSchema = new mongoose.Schema({

      
        year: {
          type: Number,
          required: true
        },
        quarter1: Number,
        quarter2: Number,
        quarter3: Number,
        quarter4: Number
      
    
  });

const DeathCount = mongoose.model('DeathCount', DeathCountSchema);

module.exports = { DeathCount };