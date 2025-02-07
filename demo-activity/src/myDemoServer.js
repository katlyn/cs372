const http = require('http');
const fs = require('fs/promises');
const url = require('url');
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017")
const db = client.db("myDemoDb")
const collection = db.collection("myDemoCollection")

http.createServer(async function (req, res) {
    const currentUrl = url.parse(req.url);
    const params = new URLSearchParams(currentUrl.search);

    const data = await fs.readFile("src/myDemoWebpage.html")

    let stringData = data.toString()

    if (params.has("name")) {
        const name = params.get("name").trim();
        if (name.length === 0) {
            stringData = stringData.replace("<!-- RESPONSE DATA HERE -->", `
                <p>Not inserting empty data!</p>
            `)
        } else {
            await collection.insertOne({ name })
            stringData = stringData.replace("<!-- RESPONSE DATA HERE -->", `
                <p>Successfully inserted ${name}!</p>
            `)
        }
        
    } else if (params.has("display")) {
        // TODO: Implment query from the database
        const nameObjects = await collection.find().toArray()
        const mappedNames = nameObjects.map(nameObject => `<li>${nameObject.name}</li>`)
        stringData = stringData.replace("<!-- RESPONSE DATA HERE -->", `
            <h2>Names in database</h2>
            <ul>
                ${mappedNames.join("")}
            </ul>
            `)
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(stringData);
    return res.end();
}).listen(6543);
