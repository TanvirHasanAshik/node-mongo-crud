const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser')
const cors = require('cors');
const uri = "mongodb+srv://student_info:F9JMcpjBPnaKK3H@cluster0.hooq3.mongodb.net/studentdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


client.connect(err => {
  const collection = client.db("studentdb").collection("studentData");
    //create Data to Database.
    app.post("/addStudent", (req, res) => {
        const studentData = req.body;
        collection.insertOne(studentData)
        .then(result => {
            console.log(studentData.name,'added successfully')
        })
    })

    //Read Data from Database.
    app.get('/allStudent', (req, res) => {
        collection.find({})
        .toArray((err, doc) => {
            res.send(doc)
        })
    })

    //Read single Data from Database
    app.get('/edit/:id', (req, res) => {
        collection.find({_id: ObjectID(req.params.id)})
        .toArray((err, doc) => {
            res.send(doc[0]);
        })
    })

    //Update Data to Database
    app.patch('/update/:id', (req, res) => {
        collection.updateOne({_id: ObjectID(req.params.id)},
        {
            $set: {name: req.body.name, roll: req.body.roll, department: req.body.department}
        })
        .then(res => {
            console.log("successfully data updated")
        })
    })
    //Delete Data from Database
    app.delete('/deleteStudentData/:id', (req, res) => {
        collection.deleteOne({_id: ObjectID(req.params.id)})
        .then(res => console.log(res.deletedCount));
    })
    console.log('Database connected');
});



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.listen(3001, () => {console.log('listening on port 3001')});