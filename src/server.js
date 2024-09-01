import express from "express";
import viewEngine from "./configs/viewEngine";
import connectDB from "./configs/connectDB";
import bodyParser from "body-parser";
import initWebRoute from "./route/web";
import cors from 'cors';
require('dotenv').config();

let app = express();

app.use(cors({ credentials: true, origin: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
viewEngine(app);
initWebRoute(app);
connectDB();
let port = process.env.PORT || 4040;
app.listen(port, () => {
    console.log("Projec is running on port http://localhost:" + port)
});
