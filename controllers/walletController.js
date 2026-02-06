const md5 = require("md5")
const jwt = require(`jsonwebtoken`)
const bcrypt = require('bcrypt')
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

    let result = await walletModel.findOne({
        where: {
            id_user: id
        }
    })

    if(result) {
        let passValid = await bcrypt.compare(request.body.password, result.password)

        if(!passValid) {
            return response.json({
                message: "Invalid Password"
            })
        }

        return response.json({
            balance: result.balance
        })
    }
}

exports.topUp = async (request, response) => {
    let granted = await access.users(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.dataUser.id_user
    let amount = Number(request.body.amount)
    let password = request.body.password

    try {
        let wallet = await walletModel.findOne({
            where: { 
                id_user: id 
            }
        })

        if (!wallet) {
            return response.json({ 
                message: "Wallet not found!" 
            })
        }

        let passValid = await bcrypt.compare(password, wallet.password);
        
        if (!passValid) {
            return response.json({ 
                message: "Invalid Password!" 
            })
        }

        let newBalance = wallet.balance + amount

        await walletModel.update(
            { 
                balance: newBalance 
            },{ 
                where: { 
                    id_user: id 
                } 
            }
        )

        await topUpModel.create({
            id_wallet: wallet.id_wallet,
            amount: amount
        })

        return response.json({
            status: true,
            message: "Top Up successful",
            current_balance: newBalance
        })

    } catch (error) {
        return response.json({ 
            message: error.message 
        })
    }
}

exports.payment = async (request, response) => {
    let granted = await access.users(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.dataUser.id_user
    let password = request.body.password

    try {
        let order = await orderModel.findOne({
            where: {
                id_user: id,
                payment_status: 'Unpaid'
            }
        });

        if (!order) {
            return response.json({ message: `You have no unpaid order` })
        }

        let amount = order.total

        let wallet = await walletModel.findOne({
            where: { 
                id_user: id 
            }
        });

        if (!wallet) {
            return response.json({ message: `Wallet not found` })
        }

        let passValid = await bcrypt.compare(password, wallet.password);

        if (!passValid) {
            return response.json({ message: `Invalid Password!` })
        }

        if (wallet.balance < amount) {
            return response.json({ message: `Insufficient balance` })
        }

        let newBalance = wallet.balance - amount

        await walletModel.update(
            { 
                balance: newBalance 
            },{ 
                where: { 
                    id_user: id 
                } 
            }
        )

        await orderModel.update(
            { 
                order_status: 'Cooking', 
                payment_status: 'Paid' 
            },{ 
                where: { 
                    id_order: order.id_order 
                } 
            }
        )

        await paymentModel.create({
            id_order: order.id_order,
            id_wallet: wallet.id_wallet,
            transaction_date: new Date()
        })

        return response.json({
            status: true,
            balance: newBalance,
            message: `Payment successful`
        })
    } catch (error) {
        return response.json({ 
            message: error.message 
        })
    }
}
