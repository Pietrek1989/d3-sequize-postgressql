import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ReviewsModel = sequelize.define("category", {
  reviewId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  content: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
});

export default ReviewsModel;
