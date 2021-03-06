const { User, Thought } = require('../models/index');

module.exports = {
    getUsers(req, res) {
        User.find()
            .populate('thoughts', '-__v')
            .populate('friends', '-__v')
            .select('-__v')
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .populate('thoughts', '-__v')
            .populate('friends', '-__v')
            .select('-__v')
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'No user found with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    createUser(req, res) {
        User.create(req.body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(500).json(err));
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'There is no user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'There is no user with that ID' })
                    : Thought.deleteMany({ _id: {$in: user.thoughts } })
            )
            .then(() => res.json({ message: 'The User and Thoughts were deleted' }))
            .catch((err) => res.status(500).json(err));
    },
    addFriend(req, res) {
        User.findOne({ _id: req.params.friendId })
            .then((friend) => {
                return User.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $addToSet: { friends: friend._id } },
                    { new: true }
                );
            })
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'There is no user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    deleteFriend(req, res) {
        User.findOne({ _id: req.params.friendId })
            .then((friend) => 
                !friend
                    ? res.status(404).json({ message: 'There is no friend with that ID' })
                    : User.findOneAndUpdate(
                        { friends: req.params.friendId },
                        { $pull: { friends: req.params.friendId } },
                        {new: true }
                    )
            )
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'The friend was deleted, but no user was found' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
};