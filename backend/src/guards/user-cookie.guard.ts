import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

interface RequestWithUserId extends Request {
  userId?: string;
}

@Injectable()
export class UserCookieGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUserId>();
    const cookies = request.cookies as Record<string, string> | undefined;
    const userId = cookies?.userId;

    // Se o userId for "[object Object]", tentar fazer parse
    if (userId === '[object Object]') {
      console.error(
        'ERRO: Cookie userId foi salvo incorretamente como string "[object Object]"',
      );
      console.error(
        'O cookie precisa ser limpo. Por favor, faça login novamente.',
      );
      throw new UnauthorizedException(
        'Cookie de usuário inválido. Por favor, faça login novamente.',
      );
    }

    if (!userId || typeof userId !== 'string') {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    request.userId = userId;
    return true;
  }
}
