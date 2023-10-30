import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreateUserDto, GetUserDto, UpdateUserDto } from './dto'
import { PrismaService } from '~/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ name, password, role }: CreateUserDto) {
    const existedUser = await this.findByName(name)
    if (existedUser && existedUser.name === name) {
      throw new InternalServerErrorException('该账户已存在')
    }
    const hashedPass = await hash(password, 10)
    const user = await this.prisma.user.create({
      data: { name, password: hashedPass, role }
    })
    return new UserEntity(user)
  }

  async findAll({ page, size, query = '' }: GetUserDto) {
    const users = await this.prisma.user.findMany({
      where: {
        is_del: false,
        name: { contains: query }
      },
      take: size,
      skip: (page - 1) * size,
      orderBy: { id: 'desc' }
    })
    const total = await this.prisma.user.count({
      where: {
        is_del: false,
        name: { contains: query }
      }
    })
    return {
      result: users.map(user => new UserEntity(user)),
      total
    }
  }

  async findByName(name: string) {
    const user = await this.prisma.user.findFirst({
      where: { name, is_del: false }
    })
    if (!user) return false
    return user
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id, is_del: false } })
    return new UserEntity(user)
  }

  async update(id: number, updateUserDto: UpdateUserDto, canUpdatePass: boolean = false) {
    if (updateUserDto.password && !canUpdatePass) {
      throw new InternalServerErrorException('不能直接更新密码，请重置密码')
    }
    await this.prisma.user.update({
      where: { id, is_del: false },
      data: { ...updateUserDto }
    })
    return '更新成功'
  }

  async remove(id: number) {
    await this.prisma.user.update({
      where: { id, is_del: false },
      data: { is_del: true }
    })
    return '删除成功'
  }
}
