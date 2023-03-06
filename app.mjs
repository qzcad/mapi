// include express
import express, { response } from "express";
import fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url))


const app = express();
const urlParser = express.urlencoded({extended: false});

app.use(
    function(request, response, next) {
        let now = new Date();
        let day_of_month = now.getDate();
        let month = now.getMonth();
        let year = now.getFullYear();
        let hours = now.getHours();
        let mimutes = now.getMinutes();
        let seconds = now.getSeconds();
        let data = `${year}-${month}-${day_of_month} - ${hours}:${mimutes}:${seconds} - ${request.method} - ${request.url} - ${request.get("user-agent")}`;
        console.log(data);
        fs.appendFile("server.log", data + "\n", function(){});
        next();
    }
);


app.get(
    "/",
    function (request, response) {
        response.sendFile(
            __dirname + "/html/index.html"
        )
    }
);

app.get(
    "/register(.html)?",
    function (request, response) {
        response.sendFile(
            __dirname + "/html/register.html"
        )
    }
);

app.post(
    "/register(.html)?",
    urlParser,
    function (request, response) {
        if (!request.body)
            return response.sendStatus(400);
        console.log(request.body);
        response.send(
            {
                "name": request.body.userName,
                "age": request.body.userAge
            }
        )
    }
);

app.get(
    "/array",
    function (request, response) {
        response.send(["item 1", "item 2", 3])
    }
);

app.get(
    "/object",
    function (request, response) {
        response.send(
            {
                "id": 6,
                "value": "six"
            }
        )
    }
);

app.get(
    "/object/get",
    function (request, response) {
        let id = request.query.id;
        let name = request.query.name;
        let integers = request.query.integers;
        response.send(
            {
                "id": id,
                "value": name,
                "array": integers
            }
        )
    }
);

app.get(
    "/search/category/:categoryId/product/:productName",
    function (request, response) {
        let categoryId = request.params["categoryId"];
        let productName = request.params["productName"];
        // serach for a product by a name in the category
        response.send(
            {
                "category": categoryId,
                "product": productName
            }
        );
    }
);

app.get(
    "/file/:fileName.:fileExt",
    function(request, response) {
        let fileName = request.params["fileName"];
        let fileExt = request.params["fileExt"];
        response.sendFile(__dirname + "/html/" + fileName + "." + fileExt);
    }
)

app.get(
    "/info/home",
    function (request, response) {
        response.redirect("..");
    }
);

app.get(
    "/info",
    function (request, response) {
        response.redirect(301, "about");
    }
);

app.get(
    "/about",
    function(request, response) {
        response.send("<h1>About Page</h1>");
    }
);

app.get(
    "/undefined",
    function (request, response) {
        response.sendStatus(404)
    }
);

app.get(
    "/forbidden",
    function (request, response) {
        response.sendStatus(403)
    }
);

app.get(
    "/book(.html)?*",
    function (request, response) {
        response.send(request.url);
    }
);

app.get(
    "/go+gle",
    function (request, response) {
        response.redirect("https://google.com");
    }
)

app.listen(3000);