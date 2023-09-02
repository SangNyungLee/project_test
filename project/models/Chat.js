const {DataTypes} = require('sequelize');

const Chat = (sequelize)=>{
    return sequelize.define('chatting',{
        userid:{
            type: DataTypes.STRING(255),
            allowNull : false,
        },
        chat:{
            type: DataTypes.STRING(255),
            allowNull : false,
        },   
    });
}
module.exports = Chat;