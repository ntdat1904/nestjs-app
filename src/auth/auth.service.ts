import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  /**
   * This method is responsible for validating a user's credentials.
   *
   * @param {string} username - The username of the user to be validated.
   * @param {string} pass - The password of the user to be validated.
   *
   * @returns {Promise<any>} - If the user is found and the password matches, the method returns the user object excluding the password field. If the user is not found or the password does not match, the method returns null.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  /**
   * This function is responsible for generating a JWT token for a user.
   *
   * @param user - The user object for whom the JWT token needs to be generated.
   * The user object should contain at least a `username` and `userId` property.
   *
   * @returns An object containing the generated JWT token under the `access_token` property.
   *
   * @throws Will throw an error if the `user` object does not contain the required properties.
   */
  async login(user: any) {
    if (!user || !user.username || !user.userId) {
      throw new Error('Invalid user object');
    }

    const payload = { username: user.username, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
