const express = require("express");
const app = express();
var cors = require("cors");
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;

// middleware for server
dotenv.config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
   res.send("Hello World!");
});

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});
