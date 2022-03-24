const { Schema, model } = require("mongoose");
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: { 
            type: String, 
            required: true, 
            minlength: 1, 
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => formatDate(date), // create format function in helpers.js
        }, 
        username: { 
            type: String, 
            required: true, 
        },
        reactions: [reactionSchema], // array of nested documents created with reactionShema
    },
    {
        toJSON: {
        virtuals: true,
        },
        id: false,
    }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
