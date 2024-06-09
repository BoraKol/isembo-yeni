const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');


// const multer = require('multer');
const path = require('path');
const fs = require('fs');

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name : req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID // hangi kursu hangi öğretmenin oluşturduğunu userID sayesinde belirlemiş oluyoruz
    });

    req.flash("success" , `${course.name} ilanı başarıyla eklendi`);
    res.status(201).redirect('/courses');
  } catch (error) {
    req.flash("error" , "Bir şeyler ters gitti!");
    res.status(400).redirect('/courses');
  }
};

exports.getAllCourses = async (req, res) => {
  try {

    const categorySlug = req.query.categories;
    const query = req.query.search;

    const category = await Category.findOne({slug:categorySlug})

    let filter = {};

    if(categorySlug) {
      filter = {category:category._id}
    }
    
    if(query) { // search alanı için düzenlemeler bu satırdan sonra yapıldı.
      filter = {name:query};
    }

    if(!query && !categorySlug) {
      filter.name = "",
      filter.category= null
    }

    const courses = await Course.find({
      $or: [
        {name: { $regex: '.*' + filter.name + '.*', $options:'i'}} , //  options : i ile case insensitive özelliği eklendi(BÜYÜK KÜÇÜK HARFA DUYARLILIK KALDIRILMIŞ OLDU)
        {category:filter.category}
      ]
    }).sort('-createdAt').populate('user');

    const categories = await Category.find();

    res.status(200).render('courses', {
      courses,
      categories,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({slug: req.params.slug}).populate('user');

    const categorySlug = req.query.categories;

    const category = await Category.findOne({slug: categorySlug});

    let filter={};

    if(categorySlug) {
      filter= {category: category._id};
    }

    const categories = await Category.find();

    res.status(200).render('course', {
      course,
      categories,
      page_name: 'courses',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.enrollCourse = async (req,res) => {
  try{

    const user = await User.findById(req.session.userID);
    await user.courses.push({_id:req.body.course_id}); // push yerine addToSet kullanmabilirdik bu sayede öğrenci aynı kursa kaydolamıyor ve push fonksiyonundaki mantık hatası ortadan kalkıyor yani courses array'e aynı kurs eklenemiyor. Ancak bu hata ileride çözüldüğü için push veya addToSet kullanabiliriz. 
    await user.save();

    res.redirect('/users/dashboard');

  } catch(error) {
    res.status(400).json({
      status: 'fail',
      error
    })
  }
}

exports.releaseCourse = async(req,res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({_id: req.body.course_id});
    await user.save();

    res.status(200).redirect('/users/dashboard');

  } catch(error) {
     res.status(400).json({
      status: 'fail',
      error,
     })
  };

}

exports.deleteCourse = async(req,res) => {
  try{

    const course = await Course.findOneAndDelete({slug:req.params.slug});

    req.flash('error' , `${course.name} ilanı başarıyla kaldırıldı`);

    res.status(200).redirect('/users/dashboard');

  } catch(error){
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.updateCourse = async(req,res) => {

  try{

    const course = await Course.findOne({slug:req.params.slug});

    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;

    course.save();

    res.status(200).redirect('/users/dashboard');

  } catch(error){
    res.status(400).json({
      status: 'fail',
      error,
    })
  }

};

exports.uploadFile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).send('Only JPEG and PNG files are allowed.');
    }

    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxFileSize) {
      return res.status(400).send('File size should not exceed 10 MB.');
    }

    const tempFilePath = path.join(__dirname, 'uploads', file.originalname);
    const writeStream = fs.createWriteStream(tempFilePath);
    writeStream.write(file.buffer);
    writeStream.end();

    // Do something with the uploaded file, such as saving it to a database or a file system.
    // For example, you can save it to a cloud storage service like AWS S3 or Google Cloud Storage.

    res.send('File uploaded successfully.');
    res.status(200).redirect('/users/inbox');
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error.');
  }
}



