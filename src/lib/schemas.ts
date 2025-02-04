import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, index: true, unique: true },
    password: String,
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    }
})

const User = model('User', UserSchema, 'users')

export { User }