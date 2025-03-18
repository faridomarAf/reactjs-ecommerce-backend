const Products = require('../models/product.model.js');
const {Cloudinary} = require('../config');
const {StatusCodes} = require('http-status-codes');
const {Redis} = require('../config');
const {AppError} = require('../utils');


const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, image, category } = req.body;
        let imageUrl = "";

        if (image) {
            const cloudinaryResponse = await Cloudinary.uploader.upload(image, { folder: 'products' });
            imageUrl = cloudinaryResponse.secure_url;
        }

        const product = await Products.create({
            name,
            description,
            price,
            image: imageUrl,
            category
        });

        return res.status(StatusCodes.CREATED).json({
            success: true,
            data: product,
            message: "Product created successfully!"
        });

    } catch (error) {
        next(new AppError(error.message || "Failed to create product", StatusCodes.INTERNAL_SERVER_ERROR));
    }
};



const getAllProducts = async (req, res, next) => {
    try {
        const products = await Products.find({});

        return res.status(StatusCodes.OK).json({
            success: true,
            data: products,
            message: "Products fetched successfully!",
        });

    } catch (error) {
        return next(new AppError(error.message || "Failed to fetch products", StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

const getFeaturedProducts = async (req, res, next) => {
    try {
        let featuredProducts = await Redis.get('featured_products');
        if (featuredProducts) {
            return res.status(StatusCodes.OK).json(JSON.parse(featuredProducts));
        }

        featuredProducts = await Products.find({ isFeatured: true }).lean();

        if (featuredProducts.length === 0) {
            return next(new AppError("No featured products found!", StatusCodes.NOT_FOUND));
        }

        await Redis.set('featured_products', JSON.stringify(featuredProducts), 'EX', 60 * 60);

        return res.status(StatusCodes.OK).json(featuredProducts);
    } catch (error) {
        next(new AppError(error.message || "Failed to fetch featured products", StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


module.exports ={
    createProduct,
    getAllProducts,
    getFeaturedProducts
}