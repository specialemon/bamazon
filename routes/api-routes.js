const db = require("../models");

module.exports = function (app) {


    //get all merch
    app.get("/api/merch", function (req, res) {
        db.Product.findAll().then(function (data) {
            res.json(data);
        }).catch(function (err) {
            res.json({ err: err });
        });
    });

    //get merch by id
    app.get("/api/merch/:id", function (req, res) {
        db.Product.findOne({
            where: {
                id: req.params.id
            }
        }).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            res.json({ err: err });
        });
    })

    //get all merch of a department
    app.get("/api/:dept", function (req, res) {
        db.Product.findAll({
            where: {
                department_name: req.params.dept
            }
        }).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            res.json({ err: err });
        });
    });

    //update specific item
    app.put("/api/merch/:id", function (req, res) {
        db.Product.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(function () {
            res.json({ msg: "successfully updated item" })
        }).catch(function (err) {
            res.json({ err: err });
        });
    });


}