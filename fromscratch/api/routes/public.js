let express = require('express');
let router = express.Router();

let users = require("../users.json");

function sendResponse(res){
    setTimeout(()=>{
        res.status(200).send(users);
    }, 1000);
}
router.get("/user", (req, res) => {
    sendResponse(res);
});

router.post("/user", (req, res) => {
    users.unshift(req.body);    
    sendResponse(res);
});

router.delete("/user/:peoplekey", (req, res) => {
    let peoplekey = req.params.peoplekey;
    users = users.filter(user => user.peoplekey != peoplekey);    
    sendResponse(res);
});

module.exports = router;