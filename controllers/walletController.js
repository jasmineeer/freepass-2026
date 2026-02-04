const md5 = require("md5")
const jwt = require(`jsonwebtoken`)
const { validationResult } = require(`express-validator`)
const access = require("../access")
let walletModel = require("../models/index").wallet
let topUpModel = require("../models/index").topup
let paymentModel = require("../models/index").transaction
let orderModel = require("../models/index").order

exports.showBalance = async (request, response) => {
    let granted = await access.usersOwners(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.dataUser.id_user 
    let pass = md5(request.body.password)

    walletModel.findOne({
        where: { 
            id_user: id 
        }
    })

    .then(result => {
        if (!result) {
            return response.status(404).json({ 
                message: "Wallet not found" 
            });
        }

        if (result.password !== pass) {
            return response.status(401).json({
                message: "Invalid Password!"
            });
        }

        return response.json({
            balance: result.balance
        })
    })

    .catch(error => {
        return response.status.json({ 
            message: error.message 
        });
    })
}

exports.topUp = async (request, response) => {
    let granted = await access.users(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.dataUser.id_user
    let amount = Number(request.body.amount)
    let pass = md5(request.body.password)

    walletModel.findOne({
        where: { 
            id_user: id
        }
    })

    .then(result => {
        if (!result) {
            return response.status(404).json({
                message: "Wallet not found!"
            });
        }

        if (result.password !== pass) {
            return response.status(401).json({
                message: "Invalid Password!"
            });
        }

        let newBalance = result.balance + amount;

        return walletModel.update(
            { 
                balance: newBalance 
            },{
                where: { 
                    id_user: id
                }
            }
        )

        .then(() => {
            return topUpModel.create({
                id_wallet: result.id_wallet,
                amount: amount
            })
        })

        .then(() => {
            return response.json({
                status: true,
                message: "Top Up successful",
                current_balance: newBalance
            })
        })
    })

    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.payment = async (request, response) => {
    let granted = await access.users(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.dataUser.id_user
    let pass = md5(request.body.password) 

    orderModel.findOne({
        where: {
            id_user: id,
            payment_status: 'Unpaid'
        }
    })

    .then(result => {
        if (!result) {
            return response.json({
                message: `You have no unpaid order`
            })
        }

        let amount = result.total

        return walletModel.findOne({
            where: {
                id_user: id
            }
        })

        .then(wallet => {
            if (!wallet) {
                return response.json({
                    message: `Wallet not found`
                })
            }

            if (wallet.password !== pass) {
                return response.json({
                    message: `Invalid Password!`
                })
            }

            if (wallet.balance < amount) {
                return response.json({
                    message: `Insufficient balance. Top Up first!`
                })
            }

            let newBalance = wallet.balance - amount

            return walletModel.update({
                balance: newBalance
            }, {
                where: {
                    id_user: id
                }
            })

            .then(() => {
                return orderModel.update({
                    order_status: 'Cooking',
                    payment_status: 'Paid'
                }, {
                    where: {
                        id_order: result.id_order
                    }
                })
            })

            .then(() => {
                return paymentModel.create({
                    id_order: result.id_order,
                    id_wallet: wallet.id_wallet,
                    transaction_date: new Date()
                })
            })

            .then(() => {
                return response.json({
                    status: true,
                    balance: newBalance,
                    message: `Payment successful`
                })
            })
        })
    })

    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}
