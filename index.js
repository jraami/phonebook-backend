const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
morgan.token('bodycontent', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :bodycontent :status :res[content-length] - :response-time ms'))

let persons = [
    {
        "name": "Markku Alakulo",
        "number": "0502034",
        "id": 8
    },
    {
        "name": "Matti Metkula",
        "number": "050-12345",
        "id": 11
    },
    {
        "name": "Meeri Makia",
        "number": "055-50550505",
        "id": 12
    },
    {
        "name": "Muksis McPuksis",
        "number": "050-12345",
        "id": 13
    },
    {
        "name": "Melli Mullikas",
        "number": "00132",
        "id": 14
    },
    {
        "name": "Aavertti Olotila",
        "number": "01203123",
        "id": 15
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    res.send('There are ' + persons.length + ' people in the phonebook.')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})
// Generoidaan ID postausta varten
const generateId = () => {
    const maxId = persons.length > 0 ? persons.map(n => n.id).sort((a, b) => a - b).reverse()[0] : 1
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ error: 'Needs a name.' })
    }
    else if (!body.number) {
        return response.status(400).json({ error: 'Needs a number.' })
    }
    else if (persons.find(entry => entry.name.toLowerCase() === body.name.toLowerCase()) !== undefined) {
        return response.status(400).json({ error: 'Can\'t be a duplicate name' })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
