import { PostRepository } from '../post.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../schemas/post.schema';
import { Model } from 'mongoose';
import { IPost } from '../../schemas/models/post.interface';

export class PostMongooseRepository implements PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  getAllPosts(): Promise<IPost[]> {
    return this.postModel.find().exec();
  }

  getPostById(id: string): Promise<IPost> {
    return this.postModel.findById(id).exec();
  }
  async createPost(post: IPost): Promise<void> {
    const newPost = new this.postModel(post);
    await newPost.save();
  }
  async updatePost(id: string, post: IPost): Promise<void> {
    await this.postModel.updateOne({ _id: id }, post).exec();
  }
  async deletePost(id: string): Promise<void> {
    await this.postModel.deleteOne({ _id: id }).exec();
  }
  async searchPosts(keyword: string): Promise<IPost[]> {
    return this.postModel
      .find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { content: { $regex: keyword, $options: 'i' } },
        ],
      })
      .exec();
  }
}
