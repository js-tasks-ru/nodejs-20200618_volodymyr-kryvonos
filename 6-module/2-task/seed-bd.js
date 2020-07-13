const connection = require('./libs/connection');
const Product = require('./models/Product');
const Category = require('./models/Category');

(async function () {
  await Product.deleteMany({});
  await Category.deleteMany({});

  const booksCategory = new Category(
    {
      title: 'Books',
      subcategories: [{
        title: 'Science fiction & Fantasy'
      }, {
        title: 'Arts & Music'
      }, {
        title: 'Biography'
      }, {
        title: 'Business'
      }, {
        title: 'History'
      }, {
        title: 'Cooking'
      }]
    }
  );
  await booksCategory.save();
  const sciFictionSubCategory = findSubcategoryByTitle(booksCategory, 'Science fiction & Fantasy');

  console.log('books category:', booksCategory);
  const harryPotterBook = new Product(
    {
      title: 'Harry Potter and Philosopher\'s stone',
      images: ['book-cover.jpg', 'back-cover.jpg'],
      category: booksCategory._id,
      subcategory: sciFictionSubCategory._id,
      price: 20,
      description: 'Featuring vivid descriptions and an imaginative story line, it followed the adventures of the unlikely hero Harry Potter, a lonely orphan who discovers that he is actually a wizard and enrolls in the Hogwarts School of Witchcraft and Wizardry.'
    }
  );

  await harryPotterBook.save();
  console.log('harryPotterBook', harryPotterBook);
  await connection.close();
})();

function findSubcategoryByTitle(category, title) {
  return category.subcategories.find(sub => sub.title === title);
}
