// src/models/entity/user.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database.config';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

interface UserAttributes {
  user_id: number;
  name: string;
  email: string;
  password: string;
  address?: string;
  role: UserRole;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'user_id' | 'address' | 'role'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public address?: string;
  public role!: UserRole;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'USER'),
      allowNull: false,
      defaultValue: UserRole.USER,
    },
  },
  {
    sequelize,
    tableName: 'Users',
    timestamps: true,
  }
);
