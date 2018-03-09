const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.home = (req, res) => {
    res.render('index', {
        title: 'Home!'
    });
}

exports.add = (req, res) => {
    res.render('store-spec', { title: 'Add Store'})
}

exports.create = async(req, res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `${store.name} Store created successfully`);
    res.redirect(`/stores/${store.slug}`);
}