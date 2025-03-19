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
        console.log(error);
        
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


const deleteProduct = async(req, res, next)=>{
    try {
        const product = await Products.findById(req.params.id);
        if(!product){
            return next(new AppError('No product found!', StatusCodes.NOT_FOUND));
        }

        if(product.image){
            const publicId = product.image.split('/').pop().split('.')[0];
            try {
                await Cloudinary.uploader.destroy(`products/${publicId}`);
            } catch (error) {
                next(new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
            }
        }

        await Products.findByIdAndDelete(req.params.id);
        return res.status(StatusCodes.OK).json({message: 'Product deleted successfully'});
    } catch (error) {
        next(new AppError(error.message || 'failed to delete product', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


const getRecommendedProducts = async (req, res, next) => {
    try {
        const totalCount = await Products.countDocuments({ isFeatured: true });

        if (totalCount === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No recommended products found!",
            });
        }

        const randomSkip = Math.max(0, Math.floor(Math.random() * (totalCount - 3)));

        const products = await Products.find({ isFeatured: true })
            .skip(randomSkip)
            .limit(3)
            .select("_id name description image price");

        res.status(StatusCodes.OK).json({
            success: true,
            data: products,
            message: "Recommended products fetched successfully!",
        });

    } catch (error) {
        next(new AppError(error.message || "Failed to fetch recommended products", StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


const getProductsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;

        // Use case-insensitive regex search
        const products = await Products.find({
            category: { $regex: new RegExp(`^${category}$`, "i") }
        }).lean();

        if (!products.length) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No products found in this category",
            });
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: products,
            message: `Products fetched successfully for category: ${category}`,
        });

    } catch (error) {
        next(new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


const toggleFeaturedProducts = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Products.findById(id);
        if (!product) {
            return next(new AppError("Product not found", StatusCodes.NOT_FOUND));
        }

        // Toggle isFeatured status
        product.isFeatured = !product.isFeatured;
        await product.save();

        // Update Redis cache in the background
        updateFeaturedProductsCache().catch(err => console.error("Redis cache update failed:", err));

        return res.status(StatusCodes.OK).json({
            success: true,
            data: product,
            message: "Product featured status updated successfully!",
        });

    } catch (error) {
        next(new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

// Update Redis cache for featured products
const updateFeaturedProductsCache = async () => {
    try {
        const featuredProducts = await Products.find({ isFeatured: true }).lean();
        await Redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.error("Error updating Redis cache:", error);
    }
};


module.exports ={
    createProduct,
    getAllProducts,
    getFeaturedProducts,
    deleteProduct,
    getRecommendedProducts,
    getProductsByCategory,
    toggleFeaturedProducts
}