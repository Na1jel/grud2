import express from 'express';
import mysql from 'mysql2';
import methodOverride from 'method-override';
import bodyParser from "body-parser";

import Cat from "./Cat.js";
import './helpers.js';

const app = express();
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('X-HTTP-Method')) //          Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(methodOverride('X-Method-Override')) //
app.set('view engine', 'hbs');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'store'
});
app.get('/cats/new', (request, res) => {
    res.render('cats/newcat', { title: 'Add new cat', layout: 'layout' });
})

app.get('/cats/red/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM cats WHERE id=?', [id], function(err, data) {
        if (err) {
            return console.log(err)
        }
        res.render('cats/redactorcat', {
            cats: data[0]
        });
    })
})

app.post('/cats/red', urlencodedParser, function(req, res) {
    if (!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const birthdate = req.body.age;
    const color = req.body.color;
    const gender = req.body.gender
    const id = req.body.id;

    connection.query("UPDATE cats SET name=?, birthdate=?, color=?, gender=? WHERE id=?", [name, birthdate, gender, color, id], function(err, data) {
        if (err) return console.log(err);

        res.redirect("/cats");
    });
})

app.post("/cats/new", urlencodedParser, function(req, res) {

    if (!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const birthdate = req.body.age;
    const color = req.body.color;
    const gender = req.body.gender;
    connection.query("INSERT INTO cats (name, birthdate, color, gender) VALUES (?,?,?,?)", [name, birthdate, color, gender], function(err, data) {
        if (err) return console.log(err);
        res.redirect("/cats");
    });
});

app.get('/', (req, res) => {
    res.send('Hello world');
})

app.get('/cats', (req, res) => {
    const page = req.query.page || 1;
    Cat.getPage(connection, page)
        .then(data => {
            res.render(
                'cats/index', {
                    cats: data[0],
                    total: Math.ceil(data[1] / 10),
                    page: page,
                    layout: 'layout',
                    title: 'List all cats'
                }
            )
        })
});

app.post('/cats', (req, res) => {
    if (req.body._method === 'DELETE') {
        Cat.remove(connection, req.body.id)
            .then(() => {
                res.redirect('/cats');
            })
            .catch(() => {
                res.status(404).send();
            })

    }
})
app.get('/cats/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    Cat.getById(connection, id)
        .then(cat => {
            res.render('cats/view', { cat: cat, layout: 'layout', title: `View: ${cat.name}` })
        })
        .catch(() => {
            res.status(404).send();
        })
})



app.listen(3000, () => {
    console.log('Server up on 3000 port');
})