const jwt = require(`jsonwebtoken`)
const { validationResult } = require(`express-validator`)
const access = require("../access")
let canteenModel = require("../models/index").canteen 
let userModel = require("../models/index").user 
let menuModel = require("../models/index").menu 
let feedbackModel = require("../models/index").feedback 
let orderModel = require("../models/index").order 

exports.getCanteen = async (request, response) => {
    let dataCanteen = await canteenModel.findAll({
        include: [
            {
                model: userModel,
                as: "user",
                attributes: [
                    'id_user',
                    'user_name'
                ]
            }, {
                model: menuModel,
                as: "menu"
            }
        ]
    })

    .then(result => {
        return response.json(result)
    })

    .catch(error => {
        return response.json({
            message: error.message 
        })
    })
}

exports.getCanteenById = (request, response) => {
    let id = request.params.id_canteen;

    canteenModel.findOne({
        where: { 
            id_canteen: id 
        },
        include: [
            {
                model: userModel,
                as: "owner",
                attributes: [
                    'id_user', 
                    'user_name'
                ]
            },
            {
                model: menuModel,
                as: "menu"
            },
            {
                model: orderModel,
                as: "order",
                include: [
                    {
                        model: feedbackModel,
                        as: "feedback",
                        required: false,
                        include: [
                            {
                                model: userModel,
                                as: "owner",
                                attributes: [
                                    'id_user', 
                                    'user_name'
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    })
    .then(dataCanteen => {
        if (!dataCanteen) {
            return response.json({
                message: "Canteen not found!"
            });
        }

        let result = dataCanteen.toJSON();

        if (result.orders) {
            result.orders = result.orders.map(order => {
                if (order.feedback === null) {
                    order.feedback = "Order has not been reviewed";
                }
                return order;
            });
        }

        return response.json({
            status: true,
            data: result
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.getFeedback = async (request, response) => {
    let granted = await access.owners(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.dataUser.id_user

    canteenModel.findOne({
        where: {
            id_owner: id 
        }
    })

    .then(result => {
        return feedbackModel.findAll({
            include: [
                {
                    model: orderModel,
                    as: "order",
                    where: {
                        id_canteen: result.id_canteen
                    },
                    attributes: [
                        'id_order',
                        'order_date'
                    ]
                }, {
                    model: userModel,
                    as: "owner",
                    attributes: [
                        'id_user',
                        'user_name'
                    ]
                }
            ]
        })
    })

    .then(rest => {
        if (rest) {
            return response.json({
                status: true, 
                data: rest
            })
        }
    })

    .catch(error => {
        return response.json({
            status: false,
            message: error.message
        })
    })
}

exports.addFeedback = async (request, response) => {
    let granted = await access.users(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.dataUser.id_user;
    let idOrder = request.body.id_order;
    let rating = request.body.rating;
    let review = request.body.review;

    orderModel.findOne({
        where: { 
            id_order: idOrder, 
            id_user: id 
        }
    })

    .then(order => {
        if (!order) {
            return response.json({ message: "Order not found" });
        }
        
        if (order.status !== "Completed") {
            return response.json({ message: "You can only review completed orders" });
        }

        return feedbackModel.create({
            id_order: idOrder,
            id_user: id,
            rating: rating,
            review: review,
            date: new Date()
        });
    })

    .then(result => {
        return response.json({
            status: true,
            message: "Thank you for your feedback!",
            data: result
        });
    })

    .catch(error => {
        return response.json({ 
            message: error.message 
        });
    });
}

exports.deleteFeedback = async (request, response) => {
    let granted = await access.owners(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.params.id_feedback
    
    feedbackModel.findOne({
        where: {
            id_feedback: id
        },
        include: [{
            model: orderModel,
            as: "order"
        }]
    })

    let idCanteen = null

    .then(result => {
        if (!result) {
            return response.json({
                status: false,
                message: "Feedback not available"
            })
        }

        idCanteen = result.order.id_canteen

        return feedbackModel.destroy({
            where: {
                id_feedback: id
            }
        })
    })

    .then(rest => {
        if (rest) {
            updateRating(idCanteen)

            return response.json({
                status:true,
                message: "Feedback successfully deleted"
            })
        }
    })

    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

const updateRating = (idCanteen) => {
    orderModel.findAll({
        where: {
            id_canteen: idCanteen
        },
        include: [{
            model: feedbackModel,
            as: 'feedback',
            required: true
        }]
    })

    .then(result => {
        if (order.length === 0) {
            return canteenModel.update(
                {
                rating: 0
                },
                {
                    where: {
                        id_canteen: idCanteen
                    }
                }
            )
        }

        let total = 0;
        order.forEach(or => {
            total += or.feedback.rating
        });

        let average = total / order.length;

        return canteenModel.update(
            {
                rating: average
            }, {
                where: {
                    id_canteen: idCanteen
                }
            }
        )
    })
}
