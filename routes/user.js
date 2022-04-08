const router = require('express').Router();
const User = require('../models/User')
const Course = require('../models/Course')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.get('/', async (req,res)=>{
    try {
        const user = await User.find()

        if(user){
            res.status(200).json({
                success: true,
                data: user
            })
        }
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.post('/register', async (req,res)=>{
    try {
        const {name, email, contact, password} = req.body

        const hashPassword = await bcrypt.hash(password, 12)
        const newUser = new User({
            name,
            email,
            contact,
            password: hashPassword
        })

        await newUser.save()
        res.status(201).json({
            success: true,
            data: "User registered Successfully"
        })

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.post('/login', async (req,res)=> {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({err: "User does not exist"})
        }

        const matchPassword = await bcrypt.compare(password, user.password)
        if(matchPassword){
            const token =await jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
            res.status(200).json({
                success: true,
                data: token
            })
        }else{
            return res.status(400).json({err: 'Invalid Email or Password'})
        }
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.post('/adduser', auth, authAdmin, async (req,res)=>{
    try {
        const user = await User.findOne({_id: req.user._id})
        if(user.role === 'admin'){
            const newUser = await User.create(req.body);
            res.status(201).json({
                success: true,
                data: newUser
            })
        }
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

module.exports = router