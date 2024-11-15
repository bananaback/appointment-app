import mongoose from 'mongoose';

const workShiftSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAccount',
        required: true
    },  // Only doctors have work shifts
    date: { type: Date, required: true },  // Specific date for the work shift
    timeSlot: { type: String, required: true },  // Example: '08:00-12:00'
    isReserved: { type: Boolean, default: false },  // Reserved if an appointment is confirmed
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null  // Null if no appointment is reserved
    }
}, { timestamps: true });

export default mongoose.model('WorkShift', workShiftSchema);
