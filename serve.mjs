import express from 'express'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()

const staticSomething = express.static(__dirname + '/public')
console.log({staticSomething})
app.use(staticSomething)

const server = app.listen(5000)