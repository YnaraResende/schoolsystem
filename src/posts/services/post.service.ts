import { PostRepository } from '../repositories/post.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async getAllPosts() {
    return this.postRepository.getAllPosts();
  }
  async getPostById(id: string) {
    const post = await this.postRepository.getPostById(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }
  async createPost(post) {
    return this.postRepository.createPost(post);
  }
  async updatePost(id: string, post) {
    return this.postRepository.updatePost(id, post);
  }
  async deletePost(id: string) {
    return this.postRepository.deletePost(id);
  }

  async searchPosts(keyword: string) {
    const posts = await this.postRepository.searchPosts(keyword);
    if (posts.length === 0)
      throw new NotFoundException('Your search did not match any post');
    return posts;
  }
}
