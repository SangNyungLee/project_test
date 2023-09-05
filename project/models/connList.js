const { DataTypes } = require("sequelize");

const connectList = (sequelize) => {
  const connectList = sequelize.define("connectList", {
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });
  return connectList;
};
module.exports = connectList;
