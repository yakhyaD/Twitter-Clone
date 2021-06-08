const express = require('express')
const passport = require('passport')
const List = require('../models/List')
const User = require('../models/User')
const Tweet = require('../models/Tweet')

const router = express.Router()

router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {

    const newList = {
        name: req.body.name,
        banner: req.body.banner,
        description: req.body.description,
        user: req.user._id
    }
    try {
        const user = await User.findById(req.user._id)
        const list = await List.create(newList)
        user.lists.unshift(list._id)
        user.save()
        return res.json({success: true, msg: "List created", List: list})
    } catch (err) {
        console.log(err)
        return res.status(500).json({success: false, msg: "Error creating list"})
    }
})

router.put('/:id/edit', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const updatedList = {
        name: req.body.name,
        banner: req.body.banner,
        description: req.body.description
    }
    Object.keys(updatedList)
        .forEach(key =>
            (updatedList[key] === undefined || updatedList[key] === "") ? delete updatedList[key] : null
        )
    try {
        const list = await List.findById(req.params.id)
        if (list.user.toString() == req.user._id) {
            await List.findByIdAndUpdate(req.params.id, updatedList, { useFindAndModify: false })
            res.json({ success: true, msg: "List updated"})
        } else {
            res.status(403).json("Unauthorized Action")
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({success: false, msg: "Error upadting list"})
    }
})
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
     try {
        const list = await List.findById(req.params.id)
        if (list.users.toString() === req.user._id) {
            await List.findByIdAndDelete(req.params.id, {useFindAndModify: false})
            return res.json({ success: true, msg: "List remowed"})
        } else {
            return res.status(403).json("Unauthorized Action")
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({success: false, msg: "Cannot removed"})
    }
})
router.get('/:id', async (req, res) => {
    try {
        const list = await List.findById(req.params.id)
        let users = []
        for (let i = 0; i < list?.users.length; i++) {
            users.push(list.users[i]._id)
        }
        const listTweets = await Tweet.find().where('user').in(users).sort({ _id: -1 })
            .populate({path: 'user', select: 'username profileImg name'})
            .populate({
                path: 'retweet',
                populate: {
                    path: 'user',
                    select: 'username profileImg name'
                }
            })
            .exec()
        res.json({success: true, list, listTweets})
    } catch (err) {
        console.log(err)
        res.status(500).json({success: false, msg: "Cannot get list"})
    }
})

router.post('/:username/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        const list = await List.findById(req.params.id)
        if (list.users.includes(user._id)){
            const index = list.users.indexOf(user._id)
            if (index !== -1) list.users.splice(index, 1)
            list.save()
            res.json({success: true, msg: "user removed from this list"})
        } else {
            list.users.push(user._id)
            list.save()
            res.json({success: true, msg: "user joined this list"})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({success: false, msg: "Cannot add user to the list"})
    }
})
router.get('/', async (req, res) => {
    try {
        const lists = await List.find().populate({path: 'user', select: 'username profileImg name'})

        res.json({success: true, lists })
    } catch (err) {
        console.log(err)
        res.status(500).json({success: false, msg: "Cannot get list"})
    }
})

module.exports = router