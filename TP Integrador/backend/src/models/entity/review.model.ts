// src/models/entity/review.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database.config';
import { User } from './user.model';
import { Product } from './product.model';

interface ReviewAttributes {
  review_id: number;
  user_id: number;
  product_id: number;
  qualification: number;
  comment: string;
  date: Date;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'review_id' | 'date'> {}

export class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes
{
  public review_id!: number;
  public user_id!: number;
  public product_id!: number;
  public qualification!: number;
  public comment!: string;
  public date!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Review.init(
  {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qualification: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Reviews',
    timestamps: true,
  },
);

// Relaciones opcionales para consultas con include
// Review.belongsTo(User, { foreignKey: 'user_id' });
// Review.belongsTo(Product, { foreignKey: 'product_id' });
