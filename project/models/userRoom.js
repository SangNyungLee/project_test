const {DataTypes} = require('sequelize');

const userRoom = (sequelize)=>{

    return sequelize.define('userRoom',{
        userid:{
            type: DataTypes.STRING(255),
            allowNull : false,
        },
        roomList:{
            type: DataTypes.STRING(255),
            allowNull : false,
        }
    })
}

module.exports = userRoom;