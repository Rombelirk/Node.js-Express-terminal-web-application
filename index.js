// chcp 65001

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var exec = require('child_process').exec;
var uuid = require ('uuid');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(express.static(path.join(__dirname, 'public')));



var history = [];

app.get('/history', function (req,res) {

	res.send(history);
});

// app.get('/', function (req,res) {
//
// 	res.send('index');
// });

app.post('/', function (req,res) {
  var dateStart = new Date,

			command = {
		value: req.body.val,
		comment: req.body.comment,
		started: dateStart.getHours()+':'+dateStart.getMinutes()+':'+dateStart.getSeconds(),
		finished: "",
		response: "",
		status: "pending",
		id: uuid()
	};

	history.push(command);

	exec(req.body.val, function (error, stdout, stderr) {
		var ind, dateFinish = new Date;
		command.response = (error) ? stderr : stdout;
		command.status = (error) ? "error" : "success";
		command.finished = dateFinish.getHours()+':'+dateFinish.getMinutes()+':'+dateFinish.getSeconds();
		ind = history.findIndex(function(el){
			return el.id === command.id
		});
		history[ind].status = command.status;
		history[ind].response = command.response;
		history[ind].finished = command.finished;

		res.send(history);

	});
});

app.listen(3000);
console.log('Server is running on port 3000');
