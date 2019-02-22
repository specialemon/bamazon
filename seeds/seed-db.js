const db = require("../models");

const items = [
    {
        "product_name" : "Doraemon Plushie",
        "department_name" : "Toy",
        "price" : 49.99,
        "stock_quantity" : 100
    },
    {
        "product_name" : "Eyephone 10",
        "department_name" : "Electronics",
        "price" : 899.99,
        "stock_quantity" : 100
    },
    {
        "product_name" : "McBook Pro",
        "department_name" : "Electronics",
        "price" : 2399.99,
        "stock_quantity" : 100
    },
    {
        "product_name" : "Kendric Lmao CD",
        "department_name" : "Music",
        "price" : 39.99,
        "stock_quantity" : 200
    },
    {
        "product_name" : "Lamb O' Guinea",
        "department_name" : "Pet",
        "price" : 4599.99,
        "stock_quantity" : 20
    },
    {
        "product_name" : "Enigma of Hit Point",
        "department_name" : "Video Game",
        "price" : 59.99,
        "stock_quantity" : 100
    },
    {
        "product_name" : "Tony the Tiger Action Figure",
        "department_name" : "Toy",
        "price" : 29.99,
        "stock_quantity" : 100
    },
    {
        "product_name" : "Magic Lamp",
        "department_name" : "Sorcery",
        "price" : 9999.99,
        "stock_quantity" : 5
    },
    {
        "product_name" : "Flying Car Pet",
        "department_name" : "Pet",
        "price" : 399.99,
        "stock_quantity" : 50
    },
    {
        "product_name" : "Bondfire",
        "department_name" : "Sorcery",
        "price" : 6599.99,
        "stock_quantity" : 10
    }
];


db.sequelize.sync({ force: true}).then(function(){
    db.Product.bulkCreate(items)
        .then(function(rows){
            console.log(`\n\nINSERTED into database\n\n`);
            db.sequelize.close();
        }).catch(function(err){
            console.log({ err: err});
        });
});