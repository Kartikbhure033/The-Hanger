const {Schema,model}=require("mongoose");
const bcrypt = require('bcrypt');
const {createTokenForUser}=require("../services/authentication")

const UserSchema=new Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
      role: {
       type: String,
       enum: ['user', 'admin'], // or any roles you define
       default: 'user'
    },
    createdAt: {
       type: Date,
       default: Date.now
  }

});

UserSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    const salt=10;
    this.password=await bcrypt.hash(this.password,salt);

    next();
});

UserSchema.statics.matchedpasswordandGenerateToken=async function(email,password){
    const user=await this.findOne({email});
    if(!user)throw new Error("user not found");

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch)throw new Error("passord is InCorrect");

    const token=createTokenForUser(user);
    return token;
}

const User=model("user",UserSchema);

module.exports=User;
