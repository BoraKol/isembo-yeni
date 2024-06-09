const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const pageRoute= require('./routes/pageRoute');
const courseRoute= require('./routes/courseRoute');
const categoryRoute= require('./routes/categoryRoute');
const userRoute= require('./routes/userRoute');

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
// const singleFileUpload=require('./singleFileUpload')
const multer = require('multer');
const fs = require('fs');

const app = express();

const Course = require('./models/Course');
const User = require('./models/User');

const router = express.Router();

//Connect DB
mongoose.connect('mongodb://localhost/smartedu-db' , {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('DB connected successfully');
});

//Template engine
app.set('view engine',"ejs");


// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cors());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads')
//   },
//   filename: function(req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix + "-" + file.originalname)
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = ['image/jpeg', 'image/png'];
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true)
//   } else {
//     return cb(new Error('Only JPEG and PNG files are allowed.'), false);
//   }
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter }).single("file");

// app.post("/fileUpload", upload, async (req, res) => {
//   try {
//     const file = req.file;

//     if (!file) {
//       return res.status(400).send('No file uploaded.');
//     }

//     const maxFileSize = 10 * 1024 * 1024; // 10 MB
//     if (file.size > maxFileSize) {
//       return res.status(400).send('File size should not exceed 10 MB.');
//     }

//     const tempFilePath = path.join(__dirname, 'temp', file.originalname);
//     const writeStream = fs.createWriteStream(tempFilePath);
//     writeStream.write(file.buffer);
//     writeStream.end();

//     // Do something with the uploaded file, such as saving it to a database or a file system.
//     // For example, you can save it to a cloud storage service like AWS S3 or Google Cloud Storage.

//     res.send('File uploaded successfully.');
//     res.status(200).redirect('/dashboard');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal server error.');
//   }
// });





//GLOBAL VARIABLE

global.userIN= null;

//Middlewares
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(
  session({
  secret: 'my_keyboard_cat', // Buradaki texti değiştireceğiz.
  resave: false, // herhangi bir değişiklik olmasa da session'u kaydetmeyi zorunlu kılar 
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost/smartedu-db' }),
  })
  );

app.use(flash());
app.use((req,res,next) => {
  res.locals.flashMessages= req.flash();
  next();
})

app.use(methodOverride('_method', {
  methods:['POST','GET'],
})
);

const port = 3000;

//Routes
app.use('*' , (req,res,next)=> {
  userIN = req.session.userID;
  next();
});
app.use('/' , pageRoute);
app.use('/courses' , courseRoute);
app.use('/categories' , categoryRoute);
app.use('/users' ,userRoute);
app.use('/inbox' , courseRoute);

app.use("/.netlify/functions/app", router);

// app.render('/routes/pageRoute.js'  , (err,html)=>{
//   if(err) throw err;

//   fs.writeFileSync(path.join(__dirname , 'public/index.html') ,html);
// })

app.get('/' , async(req,res)=>{

  const courses = await Course.find().sort('-createdAt').limit(2); // limit 2 sayesinde en son oluşturulmuş 2 kursu çağırmış olduk
  const totalCourses = await Course.find().countDocuments();
  const totalStudents = await User.find().countDocuments({role: 'student'});
  const totalTeachers = await User.find().countDocuments({role:'teacher'});


  res.render('index' , {
    page_name: 'index',
    courses,
    totalCourses,
    totalStudents,
    totalTeachers
  });
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

module.exports.handler = serverless(app);
