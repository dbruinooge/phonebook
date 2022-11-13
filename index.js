const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

let phonebook = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

function generateId() {
  const maxId = phonebook.length > 0
    ? Math.max(...phonebook.map(person => person.id))
    : 0
  return maxId + 1;
}

app.use(cors());
app.use(express.json());

app.use(morgan((tokens, req, res) => {
  let person = { name: req.body.name, number: req.body.number };
  console.log(req.body);
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(person)
  ].join(' ');
}));

app.get('/info', (request, response) => {
  const requestTime = new Date().toString();
  response.send(`<p>Phonebook has info for ${phonebook.length} people</p>
                 <p>${requestTime}</p>`);
});

app.get('/api/persons', (request, response) => {
  response.json(phonebook);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find(entry => entry.id === id);
  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter(entry => entry.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const person = request.body;
  if (!person.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (phonebook.find(entry => entry.name === person.name)) {
    return response.status(400).json({
      error: 'name already exists in phonebook'
    })
  } else {
    person.id = generateId();
    phonebook.push(person);
    response.json(person);
  }

});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})