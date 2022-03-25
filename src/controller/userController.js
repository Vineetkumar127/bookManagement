const userModel = require("../models/userModel")



const createUser = async function(req,res){
  
 const data = req.body

 const savedData = await userModel.create(data)

 return res.status(201).send({status:true, userData: savedData})

}

module.exports.createUser = createUser