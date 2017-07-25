const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');

const userSchema = mongoose.Schema({
    local : {
        email: {type: String, required: true},
        password: {type: String, required: true}
    },
    details : {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
    },
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User', userSchema);

