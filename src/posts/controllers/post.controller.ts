import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { IPost } from '../schemas/models/post.interface';
import { AuthGuard } from '../../shared/guards/auth.guar';
import { Roles } from '../../shared/decorator/roles.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //para professores
  @UseGuards(AuthGuard)
  @Get('search')
  @Roles('professor')
  async getPostsAdmin(@Query('keyword') keyword: string) {
    console.log(keyword);
    return this.postService.searchPosts(keyword);
  }

  //para professores
  @UseGuards(AuthGuard)
  @Roles('professor')
  @Post()
  async createPost(@Body() post: IPost) {
    return this.postService.createPost(post);
  }

  //para professores
  @UseGuards(AuthGuard)
  @Roles('professor')
  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() post: IPost) {
    return this.postService.updatePost(id, post);
  }

  //para professores
  @UseGuards(AuthGuard)
  @Delete(':id')
  @Roles('professor')
  async deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }

  //para estudantes
  @UseGuards(AuthGuard)
  @Get()
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  //para estudantes
  @UseGuards(AuthGuard)
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }
}
