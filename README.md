# Storing and Using Images w/ Express

**We are going to make a Server that gets Images from a User and stores it in the server.**

1.  Start by making a `package.json` w/ Dependencies and npm start statement.

	```javascript
	{
		"scripts": {
			"start": "node app.js"
		},
		"dependencies": {
			"ejs": "^2.5.5",
			"connect-busboy": "0.0.2",
			"express": "^4.14.0",
			"fs": "0.0.1-security",
			"morgan": "^1.7.0",
			"path": "^0.12.7"
		}
	}
	```
2.  Now in a terminal or console inside the folder containing `package.json` run npm install. It will take awhile to install the dependencies.

3.  Make an `app.js` file and require the dependencies and setup the server.

	```javascript
	var
		express = require("express");
		path = require("path");
		ejs = require("ejs");
		fs = require("fs");
		busboy = require("connect-busboy");
		morgan = require("morgan");


	var app = express();

	app.listen(3000);
	console.log("Server started on port 3000");
	```

4.  Now setup middleware for the webserver. Placing it after `var app = express()` and before `app.listen(3000)`

	```javascript
	//When a client connects to the server it will log in the console.
	app.use(morgan("short"));
	//Will allow us to get Images later.
	app.use(busboy());
	```

5.  With this website we will be using EJS as a view engine, which can dynamically render HTML.

	```javascript
	//Our EJS files will be located in a folder named "views".
	app.set("views", path.resolve(__dirname, "views"));
	//This sets our "view engine" to ejs
	app.set("view engine", "ejs");
	```

6.  Now create two folders next to `app.js` and package.json: One named `"files"` and One named `"views"`

7.  Let's setup the ejs files that we will be using during this project.
	
	This will be the header for each page.

	`header.ejs`

	```html
	<!DOCTYPE html>
		<html>
			<head>
			<meta charset="utf-8">
			<title>Attempt Website 001</title>
		</head>
		<body>
	```

	This will be the footer for each page.

	`footer.ejs`

	```html
	</body>
	</html>
	```

	This will be the page people are directed to if they go onto a part of the website with no function.

	`404.ejs`

	```html
	<% include header %>
	<h1>404 error! File not found.</h1>
	<% include footer %>
	```

	This will be the main page for the website. The form will post to `localhost:3000/` and will send multipart data.

	`index.ejs`

	```html
	<% include header %>

	<h1>Send image to be stored.</h1>

	<form action="/" method="post" enctype="multipart/form-data">
		File Name(unique): <input type="text" name="id">
		<input type="file" name="img" accept="image/*"/><br><br>
		<input type="submit"/><br><br><hr>
	</form>

	<% include footer %>
	```

	This will be one of the pages to display the images stored. 

	`img.ejs`

	```html
	<% include header %>
	<h1>Ejs Page with Image</h1>

	<img src= <%= imgstuff %> height="400" width="400"/>
	<br><br>

	<% include footer %>
	```

8.  Now we will show index.ejs when someone goes onto `localhost:3000/` This is where people will submit their pictures in a form.

	```javascript
	app.get("/", function(req,res) {
		res.render("index");
	})
	```

9.  Now we have to get the pictures from the form that is posting to `localhost:3000/`

	```javascript
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
		var str = filename.split(".");
		//makes fstream a writable stream, so that a file can be saved at that location.
		fstream = fs.createWriteStream(__dirname + '/files/' + id + str[1]);
		//reads the file that was posted and writes it to fstream
		file.pipe(fstream);
		});
		fstream.on('close', function() {
			console.log("file uploaded");
		})
	})
	```

10. Now app.js should looks something like this

	```javascript
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
		var newFName = id + str[1];
		//makes fstream a writable stream, so that a file can be saved in the files folder in the server with the new name.
		fstream = fs.createWriteStream(__dirname + '/files/' + newFName);
		//reads the file that was posted and writes it to fstream
		file.pipe(fstream);
		});
		fstream.on('close', function() {
			console.log("file uploaded to server");
			//redirects the client to where the image will be displayed later.
			res.redirect("/image/" + id);
		});
	});

	app.listen(3000);
	console.log("Server started on port 3000");
	```

11. Now I'm going to show you two different methods to getting at the files we have stored. The first will just display the image directly from the folder. The second will display the image on an ejs webpage.

11.1 This method is more or less pretty simple. If a client went onto `localhost:3000/files/file.type` file being the name, and type being its type, the server will send the file directly to the client. 

	```javascript
	//sets a path that leads to your files folder
	var staticPath = path.join(__dirname, "files");
	//express.static will look at staticPath and will directly render the file that a client is looking for on the browser.
	app.use("/files", express.static(staticPath));
	```

11.2 This method is different, instead of just sending the file, the server will instead send an ejs file that will have the image on it already. Requires the other method to have been done first

	```javascript
	app.get("/image/:id", function(req,res) {
		res.render("img", {
			imgstuff: "\"" + req.headers.host. + "/files/" + id "\""
		})
	});
	```
