import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../../src/posts/controllers/post.controller';
import { PostService } from '../../src/posts/services/post.service';
import { AuthGuard } from '../../src/shared/guards/auth.guar';
import { NotFoundException } from '@nestjs/common';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  const mockPostService = {
    searchPosts: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    getAllPosts: jest.fn(),
    getPostById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllPosts', () => {
    it('should return an array of posts', async () => {
      const result = [
        {
          id: '1',
          title: 'First Post',
          description: 'This is the first post',
          author: 'User test',
          isDraft: false,
        },
      ];
      jest.spyOn(service, 'getAllPosts').mockResolvedValue(result);

      expect(await controller.getAllPosts()).toBe(result);
    });
  });

  describe('getPostById', () => {
    it('should return a single post by id', async () => {
      const result = {
        id: '1',
        title: 'First Post',
        description: 'This is the first post',
        author: 'User test',
        isDraft: false,
      };
      jest.spyOn(service, 'getPostById').mockResolvedValue(result);

      expect(await controller.getPostById('1')).toBe(result);
    });

    it('should throw NotFoundException if post not found', async () => {
      jest
        .spyOn(service, 'getPostById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.getPostById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const newPost = {
        title: 'New Post',
        description: 'Description',
        author: 'User Test Two',
        isDraft: false,
      };

      jest
        .spyOn(service, 'createPost')
        .mockResolvedValue({ message: 'Post created successfully' });

      expect(await controller.createPost(newPost)).toStrictEqual({
        message: 'Post created successfully',
      });
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const updatedPost = { title: 'Updated Title' };

      jest
        .spyOn(service, 'updatePost')
        .mockResolvedValue({ message: 'Post updated successfully!' });

      expect(await controller.updatePost('1', updatedPost)).toStrictEqual({
        message: 'Post updated successfully!',
      });
    });
  });

  describe('deletePost', () => {
    it('should delete a post by id', async () => {
      jest
        .spyOn(service, 'deletePost')
        .mockResolvedValue({ message: 'Post deleted successfully!' });

      expect(await controller.deletePost('1')).toEqual({
        message: 'Post deleted successfully!',
      });
    });
  });

  describe('searchPosts', () => {
    it('should return posts that match the search keyword', async () => {
      const result = [
        {
          id: '1',
          title: 'First Post',
          description: 'This is the first post',
          author: 'User test',
          isDraft: false,
        },
      ];
      jest.spyOn(service, 'searchPosts').mockResolvedValue(result);

      expect(await controller.getPostsAdmin('test')).toBe(result);
    });

    it('should throw NotFoundException if no posts are found', async () => {
      jest
        .spyOn(service, 'searchPosts')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.getPostsAdmin('test')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
