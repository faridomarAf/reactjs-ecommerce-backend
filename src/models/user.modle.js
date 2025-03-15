const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is reqruied!']
    },
    email: {
        type: String,
        required: [true, 'Email is reqruied!'],
        unique: true,
        lowercase:true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is reqruied!'],
        minlenght: [6, 'Password must be at least 6 characters!']
    },
    cartItems:{
        quantity:{
            type: Number,
            default: 1
        },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    },
    role:{
        type: String,
        enum: ['customer','admin'],
        default: 'customer'
    }
},{
    timestamps: true
});

//hash password
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

//Compare password
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
