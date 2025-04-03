import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Deal extends Model {}

Deal.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,  
    allowNull: true,
  },
  productIds: {
    type: DataTypes.JSON, 
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Deal',
});

export default Deal;
