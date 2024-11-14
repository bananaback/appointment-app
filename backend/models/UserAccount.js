import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userAccountSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,   // Changed from 3 to 2
        validate: {
            validator: function (value) {
                return /^[A-Za-z]+$/.test(value);  // Only allows alphabetic characters
            },
            message: 'First name can only contain letters',
        },
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,   // Changed from 3 to 2
        validate: {
            validator: function (value) {
                return /^[A-Za-z]+$/.test(value);  // Only allows alphabetic characters
            },
            message: 'Last name can only contain letters',
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email'],
    },
    phone: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 10,
        validate: {
            validator: function (value) {
                return /^[0-9]{10}$/.test(value);  // Ensures only 10-digit numbers are allowed
            },
            message: 'Phone number must be 10 digits long and numeric',
        }
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['Patient', 'Doctor', 'Admin'],
        required: true,
    },
    dob: { type: Date, required: true, default: Date.now },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'],
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String },
    },

    // Doctor-specific fields
    specialty: {
        type: String,
        enum: ['Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics', 'General Practice'],
        required: function () { return this.role === 'Doctor'; }
    },
    experience: {
        type: Number,
        min: 0,
        required: function () { return this.role === 'Doctor'; }
    },
    docAvatar: {
        public_id: String,
        url: String,
    },

    // Patient-specific fields
    medicalHistory: {
        type: [String],  // Simple array of strings for conditions
        required: function () { return this.role === 'Patient'; }
    },
}, { timestamps: true });

// Hash password before saving
userAccountSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.model('UserAccount', userAccountSchema);
