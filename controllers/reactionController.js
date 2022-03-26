const { Thought, Reaction } = require('../models/index');

module.exports = {
    createReaction(req, res) {
        Reaction.create(req.body)
            .then((reaction) => {
                return Thought.findOneAndUpdate(
                    { _id: req.body.thoughtId },
                    { $addToSet: { reactions: reaction.reactionId } },
                    { new: true }
                );
            })
            .then((thought) => 
                !thought
                    ? res.status(404).json({ message: 'The reaction was created but there was no thought with that ID' })
                    : res.json('Reaction was created')
            )
            .catch((err) => res.status(500).json(err));
    },
    deleteReaction(req, res) {
        Reaction.findOneAndRemove({ reactionId: req.params.reactionId })
            .then((reaction) => 
                !reaction
                    ? res.status(404).json({ message: 'There is no reaction with that ID' })
                    : Thought.findOneAndUpdate(
                        { reactions: req.params.reactionId },
                        { $pull: { reactions: req.params.reactionId } },
                        { new: true }
                    )
            )
            .then((thought) => 
                !thought
                    ? res.status(404).json({ message: 'The reaction was deleted, but no thought was found' })
                    : res.json({ message: 'The reaction was deleted' })
            )
            .catch((err) => res.status(500).json(err));
    },
};