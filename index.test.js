const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
});

const Name = sequelize.define('Name', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'names',
    timestamps: false
});

app.get('/', async (req, res) => {
    const names = await Name.findAll();
    let namesList = '';

    names.forEach((item) => {
        namesList += `<li>${item.name}</li>`;
    });

    res.send(`
        <h1>Full Cycle</h1>
        <br>
        <form action="/addname" method="POST">
            <input type="text" name="name" placeholder="Insira um nome..." required>
            <button type="submit">Adicionar</button>
        </form>
        <br>
        <h3>Nomes no Banco de Dados</h3>
        <ul>
            ${namesList}
        </ul>
    `);
});

app.post('/addname', async (req, res) => {
    const name = req.body.name;
    await Name.create({ name });
    res.redirect('/');
});

beforeAll(async () => {
    await sequelize.sync();
});

describe('GET /', () => {
    it('should return 200 and the HTML content', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('<h1>Full Cycle</h1>');
    });
});

describe('POST /addname', () => {
    it('should insert a name and redirect to /', async () => {
        const res = await request(app)
            .post('/addname')
            .send('name=TestName');
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toBe('/');
    });
});