import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import Category from './Category.js';

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    inStock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    weightNprice: {
      type: DataTypes.JSON,
      allowNull: false, 
      defaultValue: [],
    },
    wishlist: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, 
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: Category,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    paranoid: true,
  }
);

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

export default Product;
