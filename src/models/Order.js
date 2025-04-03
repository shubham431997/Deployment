import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

class Order extends Model {}

const generateOrderId = () => {
    return `SF${Math.floor(100000 + Math.random() * 900000)}`; 
};

const generateInvoiceId = () => {
    return `${Math.floor(100000 + Math.random() * 900000)}`; 
};

Order.init(
    {
        id: {
            type: DataTypes.STRING, 
            defaultValue: generateOrderId, 
            primaryKey: true,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "PENDING",
            allowNull: false,
        },
        cartItems: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        deliveryFee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        grandTotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        payment_mode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        payment_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: User,
                key: "id",
            },
        },
        invoiceId: {
            type: DataTypes.STRING,
            defaultValue: generateInvoiceId,
            allowNull: false,
        }
    },
    {
        sequelize,
        paranoid: true,
    }
);

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

export default Order;
