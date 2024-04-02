const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('<h1>Envelope Budgeting is the Best!</h1>');
});

app.get('/envelopes', function (req, res, next) {
    console.log(`Sending all envelopes`);
    res.send(envelopeArray);
});

app.get('/envelopes/id/:id', function (req, res, next) {
    console.log(`Looking up ${req.params.id}`);
    const foundEnvelope = envelopeArray.find(({ id }) => id === Number(req.params.id));
    console.log(`Found ${foundEnvelope.name} with ID:${foundEnvelope.id} with $${foundEnvelope.amount}`);
    res.send(foundEnvelope);
});

app.get('/envelopes/name/:name', function (req, res, next) {
    console.log(`Looking up ${req.params.name}`);
    const foundEnvelope = envelopeArray.find(({ name }) => name === req.params.name);
    console.log(`Found ${foundEnvelope.name} with ID:${foundEnvelope.id} with $${foundEnvelope.amount}`);
    res.send(foundEnvelope);
});

app.post('/envelopes', function (req, res, next) {
    console.log(`Creating new envelope...`);
    const newEnvelope = envelopeArray.push(createEnvelope(req.query));
    res.send(envelopeArray[envelopeArray.length -1]);
    console.log(envelopeArray[envelopeArray.length -1])
});

app.put('/envelopes/:id/:amount', function (req, res, next) {
    console.log(`updating envelope ${req.params.id}`);
    const updatedEnvelope = updateEnvelope(req.params.id, req.params.amount);
    console.log(`update complete`);
    res.send(updatedEnvelope);
});

app.post('/envelopes/transfer/:id1/:id2/:amount', function (req, res, next) {
    console.log(`transfer in process ${Number(req.params.amount)} from: ${Number(req.params.id1)} to: ${Number(req.params.id2)}`);
    const transferedEnvelope = transferEnvelope(req.params.id1, req.params.id2, req.params.amount);
    res.send(transferedEnvelope);
});

app.delete('/envelopes/id/:id', function (req, res, next) {
    deleteEnvelope(Number(req.params.id));
    res.status(204).send();
});


const envelopeArray = [
    { id: Number(1), name: 'Car', amount: Number(100) },
    { id: Number(2), name: 'Groceries', amount: Number(120) },
    { id: Number(3), name: 'Housing', amount: Number(140) },
];

let currentId;

const createEnvelope = (queryArguments) => {
    if (queryArguments.hasOwnProperty('name') && queryArguments.hasOwnProperty('amount')) {
        currentId = envelopeArray.length +1;
        return {
            'id':  currentId,
            'name': queryArguments.name,
            'amount': Number(queryArguments.amount),
        };
    } else {
        return false;
    }
};

const updateEnvelope = (id, amount) => {
    envelopeArray[id -1].amount += Number(amount);
    return envelopeArray[id -1];
};

const transferEnvelope = (id1, id2, amount) => {
    console.log(`From: ${id1} - To: ${id2} - Amount: ${amount}`);
    envelopeArray[id1 -1].amount -= Number(amount);
    envelopeArray[id2 -1].amount += Number(amount);
    const fromEnvelope = envelopeArray[id1 -1];
    const toEnvelope = envelopeArray[id2 -1];
    return [fromEnvelope, toEnvelope];
}

const deleteEnvelope = (id) => {
    const deletedEnvelope = envelopeArray[id -1];
    envelopeArray.splice(id -1, 1);
    return deleteEnvelope;
};

console.log(`listening on ${PORT}...`)
app.listen(PORT);