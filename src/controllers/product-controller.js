const Products = require('../models/product.model.js');
const {ErrorResponse, SuccessResponse} = require('../utils/common');
const {Cloudinary} = require('../config');
const {StatusCodes} = require('http-status-codes');



const createProduct = async(req, res)=>{
    const {name, description, price, image, category} = req.body;
    try {
        let cloudinaryResponse = null;

        if(image){
            cloudinaryResponse = await Cloudinary.uploader.upload(image,{folder:'products'});
        }

        const product = await Products.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",//incase there be no image
            category
        });

        SuccessResponse.data = product;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }

}


module.exports ={
    createProduct,
}