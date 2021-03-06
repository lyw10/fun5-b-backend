import { Service } from 'egg'
import { UserProps } from '../model/user'
import * as $Dysmsapi from '@alicloud/dysmsapi20170525'

export default class UserService extends Service {
  public async createByEmail(payload: UserProps) {
    const { ctx } = this
    const { username, password } = payload
    const hash = await ctx.genHash(password)
    const userCreatedData: Partial<UserProps> = {
      username,
      password: hash,
      email: username
    }
    return ctx.model.User.create(userCreatedData)
  }
  async findById(id: string) {
    return this.ctx.model.User.findById(id)
  }
  async findByUsername(username: string) {
    return this.ctx.model.User.findOne({ username })
  }
  async sendSMS(phoneNumber: string, veriCode: string) {
    const { app } = this
    // 配置参数
    const sendSMSRequest = new $Dysmsapi.SendSmsRequest({
      phoneNumbers: phoneNumber,
      signName: '阿里云短信测试',
      templateCode: 'SMS_154950909',
      templateParam: `{\"code\":\"${veriCode}\"}`,
    })
    const resp = await app.ALClient.sendSms(sendSMSRequest)
    return resp
  }
  async loginByCellphone(cellphone: string) {
    const { ctx, app } = this
    const user = await this.findByUsername(cellphone)
    // 检查 user 记录是否存在
    if (user) {
      // generate token
      const token = app.jwt.sign({ username: user.username, _id: user._id }, app.config.jwt.secret)
      return token
    }
    // 新建一个用户
    const userCreatedData: Partial<UserProps> = {
      username: cellphone,
      phoneNumber: cellphone,
      nickName: `Fun5_${cellphone.slice(-4)}`,
      type: 'cellphone'
    }
    const newUser = await ctx.model.User.create(userCreatedData)
    const token = app.jwt.sign({ username: newUser.username }, app.config.jwt.secret)
    return token
  }
}
