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
          { name: createUserDto.name },
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

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })

    if (!user) throw new HttpException('User not found', 404)

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) throw new HttpException('No data to update', 400)
    const user = await this.findOne(id) // Apenas para validação se o usuario existe ou nao
    
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto
    })
  }

  async remove(id: number) {
    if (isNaN(id)) throw new HttpException("O id precisa ser um número.", 400)
    const user = await this.findOne(id) // Apenas para validação se o usuario existe ou nao
    return await this.prisma.user.delete({
      where: { id }
    }) 
  }
}
