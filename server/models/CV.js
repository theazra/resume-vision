import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fileName: String,
    filePath: String,
    parsedText: String,
    analysis: {
        score: Number,
        suggestions: [String],
        skills: [String],
    },
}, { timestamps: true });

const CV = mongoose.model('CV', cvSchema);

export default CV;
