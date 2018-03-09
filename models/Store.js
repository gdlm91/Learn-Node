const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: 'A Store Name is required'
    },
    description: String,
    slug: {
        type: String,
        trim: true
    },
    tags: [String]
});

storeSchema.pre('save', function(next) {
    if (!this.isModified('name')) {
        return next();
    }

    this.slug = slug(this.name);
    next();
});

module.exports = mongoose.model('Store', storeSchema);