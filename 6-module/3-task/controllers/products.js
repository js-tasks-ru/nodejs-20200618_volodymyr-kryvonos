const Product = require('../models/Product');
const { mapProduct } = require('../../2-task/controllers/products.utils');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.request.query.query;

  if (query === undefined) return next();

  const matchedProducts = await Product.find({
    $text: { $search: query }
  });

  const products = matchedProducts.map(mapProduct);

  ctx.body = { products };
};

exports.productsList = async (ctx, next) => {
  const allProducts = await Product.find({});
  const products = allProducts.map(mapProduct);

  ctx.body = { products };
};
