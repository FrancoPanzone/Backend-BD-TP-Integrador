// src/models/entity/product.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database.config';
import { Category } from './category.model';

interface ProductAttributes {
  product_id: number;
  name: string;
  price: number;
  image: string;
  category_id: number;
  stock: number;
  rating: number;
  brand: string;
  description: string;
}

interface ProductCreationAttributes
  extends Optional<ProductAttributes, 'product_id' | 'rating' | 'image'> {}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public product_id!: number;
  public name!: string;
  public price!: number;
  public image!: string;
  public category_id!: number;
  public stock!: number;
  public rating!: number;
  public brand!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '/images/products/product-placeholder.webp',
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      defaultValue: 0,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Products',
    timestamps: true,
  },
);
