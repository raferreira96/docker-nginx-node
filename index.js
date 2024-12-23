const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

const config = {
    host: 'db',
    user: 'node',
    password: 'node',
    database: 'node',
};

const con = mysql.createConnection(config);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const query = 'SELECT name FROM names';
    con.query(query, (err, result) => {
        if (err) throw err;
        let names = '';

        result.forEach((item) => {
            names += `<li>${item.name}</li>`;
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
                ${names}
            </ul>
        `);
    });
});

app.post('/addname', (req, res) => {
    const name = req.body.name;
    const query = 'INSERT INTO names (name) VALUES (?)';
    con.query(query, [name], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});