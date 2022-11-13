const mongoose = require('mongoose')
const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.xv3deqy.mongodb.net/?retryWrites=true&w=majority`;
  
const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
} else if (process.argv.length === 3) {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected');
      Person.find({})
        .then(result => {
          console.log('phonebook:');
          result.forEach(entry => {
            console.log(entry.name, entry.number);
          });
          return mongoose.connection.close();
        })
    })
    .catch(err => console.log(err));
} else {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected');

      const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4]
      });

      return newPerson.save();
    })
    .then(() => {
      console.log(`Added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}

