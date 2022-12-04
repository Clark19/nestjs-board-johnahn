import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    console.log(111);
    const rst = ExtractJwt.fromAuthHeaderAsBearerToken();
    console.log(rst);
    console.log(222);
    super({
      secretOrKey: 'myAccessKey',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: true,
    });
  }

  async validate(req, payload) {
    const accToken = req.headers.authorization.replace('Bearer ', '');
    const { decodedAccToken } = this.verifyToken(accToken);

    const { username } = payload;

    const user: User = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) throw new UnauthorizedException();

    // return { username };
    return user;
  }

  verifyToken(accToken, refreshToken = null) {
    //LOGGING
    console.log(new Date(), ' | AuthService.verifyToken()');

    let decodedAccToken = null;
    // let decodedRefreshToken = null;
    try {
      // decodedAccToken = jwt.verify(accToken, process.env.ACCESS_TOKEN_KEY);
      decodedAccToken = jwt.verify(accToken, 'myAccessKey');
      // decodedRefreshToken = jwt.verify(
      //   refreshToken,
      //   process.env.REFRESH_TOKEN_KEY,
      // );

      const accTtl = Math.floor(
        (new Date(decodedAccToken.exp * 1000).getTime() -
          new Date().getTime()) /
          1000,
      );
      // console.log('밸리데이트', req.headers.authorization.replace('Bearer ', ''));
      console.log('밸리데이트accTtl', accTtl);
      if (accTtl < 0) {
        throw new UnauthorizedException('만료');
      }
    } catch (err) {
      throw new UnauthorizedException(
        `${err.message}, expiredAt: ${err.expiredAt}, errName: ${err.name}`,
      );
    }
    return { decodedAccToken };
  }
}
