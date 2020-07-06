
const express = require("express");
const app = express();
var bodyParser = require('body-parser')
var mongodb = require('mongodb')

app.use(bodyParser.json())

app.post("/list/get", (req, res) => {
	const MongoClient = require("mongodb").MongoClient;
	const uri = "mongodb://localhost:27017/to-do-app";
	const client = new MongoClient(uri, { useNewUrlParser: true });
	client.connect((err) => {
		if (err) {
			res.sendStatus(500);
			return;
		}
		const collection = client.db("to-do-app").collection("list");
		collection.find({}).toArray((error, result) => {
			if (error) {
				res.sendStatus(500)
				return
			}
			client.close();
			res.send({list: result});
		});
	});
})

app.post("/list/add", (req, res) => {
	var text = req.body.text;
	const MongoClient = require("mongodb").MongoClient;
	const uri = "mongodb://localhost:27017/to-do-app";
	const client = new MongoClient(uri, { useNewUrlParser: true });
	client.connect((err) => {
		if (err) {
			res.sendStatus(500);
			return;
		}
		const collection = client.db("to-do-app").collection("list");
		var myObj = {text: text, completed: 0};
		collection.insertOne(myObj, (err) => {
			if (err) {
				res.sendStatus(500);
				return;
			}
			res.send({newId: myObj._id});
		});
		client.close();
	});
});

app.post("/list/delete", (req, res) => {
	var id = req.body.id;
	const MongoClient = require("mongodb").MongoClient;
	const uri = "mongodb://localhost:27017/to-do-app";
	const client = new MongoClient(uri, { useNewUrlParser: true });
	client.connect((err) => {
		if (err) {
			res.sendStatus(500);
			return;
		}
		const collection = client.db("to-do-app").collection("list");
		collection.deleteOne({_id: new mongodb.ObjectID(id)});
		client.close();
		res.sendStatus(200);
	});
})

app.post("/list/edit", (req, res) => {
	var id = req.body.id;
	var newText = req.body.text;
	var completed = req.body.completed;
	const MongoClient = require("mongodb").MongoClient;
	const uri = "mongodb://localhost:27017/to-do-app";
	const client = new MongoClient(uri, { useNewUrlParser: true });
	client.connect((err) => {
		if (err) {
			res.sendStatus(500);
			return;
		}
		const collection = client.db("to-do-app").collection("list");
		collection.deleteOne({_id: id});
		collection.insertOne({_id: id, text: newText, completed: completed})
		client.close();
		res.sendStatus(200);
	});
})

// app.post("/list/editID", (req, res) => {
// 	var oldid = req.body.oldid;
// 	var newid = req.body.newid;
// 	var newText = req.body.text;
// 	var completed = req.body.completed;
// 	const MongoClient = require("mongodb").MongoClient;
// 	const uri = "mongodb://localhost:27017/to-do-app";
// 	const client = new MongoClient(uri, { useNewUrlParser: true });
// 	client.connect((err) => {
// 		if (err) {
// 			res.sendStatus(500);
// 			return;
// 		}
// 		const collection = client.db("to-do-app").collection("list");
// 		collection.deleteOne({_id: oldid});
// 		collection.insertOne({_id: newid, text: newText, completed: completed})
// 		client.close();
// 		res.sendStatus(200);
// 	});
// })

app.get('*', (req, res) => {
	res.sendFile('/Users/shwetanarang/Desktop/To-do List/frontend/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(5000, () => {console.log('listening on port 5000')});
