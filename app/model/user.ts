import { Application } from 'egg'
import { Schema } from 'mongoose'
import * as AutoIncrementFactory from 'mongoose-sequence'

export interface UserProps {
  username: string;
  password: string;
  email?: string;
  nickName?: string;
  picture?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  type: 'email' | 'cellphone';
  role?: 'admin' | 'normal';
}

function initUserModel(app: Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose)
  const UserSchema = new Schema<UserProps>({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    nickName: { type: String },
    picture: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    type: { type: String, default: 'email' },
    role: { type: String, default: 'normal' }
  }, { timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password
        delete ret.__v
      }
    }
  })
  UserSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'users_id_counter' })
  return app.mongoose.model<UserProps>('User', UserSchema)
}

export default initUserModel
