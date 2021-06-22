import faker from 'faker';
import mysql from 'mysql2';
import Cat from './Cat.js';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'store'
});

const promises = [];
const images = fs.readdirSync(`${__dirname}/public/cats`);

for (let i = 1; i < 1500; i++) {
    const cat = new Cat(
        faker.animal.cat(),
        faker.date.past().toISOString().slice(0,10),
        faker.random.arrayElement(Cat.colors),
        `/cats/${faker.random.arrayElement(images)}`,
        faker.random.arrayElement([0, 1]),
    )
    promises.push(cat.save(connection)
        .then(c => {
            console.log(`${c.name} - ${c.color}`);
        }));
}

Promise.all(promises)
    .then(() => {
        connection.end();
    })
