const mongoose = require('mongoose');
const Product = require('../models/Product');
const { mapProduct } = require('./products.utils');

exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.request.query;

  if (subcategory === undefined) {
    return next();
  }

  const isSubcategoryIdValid = mongoose.Types.ObjectId.isValid(subcategory);
  let matchedProducts = isSubcategoryIdValid
    ? await Product.find({ subcategory })
    : [];

  const products = matchedProducts.map(mapProduct);

  ctx.body = { products };
};

exports.productList = async function productList(ctx, next) {
  const matchedProducts = await Product.find({});
  const products = matchedProducts.map(mapProduct);

  ctx.body = { products };
};

exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;
  
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    ctx.throw(400, 'Specified invalid product identifier');
  }
  const matchedProduct = await Product.findById(productId);

  if (!matchedProduct) {
    ctx.throw(404, 'There is no product with specified id');
  }

  ctx.body = {
    product: mapProduct(matchedProduct)    
  };
};

