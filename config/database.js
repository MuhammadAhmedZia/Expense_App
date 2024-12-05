const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Expense_Tracker_App!')
.then(() => console.log('Database connected'))
.catch(err => console.log('Database error: ', err));

module.exports = mongoose;