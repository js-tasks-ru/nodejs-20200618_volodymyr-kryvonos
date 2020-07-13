const Category = require('../models/Category');
const { mapCategory } = require('./categories.utils');

module.exports.categoryList = async function categoryList(ctx, next) {
  const allCategories = await Category.find({})
  const categories = allCategories.map(mapCategory);

  ctx.body = { categories };
};

