const { Schema } = require('mongoose');
const { formatDate } = require('../utils/helpers');

const reactionSchema = new Schema(
    {
        reactionId: { 
            type: Schema.Types.ObjectId,
            default: () => new Schema.Types.ObjectId,
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => formatDate(date),
        },
    },
);

module.exports = reactionSchema;