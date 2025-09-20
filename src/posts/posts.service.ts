import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  async findUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })

    if (!user) throw new HttpException('User not found', 404)

    return user
  }

  async create(createPostDto: CreatePostDto) {
    const user = await this.findUser(createPostDto.userId) // Apenas para validação se o usuario existe ou nao
    return await this.prisma.post.create({ data: createPostDto })
  }

  async findAll() {
    return await this.prisma.post.findMany()
  }
  async findAllByUserId(userId: number) {
    const post = await this.prisma.post.findMany({
      where: { userId }
    })

    if (!post) throw new HttpException('Post not found', 404)

    return post
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id }
    })

    if (!post) throw new HttpException('Post not found', 404)

    return post
  }


  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.findOne(id)

    return await this.prisma.post.update({
      where: { id },
      data: updatePostDto
    })
  }

  async remove(id: number) {
    await this.findOne(id)
    return await this.prisma.post.delete({
      where: { id }
    })
  }
}
