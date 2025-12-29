// src/models/entity/itemCart.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database.config';
import { Cart } from './cart.model';
import { Product } from './product.model';

interface ItemCartAttributes {
  item_id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price?: number;
}

interface ItemCartCreationAttributes
  extends Optional<ItemCartAttributes, 'item_id' | 'unit_price'> {}

export class ItemCart
  extends Model<ItemCartAttributes, ItemCartCreationAttributes>
  implements ItemCartAttributes
{
  public item_id!: number;
  public cart_id!: number;
  public product_id!: number;
  public quantity!: number;
  public unit_price?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ItemCart.init(
  {
    item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Carts', // nombre de la tabla
        key: 'cart_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'product_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'ItemCarts',
    timestamps: true,
  }
);

// Asociaciones (si no están en index.ts)
// Cart.hasMany(ItemCart, { foreignKey: 'cart_id', as: 'items' });
// ItemCart.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });

// Product.hasMany(ItemCart, { foreignKey: 'product_id', as: 'cart_items' });
// ItemCart.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
