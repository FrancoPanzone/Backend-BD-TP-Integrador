// src/models/entity/orderDetail.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database.config';
// import { Product } from './product.model';
// import { Order } from './order.model';

interface OrderDetailAttributes {
  order_detail_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface OrderDetailCreationAttributes
  extends Optional<OrderDetailAttributes, 'order_detail_id' | 'subtotal'> {}

export class OrderDetail
  extends Model<OrderDetailAttributes, OrderDetailCreationAttributes>
  implements OrderDetailAttributes
{
  public order_detail_id!: number;
  public order_id!: number;
  public product_id!: number;
  public quantity!: number;
  public unit_price!: number;
  public subtotal!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderDetail.init(
  {
    order_detail_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'OrderDetails',
    timestamps: true,
    // Sequelize ejecutará automáticamente los hooks (beforeCreate, beforeUpdate) para calcular subtotal.
    hooks: {
      beforeCreate: (orderDetail) => {
        orderDetail.subtotal = parseFloat(orderDetail.unit_price.toString()) * orderDetail.quantity;
      },
      beforeUpdate: (orderDetail) => {
        orderDetail.subtotal = parseFloat(orderDetail.unit_price.toString()) * orderDetail.quantity;
      },
    },
  }
);
