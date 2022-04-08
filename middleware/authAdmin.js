const User = require('../models/User')

const authAdmin = async (req,res,next) => {
    try {
        const user = await User.findOne({
            _id: req.user._id
        })
        
        if(user.role == 'user'){
            return res.status(401).json({err: "Admin resources: Access denied"})
        }

        next();

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}

module.exports = authAdmin