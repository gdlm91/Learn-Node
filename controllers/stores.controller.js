const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');

        if (!isPhoto) {
            return next({ message: 'File Extension not supported' }, false);
        }

        next(undefined, true);
    }
}

exports.home = (req, res) => {
    res.render('index', {
        title: 'Home!'
    });
}

exports.getStores = async (req, res) => {
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
}

exports.add = (req, res) => {
    res.render('store-spec', { title: 'Add Store' })
}

exports.create = async (req, res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `${store.name} Store created successfully`);
    res.redirect(`/stores/${store.slug}`);
}

exports.edit = async (req, res) => {
    const store = await Store.findOne({ _id: req.params.id });
    res.render('store-spec', { title: `Edit Store: ${store.name}`, store });
}

exports.update = async (req, res) => {
    // Schema Defaults won't kick on Updates
    req.body.location.type = 'Point';

    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store -></a>`)
    res.redirect(`/stores/${store._id}/edit`);
}

exports.getStoreBySlug = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug });
    // Show 404 if no store found
    if (!store) return next();

    res.render('store-single', { title: store.name, store });
}

// Middlewares

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;

    // Resize Operation
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);

    next();
}