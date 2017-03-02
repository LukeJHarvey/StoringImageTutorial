var
	express = require("express");
	path = require("path");
	ejs = require("ejs");
	fs = require("fs");
	busboy = require("connect-busboy");
	morgan = require("morgan");

var app = express();

//Our EJS files will be located in a folder named "views".
app.set("views", path.resolve(__dirname, "views"));
//This sets our "view engine" to ejs
app.set("view engine", "ejs");

//When a client connects to the server it will log in the console.
app.use(morgan("short"));
//Will allow us to get Images later.
app.use(busboy());

app.get("/", function(req,res) {
	res.render("index");
});
//sets a path that leads to your files folder
var staticPath = path.join(__dirname, "files");
//express.static will look at staticPath and will directly render the file that a client is looking for on the browser.
app.use("/files", express.static(staticPath));

app.get("/image/:id", function(req,res) {
	var str = "http://" + req.headers.host + "/files/" + req.params.id;
    res.render("img", {
        imgstuff: str
    })
});

app.post("/", function(req,res) {
	var fstream;
	//reades the Request stream and writes it to the busboy stream in the Request.
	req.pipe(req.busboy);
	var id;
	//when there is a field posted then save the field into id
	req.busboy.on('field', function(fieldname, val) {
		id = val;
	});
	//when there is a file posted then save file
	req.busboy.on('file', function(fieldname, file, filename) {
	console.log("uploading: " + id + " to server");
	// str[0] is the filename and str[1] is the file type
	var str = filename.split(".");
	//creates new filename to be used
	id = id + "." + str[1];
	//makes fstream a writable stream, so that a file can be saved in the files folder in the server with the new name.
	fstream = fs.createWriteStream(__dirname + '/files/' + id);
	//reads the file that was posted and writes it to fstream
	file.pipe(fstream);
	fstream.on('close', function() {
		console.log("file uploaded to server");
		//redirects the client to where the image will be displayed later.
		//if method 11.2
		res.redirect("/image/" + id);
		//if method 11.1
		//res.redirect("/files/" + id);
	});
	});
});

app.listen(3000);
console.log("Server started on port 3000");