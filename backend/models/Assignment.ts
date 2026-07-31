import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  assignedTo: mongoose.Types.ObjectId;
  asset: mongoose.Types.ObjectId;
  assignedDate: Date;
  returnDate?: Date | null;
  conditionOut?: string;
}

const assignmentSchema = new Schema<IAssignment>({
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  assignedDate: { type: Date, required: true, default: Date.now },
  returnDate: { type: Date, default: null },
  conditionOut: { type: String }
}, { timestamps: true });

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', assignmentSchema);
