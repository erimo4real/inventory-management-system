import UserRepository from '../repositories/UserRepository.js';
import UploadService from './UploadService.js';

const userRepo = new UserRepository();

export default class ProfileService {
  static async updateAvatar(userId, file) {
    const user = await userRepo.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    if (user.avatar_public_id) {
      try {
        await UploadService.deleteImage(user.avatar_public_id);
      } catch (err) {
        console.error('[ProfileService] Failed to delete old avatar:', err.message);
      }
    }

    const result = await UploadService.uploadImage(file, { folder: 'avatars' });

    await userRepo.updateAvatar(userId, result.url, result.public_id);

    return { avatar_url: result.url };
  }
}
