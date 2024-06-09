const  User  = require('../models/User'); // assuming your User model is in a separate file

module.exports = () => {
  return async(req, res, next) =>{
  const user = await User.findById(req.session.userID); // assuming you have a middleware that sets req.user to the current user
  const canUploadFiles = req.body.canUploadFiles;

  if (!user) {
    return res.status(401).send('You must be logged in to perform this action');
  }

  
  if (canUploadFiles) {
    next();
  } else {
    return res.status(401).send('You do not have permission to perform this action');
  }
}
};

