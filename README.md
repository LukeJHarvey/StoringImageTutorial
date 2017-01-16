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
		morgan = require("morgan");


	var app = express();

	app.listen(3000);
	console.log("Server started on port 3000");
	```

4.  Now setup middleware for the webserver. Placing it after `var app = express()` and before `app.listen(3000)`

	```javascript
	//When a client connects to the server it will log in the console.
	app.use(morgan("short"));
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
			<link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.4.2/pure-
				min.css">
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

	This will be the main page for the website.

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

	This will be one of the pages to display the images stored

	`img.ejs`

	```html
	<% include header %>
	<h1>Ejs Page with Image</h1>

	<img src= <%= imgstuff %> height="400" width="400"/>
	<br><br>

	<% include footer %>
	```

8.  Now we will show index.ejs when someone goes onto localhost:3000/
