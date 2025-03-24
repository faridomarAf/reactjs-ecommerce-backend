const {getAnalyticsData, getDailySalesData} = require('../utils/analytics/analyticsData');
const {AppError} = require('../utils');
const {StatusCodes} = require('http-status-codes');



const analyticsData = async(req, res, next)=>{
    try {
        //get data for cart
        const dataAnalytics = await getAnalyticsData();

        //get data for chart
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const dailySalesData = await getDailySalesData(startDate, endDate);

        return res.json({
            dataAnalytics,
            dailySalesData
        });

    } catch (error) {
        next(new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


module.exports = {
    analyticsData
};
