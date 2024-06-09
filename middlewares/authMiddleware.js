const User = require('../models/User');

module.exports = async (req, res, next) => { 
    const user = await User.findById(req.session.userID);
     if (!user) {
         res.redirect('/');
         next(); 
     }else { 
      next(); 
    } 
};
