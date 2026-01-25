// src/models/entity/cart.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database.config';
import { ItemCart } from './itemCart.model';
import { User } from './user.model';

interface CartAttributes {
  cart_id: number;
  user_id: number;
}

interface CartCreationAttributes extends Optional<CartAttributes, 'cart_id'> {}

export class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public cart_id!: number;
  public user_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cart.init(
  {
    cart_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // 1 carrito por usuario
      references: {
        model: User,
        key: 'user_id', // coincide con la primary key de User
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'Carts',
    timestamps: true,
  },
);
