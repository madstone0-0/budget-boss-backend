import express from "express";

const cat = express.Router();

cat.get("/info", (req, res) => {
    /*
    #swagger.summary = 'Category info'
    */
    res.send("Categroy route");
});

export default cat;
