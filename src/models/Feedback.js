import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

class Feedback extends Model {}

Feedback.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    accountDeletionReason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true, 
  }
);

User.hasMany(Feedback, { foreignKey: 'userId', onDelete: 'CASCADE' });
Feedback.belongsTo(User, { foreignKey: 'userId' });

export default Feedback;
