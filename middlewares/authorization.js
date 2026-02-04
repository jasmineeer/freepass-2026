let jwt = require("jsonwebtoken")

exports.authorization = (request, response, next) => {
    // Token sent through header
    let header = request.headers.authorization
    let token = header && header.split(" ")[1]

    // if token is null
    if (token == null) {
        return response.json({
            message: `Unauthorized`
        })
    } else {
        let secretKey = `BCC Canteen`

        // Verify token
        jwt.verify(token, secretKey, (error, user) => {
            // If token is wrong
            if (error) {
                return response.json({
                    message: `Token Invalid`
                })
            } else {
                // If token is right
                request.dataUser = user;
                next()
            }
        })
    }
}
