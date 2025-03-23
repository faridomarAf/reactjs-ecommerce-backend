const Order = require('../models/order.model.js');
const {StatusCodes} = require('http-status-codes');
const {AppError} = require('../utils');
const Coupon = require('../models/coupon.model.js');
const {Stripe} = require('../config');



const createCheckoutSession = async(req, res, next)=>{
    try {
        const {products, couponCode} = req.body;
        if(!Array.isArray(products) || products.length === 0){
            return next(new AppError('Invalid or empty product array!', StatusCodes.BAD_REQUEST));
        };

        let totalAmount = 0;

        const lineItems = products.map((product)=>{
            const amount = Math.round(product.price * 100); 
            totalAmount += amount * product.quantity;

            return {
                price_data:{
                    currency: 'USD',
                    product_data:{
                        name: product.name,
                        image: [product.image]
                    },
                    unit_amount: amount
                }
            }
        });

        let coupon = null;
        if(couponCode){
            coupon = await Coupon.findOne({code: couponCode, userId: req.user, isActive: true});
            if(coupon){
                totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100);
            }
        }

        //create session
        const session = await Stripe.checkout.session.create({
            payment_method_types : ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/purchase-success?.session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel}`,
            discounts: coupon ? [{coupon: await createStripeCoupon(coupon.discountPercentage)},] : [],
            metadata:{
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p)=>({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price
                    }))
                )
            }, 
        });

        //create coupon and add it to DB
        if(totalAmount >= 2000){// 2000 is '200 dolar'
            await createNewCoupon(req.user._id);
        }

        return res.status(StatusCodes.CREATED).json({
            id: session.id,
            totalAmount: totalAmount / 100,
        }); 

    } catch (error) {
        next(new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

//to create one-time use coupon
async function createStripeCoupon(discountPercentage){
    const coupon = await Stripe.coupons.create({
        percentage_off: discountPercentage,
        duration: "once"
    });

    return coupon.id;
};

async function createNewCoupon(userId){
    const newCoupon = await Coupon({
        code: 'GIFT' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),// 30 days
        userId: userId
    });

    await newCoupon.save();
    return newCoupon;
};


//create checkout-success
const checkoutSuccess = async(req, res)=>{
    try {
        const {sessionId} = req.body;
        const session = await Stripe.checkout.sessions.retrive(sessionId);

        if(session.payment_status === "paid"){

            if (session.metadata.couponCode){
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
					},
					{
						isActive: false,
					}
				);
            };

			// create a new Order
			const products = JSON.parse(session.metadata.products);
			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100, // convert from cents to dollars,
				stripeSessionId: sessionId,
			});

			await newOrder.save();

            res.status(StatusCodes.CREATED).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
            });
        };

    } catch (error) {
        next(new AppError('Error processing successfull checkout!', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


module.exports ={
    createCheckoutSession,
    checkoutSuccess,
};
