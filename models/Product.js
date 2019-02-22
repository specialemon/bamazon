module.exports = function(connection, Sequelize) {
    const Product = connection.define("Product", {
        "product_name":{
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        "department_name": {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        "price": {
            type: Sequelize.FLOAT,
            allowNull: false,
            validate: {
                isFloat: true,
                notEmpty: true
            }
        },
        "stock_quantity": {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notEmpty: true
            }
        }
    });

    return Product;
}