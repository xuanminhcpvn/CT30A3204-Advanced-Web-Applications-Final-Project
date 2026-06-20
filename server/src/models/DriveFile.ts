import mongoose, { Document, Schema, Types } from "mongoose";

interface IDriveFile extends Document {
    ownerId: mongoose.Types.ObjectId;
    filename: string;
    contents: string;
    type: "text" | "spreadsheet" | "slide" | "image";
    folderId?: Types.ObjectId | null;
    shareLink?: string | null;
    isFavorite: boolean;
    isSoftDeleted: boolean;
    softDeletedAt?: Date | null;
}

const driveFileSchema: Schema = new Schema({
    ownerId: {type: Schema.Types.ObjectId, ref: "User",required: true},
    filename: {type: String,required: true},
    contents: {type: String, required: true},
    type: { type: String, enum: ["text", "spreadsheet", "slide", "image"], default: "text", required: true,},
    folderId: {type: Schema.Types.ObjectId, default: null, required: false},
    shareLink: {type: String,default: null, required: false},
    isFavorite: {type: Boolean, default: false, required: false},
    isSoftDeleted: {type: Boolean,default: false,required: false},
    softDeletedAt: {type: Date,default: null,required: false},
    },
    {
        timestamps: true //CreatedAt + UpdatedAt created by default if timestamps == true
    }
);

const DriveFile: mongoose.Model<IDriveFile> = mongoose.model<IDriveFile>("DriveFile", driveFileSchema);

export {DriveFile};
export type {IDriveFile};