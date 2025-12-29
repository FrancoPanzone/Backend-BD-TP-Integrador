// src/models/entity/category.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database.config'

interface CategoryAttributes {
  category_id: number;
  name: string;
  description: string;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'category_id'> {}

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes {
  public category_id!: number;
  public name!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    category_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Categories',
    timestamps: true,
  }
);
