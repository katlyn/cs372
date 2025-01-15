import express from "express"
import * as path from "node:path";

console.log("This is a server!")

const app = express()
app.use(express.static(path.resolve(import.meta.dirname, "../02")))

const listener = app.listen(3000, () => {
  const { port } = listener.address()
  console.log(`Listening on http://localhost:${port}/`)
})
