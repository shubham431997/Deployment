import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from 'uuid';

class User extends Model{} 

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        sequelize,
        paranoid: true  
    }
)


export default User;