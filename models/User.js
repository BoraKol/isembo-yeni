const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum:["student" ,"teacher" ,"admin"], // string tipindeki rolun alabileceği değerleri verdik
    default: "student"
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],  
  
  canUploadFiles: {
    type: Boolean,
    default: true, 
  },
  
});

// kullanıcının şifresini veritabanındaki user modelinde gizlemek için middleware kullanıyoruz.
// UserSchema.pre('save', function(next){
//   const user = this; //this sayesinde hangi kullanıcı giriyorsa onu yakalıyoruz.

//   // parametrelerden 10 sabit bir değer , şifrenin ne kadar karmaşık olarak şifrelendiğiyle alakalı
//   bcrypt.hash(user.password, 10, (error,hash) => {
//     user.password=hash; 
//     next();
//   })
// });

UserSchema.pre('save', function(next) { // Bu kod , user'da herhangi bir değişiklik yapılmamışsa şifremizi tekrardan hash(şifreleme) işlemi yapmasını önlüyor
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) { 
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);
          user.password = hash;
          next();
      });
  });
});


const User = mongoose.model('User', UserSchema);
module.exports = User;