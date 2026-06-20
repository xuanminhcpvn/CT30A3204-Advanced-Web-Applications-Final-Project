import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    settings: {
        theme: "light" | "dark";
        language: string;
    };
    imageId?: mongoose.Types.ObjectId | null;
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    settings: {
        theme: { type: String, default: "light" },
        language: { type: String, default: "en" }
    },
    imageId: { type: Schema.Types.ObjectId, default: null,ref:"Image",required: false }
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema);

export { User };
export type {IUser};