const Products = require('../models/product.model.js');

const createProduct = async(req, res)=>{
    const {name, description, price, image, category, isFeatured} = req.body;
    
}


module.exports ={
    createProduct,
}