import { DataTypes } from "sequelize";
import CategoriesModel from "../category/model.js";
import sequelize from "../db.js";
import ProductsCategoriesModel from "./productCategoryModel.js";
import ReviewsModel from "./reviewsModel.js";

const ProductsModel = sequelize.define("product", {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

// ProductsModel.belongsToMany(CategoriesModel, {
//   through: ProductsCategoriesModel,
//   foreignKey: { name: "productId", allowNull: false },
// });
// CategoriesModel.belongsToMany(ProductsModel, {
//   through: ProductsCategoriesModel,
//   foreignKey: { name: "categoryId", allowNull: false },
// });

// ProductsModel.hasMany(ReviewsModel, {
//   foreignKey: { name: "productId", allowNull: false },
// });
// ReviewsModel.belongsTo(ProductsModel, {
//   foreignKey: { name: "productId", allowNull: false },
// });

export default ProductsModel;
