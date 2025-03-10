import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Holiday extends Model {}

Holiday.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
    },
    occasion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    paranoid: true
  }
);

export default Holiday;
