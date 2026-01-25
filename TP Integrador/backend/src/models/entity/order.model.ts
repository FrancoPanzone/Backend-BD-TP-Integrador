// src/models/entity/order.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database.config';
import { OrderDetail } from './orderDetail.model';

// status usa un ENUM.
// total se calcula automáticamente si hay details.
// Se deja la relación opcional con OrderDetail para poder hacer include en queries.

export type OrderStatus = 'pending' | 'paid' | 'cancel';

interface OrderAttributes {
  order_id: number;
  user_id: number;
  status: OrderStatus;
  total: number;
  order_date: Date;
}

// interface OrderCreationAttributes
//   extends Optional<OrderAttributes, 'order_id' | 'total' | 'order_date'> {}

interface OrderCreationAttributes
  extends Optional<OrderAttributes, 'order_id' | 'total' | 'order_date'> {
  details?: {
    product_id: number;
    quantity: number;
    unit_price: number;
  }[];
}

export class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public order_id!: number;
  public user_id!: number;
  public status!: OrderStatus;
  public total!: number;
  public order_date!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Relaciones
  public details?: OrderDetail[];
}

Order.init(
  {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'cancel'),
      allowNull: false,
      defaultValue: 'pending',
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Orders',
    timestamps: true,
    // como el subtotal depende del hook de orderDetail mejor hacer esto en el repo de Order
    // hooks: {
    //   beforeCreate: (order) => {
    //     if (!order.total && order.details) {
    //       order.total = order.details.reduce((sum, d) => sum + d.subtotal, 0);
    //     }
    //   },
    //   beforeUpdate: (order) => {
    //     if (order.details) {
    //       order.total = order.details.reduce((sum, d) => sum + d.subtotal, 0);
    //     }
    //   },
    // },
  },
);
