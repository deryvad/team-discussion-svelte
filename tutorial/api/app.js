const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const publicapi = require("./routes/public");

let app = express();
app.use(cors({origin: true}));
app.disable("x-powered-by");
app.use(bodyParser.json());

app.use(`/api/public`, publicapi);

app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message });
});

module.exports = app;