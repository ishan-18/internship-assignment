const router = require('express').Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const Course = require('../models/Course')
const User = require('../models/User')

router.get('/', async (req,res)=>{
    try {
        const course = await Course.find();
        if(course){
            res.status(200).json({
                success: true,
                data: course
            });
        }
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.post('/addCourse', auth, authAdmin, async (req,res)=>{
    try {
        const {title, description, start_date:{s_dd,s_mm,s_yy}, end_date:{e_dd,e_mm,e_yy}} = req.body

        const currentDate = new Date(Date.now())
        const c_dd = currentDate.getDate();
        const c_mm = currentDate.getMonth();
        const c_yy = currentDate.getFullYear();
        console.log(c_dd);

        const newCourse = new Course({
            title,
            description,
            start_date:{
                s_dd: c_dd <= s_dd && c_mm <= s_mm ? s_dd : null,
                s_mm: c_mm <= s_mm ? s_mm : null,
                s_yy: c_yy <= s_yy ? s_yy : null
            },
            end_date:{
                e_dd: s_mm && s_dd < e_dd ? e_dd : null,
                e_mm: s_mm <= e_mm ? e_mm : null, 
                e_yy: s_yy <= e_yy ? e_yy : null 
            },
            postedby: req.user._id
        })

        await newCourse.save()

        res.status(201).json({
            success:true,
            data: newCourse,
        })
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.put('/enrollCourse/:id', auth, async (req,res)=>{
    try {
        let course = await Course.findById(req.params.id)

        const currentDate = new Date(Date.now())
        const c_dd = currentDate.getDate();
        const c_mm = currentDate.getMonth();
        const c_yy = currentDate.getFullYear();

        const c = c_dd.toString() + c_mm.toString()  + c_yy.toString();
        const s = course.start_date.s_dd.toString() + course.start_date.s_mm.toString()  + course.start_date.s_yy.toString();
        

        if(c <= s){
            course = await Course.findByIdAndUpdate(req.params.id, {
                $push: {enroll: req.user._id}
            }, {
                new: true,
                runValidators: true
            })

            res.status(200).json({
                success: true,
                data: "Enrolled successfully"
            })
        }else{
            res.status(400).json({success: false, data:"Course has been expired"})
        }

    } catch (err) {
        return res.status(500).json({err: err.message})
    }
})

router.get('/enrolledcoursesbyuser/:id', auth, async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        
        const courses = await Course.find({enroll: user}).populate('_id').select('-title -description -start_date -end_date -enroll -postedby -createdAt -updatedAt -__v')
        if(courses){
            res.status(200).json({
                success: true,
                data: courses
            })
        }
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
})

router.get('/enrolledusersofacourse/:id', auth, async (req,res)=>{
    try {
        let course = await Course.findById(req.params.id).populate('enroll').select('-title -description -start_date -end_date -_id -postedby -createdAt -updatedAt -__v'); 
        res.status(200).json({
            success: true,
            data: course
        })
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
})

module.exports = router;