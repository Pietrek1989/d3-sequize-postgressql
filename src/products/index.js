import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductModel from "./model.js";
import ProductsCategoriesModel from "./productCategoryModel.js";
import ReviewsModel from "./reviewsModel.js";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductModel.create(req.body);
    if (req.body.categories) {
      // ["de181145-f7d4-4c07-adf4-69dd01911ff0", "aaeb8a80-8a74-4917-a508-afaa3eea6787"] --> MAP --> [{blogId: blogId, categoryId:"de181145-f7d4-4c07-adf4-69dd01911ff0"}, {blogId: blogId, categoryId: "aaeb8a80-8a74-4917-a508-afaa3eea6787"}]
      await ProductsCategoriesModel.bulkCreate(
        req.body.categories.map((category) => {
          return { productId: id, categoryId: category };
        })
      );
    }
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const query = {};

    if (req.query.minPrice && req.query.maxPrice)
      query.price = { [Op.between]: [req.query.minPrice, req.query.maxPrice] };
    if (req.query.maxPrice && !req.query.minPrice)
      query.price = { [Op.between]: [0, req.query.maxPrice] };
    if (req.query.minPrice && !req.query.maxPrice)
      query.price = { [Op.between]: [req.query.minPrice, Infinity] };

    if (req.query.name) query.name = { [Op.iLike]: `%${req.query.name}%` };
    if (req.query.description)
      query.description = { [Op.iLike]: `%${req.query.description}%` };
    if (req.query.category)
      query.category = { [Op.iLike]: `${req.query.category}` };

    if (req.query.search) {
      query[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.search}%` } },
        { description: { [Op.iLike]: `%${req.query.search}%` } },
      ];
    }

    const limit = req.query.limit || 10;
    const offset = req.query.offset;

    const product = await ProductModel.findAndCountAll({
      where: { ...query },
      order: [["price", "ASC"]],
      limit,
      offset,
    });

    res.send({ total: product.count, offset, limit, products: product.rows });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const user = await ProductModel.findByPk(req.params.productId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.productId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductModel.update(
      req.body,
      { where: { id: req.params.productId }, returning: true }
    );
    if (updatedRecords) {
      res.send(updatedRecords);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.productId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductModel.destroy({
      where: { id: req.params.productId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.productId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.post("/productId/reviews", async (req, res, next) => {
  try {
    const { id } = await ReviewsModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId/experiences", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId, {
      include: {
        model: ExperienceModel,
        where: { title: { [Op.iLike]: "%react%" } },
      },
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId/posts", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId, {
      include: {
        model: BlogsModel,
        attributes: ["title"],
        where: { title: { [Op.iLike]: "%react%" } },
      },
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
