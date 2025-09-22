import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const findUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      }
    })

    if (findUser) throw new HttpException('User already exists', 409)

    return await this.prisma.user.create({
      data: createUserDto
    })
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username }
    })

    if (!user) throw new HttpException('User not found', 404)

    return user
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email }
    })

    if (!user) throw new HttpException('User not found', 404)

    return user
  }

  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })

    if (!user) throw new HttpException('User not found', 404)

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto, userData: any) {
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) throw new HttpException('No data to update', 400)
    const user = await this.findOneById(id) // Apenas para validação se o usuario existe ou nao
    const userWUsername = await this.prisma.user.findFirst({
      where: {
        username: updateUserDto.username
      }
    })

    if (userWUsername) throw new HttpException('username already exists', 409)
    if (user.id != userData.sub) throw new HttpException('Somente o dono do perfil pode alterar ele.', 401)

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto
    })
  }

  async remove(id: number) {
    if (isNaN(id)) throw new HttpException("O id precisa ser um número.", 400)
    const user = await this.findOneById(id) // Apenas para validação se o usuario existe ou nao
    return await this.prisma.user.delete({
      where: { id }
    })
  }
}
