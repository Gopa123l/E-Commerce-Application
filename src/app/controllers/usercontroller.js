const User = require('../models/users');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersPerPage= 5;
const SECRET_KEY= "API";

// Create a new user
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a user' });
  }
};


//Sign up for users with token
const signup = async (req, res) =>{

  const {name, email, password} = req.body;
  try {

      const existingUser = await User.findOne({ email : email});
      if(existingUser){
          return res.status(400).json({message: "User already exists"});
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await User.create({
          name: name,
          email: email,
          password: hashedPassword
      });

      const token = jwt.sign({email : result.email, id : result._id }, SECRET_KEY);
      res.status(201).json({user: result, token: token});
      
  } catch (error) {
      console.log(error);
      res.status(500).json({message: "Something went wrong"});
  }

}

//Sign in for users with token

const signin = async (req, res)=>{
    
  const {email, password} = req.body;

  try {
      
      const existingUser = await User.findOne({ email : email});
      if(!existingUser){
          return res.status(404).json({message: "User not found"});
      }

      const matchPassword = await bcrypt.compare(password, existingUser.password);

      if(!matchPassword){
          return res.status(400).json({message : "Invalid Credentials"});
      }

      const token = jwt.sign({email : existingUser.email, id : existingUser._id }, SECRET_KEY);
      res.status(200).json({user: existingUser, token: token});


  } catch (error) {
      console.log(error);
      res.status(500).json({message: "Something went wrong"});
  }

}



// Get all users with order_id populated
const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  try {
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const users = await User.find().populate({path:'order_id', populate:[{path:'product_id',category:'-__v -_id'}]})
    .skip((page - 1) * usersPerPage)
    .limit(usersPerPage);
    res.json(
      {users,
      currentPage:page,
      totalPages});
    //res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
    console.log("error",error)
  }
};


// Get a user by ID
const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve the user' });
    }
  };
  
  // Update a user by ID
  const updateUserById = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update the user' });
    }
  };
  
  //Update User By Order Id
  const UpdateUserBYOrderId = async (req, res) => {
    try {
      const userId = req.params.id
      const user = await User.findById(userId)

      const newOrderId = [...user.order_id,...req.body.order_id]
      user.order_id= newOrderId
      await user.save();
      const test = await user.populate("order_id")
      res.status(201).json(test);
      //res.status(201)
    } catch (error) {
      console.log('error',error);
      res.status(500).json({ error: 'Failed to create an order' });
    }
  };


  
  // Delete a user by ID
  const deleteUserById = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete the user' });
    }
  };

//Product with maximum number of sales by a user



module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  UpdateUserBYOrderId,
  signup,
  signin
};






