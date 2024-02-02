const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a person name"]
        },
        email: {
            type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true,
            default: 0,
            trim:true,
            unique:1
        },

        order_id: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }],

        password:{
            type:String,
           // required: true,
            minlength:8
        },
        
    
   
       
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', UserSchema);

module.exports = User;

