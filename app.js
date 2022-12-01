const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs= require('fs');
const notes = fs.readFileSync('./db/db.json')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

// Solicitud GET para revisiones
app.get('/api/notes', (req, res) => {
    const contents = fs.readFileSync('./db/db.json', 'utf-8');
    res.status(200).json(JSON.parse(contents));
});

app.post('/api/notes', (req, res) => {
    const contents = fs.readFileSync('./db/db.json', 'utf-8');
    const data = JSON.parse(contents)
    const body = req.body
    body.id = uuidv4()
    data.push( body )
    fs.writeFile("./db/db.json",  JSON.stringify( data ), {
        encoding: "utf-8",
        flag: 'w',
        mode: 0o666
    }, 
    (err)=> {
        if(err) console.log(err)
        else{ 
            console.log('Write success')
        }
    })
    res.status(200).json(notes)
})

app.delete('/api/notes/:id', (req,res) => {
    const { id } = req.params
    console.log(id)
    const contents = fs.readFileSync('./db/db.json', 'utf-8');
    const data = JSON.parse(contents)
    fs.writeFile("./db/db.json",  JSON.stringify( data.filter(note => note.id !== id) ), {
        encoding: "utf-8",
        flag: 'w',
        mode: 0o666
    }, 
    (err)=> {
        if(err) console.log(err)
        else{ 
            console.log('Delete success')
            res.status(200).json(data.filter(note => note.id !== id))
        }
    })
    
})

app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
); 


app.listen(process.env.PORT || 5000, () =>
  console.log(`App listening`)
);