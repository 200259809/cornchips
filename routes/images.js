var express = require('express');
var router = express.Router();


router.get('/business/add', function (req, res, next) {
    res.render('/business/add');
});

module.exports = router;

