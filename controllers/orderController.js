const jwt = require(`jsonwebtoken`)
const { validationResult } = require(`express-validator`)
const access = require("../access")
let canteenModel = require("../models/index").canteen 
let userModel = require("../models/index").user 
let menuModel = require("../models/index").menu 
let orderModel = require("../models/index").order
let detailModel = require("../models/index").detail_order 

exports.getOrders = (request, response) => {
    let role = request.dataUser.role;
    let id = request.dataUser.id_user;

    if (role === "Users") {
        orderModel.findAll({
            where: { 
                id_user: id
            },
            order: [[
                'createdAt', 
                'DESC'
            ]],
            include: [
                {
                    model: canteenModel,
                    as: "canteen",
                    attributes: [
                        'canteen_name', 
                        'rating'
                    ]
                },
                {
                    model: detailModel,
                    as: "details",
                    include: [{ 
                        model: menuModel, 
                        as: "menu", 
                        attributes: [
                            'menu_name', 
                            'price'
                        ] 
                    }]
                }
            ]
        })

        .then(result => {
            return response.json({
                status: true,
                data: result
            });
        })

        .catch(error => response.json({ 
            message: error.message 
        }))
    }

    else if (role === "Owners") {
        canteenModel.findOne({
            where: { id_owner: id }
        })

        .then(myCanteen => {
            if (!myCanteen) {
                return response.status(404).json({ 
                    message: "Canteen not available" 
                });
            }

            return orderModel.findAll({
                where: {
                    id_canteen: myCanteen.id_canteen,
                    status: {
                        [Op.or]: [
                            'Waiting', 
                            'Cooking',
                            'Ready'
                        ] 
                    }
                },
                order: [[
                    'createdAt', 
                    'ASC']],
                include: [
                    {
                        model: userModel,
                        as: "customer",
                        attributes: [
                            'user_name'
                        ]
                    },
                    {
                        model: detailModel,
                        as: "details",
                        include: [{ 
                            model: menuModel, 
                            as: "menu", 
                            attributes: [
                                'name', 
                                'price'
                            ] 
                        }]
                    }
                ]
            })
        })

        .then(result => {
            if (result) {
                return response.json({
                    status: true,
                    data: result 
                });
            }
        })

        .catch(error => response.json({ 
            message: error.message
        }));
    } 
    
    else {
        return response.json({ 
            message: "Unauthorized" 
        })
    }
}

exports.addOrder = async (request, response) => {
    let granted = await access.users(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let detail = request.body.detail_order; 
    let id = request.body.id_canteen;
    let subtotal = 0;

    for (let i = 0; i < detail.length; i++) {
        let idMenu = detail[i].id_menu;
        let qty = detail[i].qty;

        let menu = await menuModel.findOne({ 
            where: { 
                id_menu: idMenu 
            } 
        });

        if (!menu) {
            return response.json({ message: `Menu ${menu.menu_name} not found` });
        }

        if (menu.stock < qty) {
            return response.json({ message: `Insufficient stock for '${menu.menu_name}'` });
        }

        detail[i].price = menu.price;
        subtotal += menu.price * qty;
    }

    let dataOrder = {
        id_customer: request.dataUser.id_user, 
        id_canteen: id,
        order_status: "Waiting", 
        total: subtotal,
        payment_status: "Unpaid",
        order_date: new Date()
    };

    orderModel.create(dataOrder)

        .then(result => {
            let id = result.id_order;

            for (let i = 0; i < detail.length; i++) {
                detail[i].id_order = id;
            }

            return detailModel.bulkCreate(detail)
                
            .then(() => result);
        })

        .then(async result => {
            for (let i = 0; i < detail.length; i++) {
                await menuModel.decrement('stock', { 
                    by: detail[i].qty, 
                    where: { id_menu: detail[i].id_menu } 
                })
            }
            
            return result;
        })

        .then(result => {
            return response.json({
                status: true,
                message: `Order successfull`,
                data: result
            })
        })

        .catch(error => {
            return response.json({
                message: error.message
            })
        })
}

exports.updateStatus = async (request, response) => {
    let granted = await access.owners(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.params.id_order;
    let newStat = request.body.status;
    let idOwner = request.dataUser.id_user;

    orderModel.findOne({
        where: { id_order: id },
        include: [{
            model: canteenModel,
            as: "canteen",
            where: { 
                id_owner: idOwner 
            }
        }]
    })

    .then(order => {
        if (!order) {
            return response.json({ message: "Order not found" });
        }

        if (order.payment_status === "Unpaid" && newStat !== "Cancelled") {
            return response.json({ 
                message: "Cannot update order status. Customer must pay first!" 
            });
        }

        return orderModel.update(
            { 
                status: newStat 
            },{ 
                where: { 
                    id_order: id
                } 
            }
        );
    })

    .then(result => {
        return response.json({
            status: true,
            message: `Order #${idOrder} is '${newStat}'`
        });
    })

    .catch(error => {
        return response.json({ 
            message: error.message 
        });
    });
}
