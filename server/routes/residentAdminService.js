var facade = require('../source/residentMapper');
var express = require('express');
var router = express.Router();


/*
 * request Handler
 * receives create request from client
 * */
router.post('/admin/createResident', function (request, response) {
    var newResident = request.body;

    facade.createResident(newResident, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "service unavailable";
            response.send({message: "No residents found"});
        } else {
            response.send(data);
        }
    });
});


module.exports = router;