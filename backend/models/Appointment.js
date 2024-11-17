import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    workShift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkShift',
        required: true
    },  // Reference to the specific work shift
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAccount',
        required: true
    },  // Reference to the patient requesting the appointment
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Done'],
        default: 'Pending'
    },
    requestDate: { type: Date, default: Date.now },  // Date when the appointment was requested
    notes: { type: String }  // Optional notes from the patient
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
