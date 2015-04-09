// List dependencies
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Business = require('../models/business');

var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');

// Show a list of the businesses
router.get('/businesses', function (req, res, next) {

    // show the businesses using business model, if it doesn't work, show an error
    Business.find(function (err, businesses) {
        if (err) {
            res.render('error', { error: err });
        }
        else {
            res.render('businesses', { businesses: businesses });
            console.log(businesses);
        }
    });
});

// Get info from the business adding page to add a business
router.get('/businesses/add', function(req, res, next) {
    res.render('add');
});

// This section gets the id of the business for editing
router.get('/businesses/edit/:id', function (req, res, next) {
    var id = req.params.id;

    // find the id of the business  
    Business.findById(id, function (err, business) {
        if (err) {
            res.send('Business' + id + ' could not be found');
        }
        else {
            res.render('edit', { business: business });
        }
    });
});

// This section will be used to upload a picture in addition to the other thing necessary for the companies in the database
router.post('/businesses/add', function (req, res, next) {
    var form = new formidable.IncomingForm();
    
    form.parse(req, function (err, fields, files) {
// Make sure the picture was uploaded during testing        
//        res.writeHead(200, {'content-type': 'text/plain'});
//        res.write('received upload:\n\n');
//        res.end(util.inspect({fields: fields, files: files}));
    });

    var name;
    // read the info from the form and send it to the database
    form.on('field', function(name, value) {
        if (name == 'company') {
            company= value;
        }
    });
    form.on('field', function(name, value) {
        if (name == 'specialty') {
            specialty= value;
        }
    });
    form.on('field', function(name, value) {
        if (name == 'description') {
            description= value;
        }
    });
    form.on('field', function(name, value) {
        if (name == 'phonenumber') {
            phonenumber= value;
        }
    });
    
    form.on('end', function(fields, files) {
   
        var temp_path = this.openedFiles[0].path;
        
        var file_name = this.openedFiles[0].name;
        // Save the image in the public images
        var new_location = 'public/images/'; 
        console.log(new_location + file_name);
        
        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.log(err);
            }
            else {
                // Send the new business to the database
                Business.create({
                    filename: file_name,
                    company: company,
                    specialty: specialty,
                    description: description,
                    phonenumber: phonenumber
                }, function (err, Business) {
                    if (err) {
                        console.log(err);
                        res.render('error', { error: err });
                    }
                    else {
                        console.log('Business saved ' + Business);
                        res.statusCode = 302
                        res.setHeader('Location', 'http://' + req.headers['host'] + '/businesses');
                        res.end();
                    }
                });   
            }
        });
    });
});


// This section will be used when updating an existing business
router.post('/businesses/edit/:id', function (req, res, next) {
    var id = req.body.id;
    // Had trouble updating image so that was left out
    var business = {
        _id: req.body.id,
        company: req.body.company,
        specialty: req.body.specialty,
        description: req.body.description,
        phonenumber: req.body.phonenumber
    };
    // send updated info to the server
    Business.update({ _id: id}, business, function(err) {
        if (err) {
            res.send('Business ' + req.body.id + ' did not update. Error was: ' + err);
        }
        else {
            res.statusCode = 302;
            res.setHeader('Location', 'http://' + req.headers['host'] + '/businesses');
            res.end();
        }
    });
});



/* This was used in my first attempt at creating new businesses in the database
    it was saved in case the method for uploading images was unsucessful
router.post('/businesses/add', function (req, res, next) {

    // Use this section to add a new business
    Business.create({
        name: req.body.company,
        specialty: req.body.specialty,
        description: req.body.description,
        phonenumber: req.body.phonenumber
    }, function (err, Business) {
        if (err) {
            console.log(err);
            res.render('error', { error: err }) ;
        }
        else {
            console.log('Business saved ' + Business);
            res.render('added', { business: Business.title });
        }
    });
});
*/

// API for displaying all businesses
router.get('/api/businesses', function (req, res, next) {
    Business.find(function(err, businesses) {
        if (err) {
            res.send(err);
        } 
        else {
            res.send(businesses);
        }
    });
});

/* API for getting a single entry
router.get('/api/businesses/company=?', function (req, res, next) {
    
    Business.find(function(err, businesses) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(businesses);
        }
    });
});
*/
// This section will be sued to delete businesses
router.get('/businesses/delete/:id', function (req, res, next) {
    var id = req.params.id;

    //Delete using the model
    Business.remove({ _id: id }, function (err, business) {
        if (err) {
            res.send('Business ' + id + ' could not be found');
        }
        else {
            res.statusCode = 302;
            res.setHeader('Location', 'http://' + req.headers['host'] + '/businesses');
            res.end();
        }
    });
});
    


module.exports = router;