const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    token: {
        type: String
    }
})
const User = mongoose.model('UserRegister', userSchema);
module.exports = User;