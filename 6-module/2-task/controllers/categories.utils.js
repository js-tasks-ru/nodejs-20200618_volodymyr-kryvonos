const mapCategory = (category) => {
  return {
    id: category._id,
    title: category.title,
    subcategories: category.subcategories.map(mapSubcategory)
  };
};

const mapSubcategory = ({ _id, title }) => {
  return {
    id: _id,
    title
  };
};

module.exports = { mapCategory, mapSubcategory };
