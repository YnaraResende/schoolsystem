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
  UsePipes,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { AuthGuard } from '../../shared/guards/auth.guar';
import { Roles } from '../../shared/decorator/roles.decorator';
import { z } from 'zod';
import { ZodValidationPipe } from '../../shared/pipe/zod-validation.pipe';

const createPostSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string(),
  isDraft: z.boolean(),
});

const updatePostSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  isDraft: z.boolean().optional(),
});

type CreatePost = z.infer<typeof createPostSchema>;
type UpdatePost = z.infer<typeof updatePostSchema>;

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //para professores
  @UseGuards(AuthGuard)
  @Get('search')
  @Roles('professor')
  async getPostsAdmin(@Query('keyword') keyword: string) {
    return this.postService.searchPosts(keyword);
  }

  //para professores
  @UsePipes(new ZodValidationPipe(createPostSchema))
  @UseGuards(AuthGuard)
  @Roles('professor')
  @Post()
  async createPost(
    @Body() { title, description, author, isDraft }: CreatePost,
  ) {
    return this.postService.createPost({ title, description, author, isDraft });
  }

  //para professores
  @UsePipes(new ZodValidationPipe(updatePostSchema))
  @UseGuards(AuthGuard)
  @Roles('professor')
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() { title, description, isDraft }: UpdatePost,
  ) {
    return this.postService.updatePost(id, { title, description, isDraft });
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
