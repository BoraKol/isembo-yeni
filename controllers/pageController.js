const nodemailer = require('nodemailer');
// const translate = require('translate');

const Course = require('../models/Course');
const User = require('../models/User');

// exports.getIndexPage = async (req, res) => {

//   // console.log(req.session.userID);

//   const courses = await Course.find().sort('-createdAt').limit(2); // limit 2 sayesinde en son oluşturulmuş 2 kursu çağırmış olduk
//   const totalCourses = await Course.find().countDocuments();
//   const totalStudents = await User.countDocuments({role:'student'});
//   const totalTeachers = await User.countDocuments({role:'teacher'});

//   res.status(200).render('index', {
//     page_name: 'index',
//     courses,
//     totalCourses,
//     totalStudents,
//     totalTeachers,
//   });
// };
exports.getAboutPage = (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  });
};
exports.getRegisterPage = (req, res) => {
  res.status(200).render('register', {
    page_name: 'register',
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
  });
};

exports.getContactPage = async(req,res)=> {
  const users = await User.find();
  const currentUser= await User.findOne({_id: req.session.userID});
  res.status(200).render('contact', {
    page_name: 'contact',
    users,
    currentUser,
  })
}


exports.sendEmail = async (req,res) => {

  try{

  const { name , email , message } = req.body;

  if(!name || !email || !message) {
    req.flash('error', "All fields are required to fill");
    return res.status(400).redirect('contact');
  }

  const outputMessage = `
  
  <h1>Mail Details</h1>
  <ul>
  
    <li>Name: ${name}</li>
    <li>Email: ${email}</li>
  </ul>
  <h1>Message</h1>
  <p> ${message}</p>
  `

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'noname2person@gmail.com', // gmail account
      pass: 'xivy xogj cbby foyy', // gmail pass
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"ISEMBO" <noname2person@gmail.com>', // sender address
    to: '<noname1person@gmail.com>', // list of receivers
    subject: 'ISEMBO Contact Form New Message', // Subject line
    html: outputMessage, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  req.flash("success" , "We have received your message successfully!");

  res.status(200).redirect('contact');

}catch(error) {
  req.flash("error" , `Something went wrong ${error}`);
  res.status(200).redirect('contact');
}
  
}

// exports.translateString= async function translateString(str , translateTo) {
//   translate.engine='libre';
//   const translated_string = await translate(str,translateTo);
//   console.log(translated_string);

// }

// exports.sendMessage = async (req, res) => {
//   try {
//     const recipientId = req.body.recipientId;
//     const messageData = req.body.text;

//     if (!messageData || !recipientId) {
//       return res.status(400).json({ error: 'Invalid request body' });
//     }

//     const recipient = await User.findById(recipientId);
//     if (!recipient) {
//       return res.status(404).json({ error: 'Recipient not found' });
//     }

//     const sender = await User.findById(req.session.userID);
//     if (!sender) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     // Create a new message instance
//     const newMessage = new Message({
//       text: messageData,
//       sender: req.session.userID,
//       recipient: recipientId,
//     });

//     // Save the message to the database
//     await newMessage.save();

//     res.json({ message: 'Message sent successfully' });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Server error' });
// };
// }


// exports.sendMessage = async (req, res) => {
//   try {
//     const recipientId = req.body.recipientId;
//     const messageData = req.body.text;

//     if (!messageData || !recipientId) {
//       return res.status(400).json({ error: 'Invalid request body' });
//     }

//     const recipient = await User.findById(recipientId);
//     if (!recipient) {
//       return res.status(404).json({ error: 'Recipient not found' });
//     }

//     const sender = await User.findById(req.session.userID);
//     if (!sender) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     // Create a new message instance
//     const newMessage = new Message({
//       text: messageData,
//       sender: req.session.userID,
//       recipient: recipientId,
//     });

//     // Save the message to the database
//     await newMessage.save();

//     res.json({ message: 'Message sent successfully' });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// }



// exports.sendGroupMessage = async (req, res) => {
//   try {
//     const groupId = req.body.groupId;
//     const messageData = req.body.text;

//     if (!messageData || !groupId) {
//       return res.status(400).json({ error: 'Invalid request body' });
//     }

//     const group = await Group.findById(groupId);
//     if (!group) {
//       return res.status(404).json({ error: 'Group not found' });
//     }

//     const sender = await User.findById(req.session.userID);
//     if (!sender) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     // Create a new message instance
//     const newMessage = new Message({
//       text: messageData,
//       sender: req.session.userID,
//       group: groupId,
//     });

//     // Save the message to the database
//     await newMessage.save();

//     res.json({ message: 'Message sent successfully' });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// }

// exports.getMessages = async (req, res) => {
//   try {
//     const filter = req.query.filter || '';
//     const sort = req.query.sort || '-createdAt';
//     const limit = parseInt(req.query.limit) || 10;

//     let query = {};

//     if (filter === 'inbox') {
//       query.recipient = req.session.userID;
//     } else if (filter === 'sent') {
//       query.sender = req.session.userID;
//     } else if (filter === 'group') {
//       query.group = { $exists: true };
//     }

//     const messages = await Message.find(query)
//       .populate('sender', 'name')
//       .populate('recipient', 'name')
//       .populate('group', 'name')
//       .sort(sort)
//       .limit(limit);

//     res.json({ messages: messages });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// }




