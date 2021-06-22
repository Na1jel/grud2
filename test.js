import faker from 'faker';
import mysql from 'mysql2';
import Cat from './Cat.js';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'store'
});


connection
    .promise()
    .query('SELECT COUNT(*) as count FROM `cats`')
    .then( count => {
        console.log(count.shift().shift().count);
    })