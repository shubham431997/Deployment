import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const DeviceToken = sequelize.define("DeviceToken", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

User.hasMany(DeviceToken, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
DeviceToken.belongsTo(User, {
  foreignKey: "userId",
});

export default DeviceToken;
