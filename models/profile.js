const {Schema,model}=require("mongoose");

const profileSchema=new Schema({
    user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true       // ensures one profile per user
  },
    phonenumber:{
        type:String,
        unique:true,
    },
    uploadImage:{
        type:String,
    }
},{
    timestamps:true,
    
});

const Profile=model("profile",profileSchema);

module.exports=Profile;