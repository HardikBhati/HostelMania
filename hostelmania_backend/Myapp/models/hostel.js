var mongoose=require("mongoose");
var hostelSchema= new mongoose.Schema({
    name:String,
    price:String,
    place:String,
    description:String,
    image:String,
    author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
  },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"comment"
        }
    ]
});
module.exports=mongoose.model("hostel", hostelSchema)