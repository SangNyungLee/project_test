const {DataTypes} = require('sequelize');

const Model = (sequelize)=>{
    return sequelize.define('userinfo',{
        id:{
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        userid:{
            type: DataTypes.STRING(30),
            allowNull : false,
        },
        pw:{
            type: DataTypes.STRING(255),
            allowNull : false,
        },
        name:{
            type : DataTypes.STRING(30),
            allowNull : false,
        },
    });
};

module.exports = Model;
