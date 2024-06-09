const Category = require('../models/Category');
const Course = require('../models/Course');

exports.createCategory = async(req,res) => {
    try {
        const category = await Category.create(req.body);

        req.flash('success', "Category added successfully!");

        res.status(200).redirect('/users/dashboard');

    } catch(error) {
        res.status(400).json({
            status:'fail',
            error,
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {    
  
      await Category.findByIdAndDelete(req.params.id);
    
      res.status(200).redirect('/users/dashboard');
  
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
};

exports.updateCategory = async (req, res) => {

  try{

  const category = await Category.findOne({slug:req.params.slug});

  category.name = req.body.name;

  category.save();

  req.flash('success', "Category updated successfully");

  res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error
    })
  }

}