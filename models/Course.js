const mongoose = require('mongoose');
const slugify = require('slugify');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please Enter the title'],
        maxLength: [50, 'Title must not exceed 100 characters']
    },
    slug: {
        type: String
    },
    description: {
        type: [String],
        required: [true, 'Please Enter the description'],
        maxLength: [300, 'Description must not exceed 100 characters']
    },
    start_date: {
       s_dd: {
           type: Number,
           required: [true, 'Please Enter the day']
       },
       s_mm: {
           type: Number,
           required: [true, 'Please Enter the month']
       },
       s_yy: {
           type: Number,
           required: [true, 'Please Enter the year']
       }
    },
    end_date: {
        e_dd: {
            type: Number,
            required: [true, 'Please Enter the day']
        },
        e_mm: {
            type: Number,
            required: [true, 'Please Enter the month']
        },
        e_yy: {
            type: Number,
            required: [true, 'Please Enter the year']
        }
    },
    enroll: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    postedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

CourseSchema.virtual('upcoming').set(function(value){
    this._upcoming = value
    const currentDate = new Date(Date.now())
    const c_dd = currentDate.getDate();
    const c_mm = currentDate.getMonth();
    const c_yy = currentDate.getFullYear();
    const diff = this.start_date.s_dd - c_dd;
    if(diff <= 7 && this.start_date.s_mm >= c_mm && this.start_date.s_yy >= c_yy){
        return value = true;
    }
    return value = false
}).get(function(){
    return this._upcoming
})

CourseSchema.pre('save', function(next){
    this.slug = slugify(this.title, {lower: true})
    next();
})



module.exports = mongoose.model('Course', CourseSchema)