const userModel = require('../models/userModel')
const bookModel = require('../models/bookModel')
const mongoose = require('mongoose')
// const { response } = require('express')
// const { findById } = require('../models/userModel')
const ObjectId = require("mongoose").Types.ObjectId;

const isValid = function (value) {
    if (typeof value == undefined || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}
const isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length>0 
}
const isValidDate = (date) => {
    const specificDate =new Date(date).setHours(0,0,0,0);
    const today = new Date().setHours(0,0,0,0);
    return specificDate<today;
}

const createBook = async function(req, res){
    try{
        const data = req.body
        const query = req.query

        const {title,excerpt,userId,ISBN,category,subcategory,reviews,releasedAt} = data


    if(isValidRequestBody(query)){return res.status(400).send({status:false,error:'this is not allowed'})}
    if(!isValidRequestBody(data)){return res.status(400).send({status:false, error:'please insert valid data'})}
    
    

    // vaidations for data
    if(!isValidDate(releasedAt)){return res.status(400).send({status:false,error:'released is required'})}
    if(!isValid(title)){return res.status(400).send({status:false,error:'title is required'})}
    if(!isValid(excerpt)){return res.status(400).send({status:false,error:'excerpt is reuired'})}
    if(!isValid(userId)){return res.status(400).send({status:false,error:'userId is required'})}
    if(!isValid(ISBN)){return res.status(400).send({status:false,error:'ISBN is required'})}
    if(!isValid(category)){return res.status(400).send({status:false,error:'category is required'})}
    if(!isValid(subcategory)){return res.status(400).send({status:false,error:'subcategory is required'})}
    // if(!isValid(releasedAt)){return res.status(400).send({status:false,error:'releasedAt is required'})}
    

    if (!(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt))) {
        return res.status(400).send({ status: false, message: 'not invalid format, please enter date in YYYY-MM-DD format' })
        
    }

    // for dublicate data

    const duplicateTitle = await bookModel.findOne({title})
    if(duplicateTitle){res.status(400).send({error:'this title already exist'})}
    
    const duplicateISBN = await bookModel.findOne({ISBN})
    if(duplicateISBN){res.status(400).send({error:'ISBN already exist'})}



    const bookBody = {
        title,
        excerpt,
        userId,
        ISBN,
        category,
        subcategory,
        reviews,
        releasedAt
    };
    let savedBook = await bookModel.create(bookBody)
    res.status(201).send({status:true,data:savedBook})

    }
    catch(err){return res.status(500).send({status:false, error : err.message})}
}


const getBook = async function(req,res){
    try{
        const data = req.body
        const query = req.query
        const filter ={isDeleted:false}
        if(isValidRequestBody(data)){return res.status(400).send({status:false,error:'this is not allowed'})}
        if(!isValidRequestBody(query)){return res.status(400).send({status:false,error:'please provide query'})}

        if(isValidRequestBody(query)){
        const{userId,category,subcategory} = query

        // if(!userId){return res.status(400).send({status:false.valueOf,error:'invalid user id'})}
        // if(isValid(userId)){
            const userid = await userModel.findOne({_id:query.userId})
            if(ObjectId.length(userid)===0){return res.status(400).send({status:false.valueOf,error:'user doe not exist'})}
            // if(userid){filter['userId']=userId}
            
        // }
        

            // if (!ObjectId.isValid(query.userId)) { return res.status(400).send({ status: false, msg: "Please provide a valid user Id" }) }


        if(isValid(category)){
            const cateogrised = await userModel.find({category})
            if(cateogrised){filter['category']=category}
        }
        if(isValid(subcategory)){
            const subcat = await userModel.find({subcategory})
            if(subcat){filter['subcategory']=subcategory}

        }



        }
        const books = await bookModel.find(filter).select({_id:1,title:1,excerpt:1,userId:1,category:1,reviews:1,releasedAt:1}).sort()
        if (books.length===0){return res.status(400).send({status:false,error:'No Books found'})}
        return res.status(200).send({status:true,bookList:books})
    }
    catch(err){return res.status(500).send({status:false, error:err.message})}
}




module.exports.createBook = createBook
module.exports.getBook = getBook