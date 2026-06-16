import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    personal: {
        fullName: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        address: { type: String, default: '' },
        profession: { type: String, default: '' },
        summary: { type: String, default: '' },
        photo: { type: String, default: null }
    },
    experience: [{
        title: { type: String, default: '' },
        company: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        description: { type: String, default: '' }
    }],
    education: [{
        school: { type: String, default: '' },
        degree: { type: String, default: '' }
    }],
    skills: [String]
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
