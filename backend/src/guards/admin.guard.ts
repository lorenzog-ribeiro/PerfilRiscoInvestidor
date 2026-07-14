import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Protege endpoints administrativos (ex: listar todas as respostas).
 * Exige o header `x-admin-key` igual a process.env.ADMIN_API_KEY.
 * Se a variável não estiver definida, o acesso é sempre negado (fail-closed).
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expected = process.env.ADMIN_API_KEY;
    if (!expected) {
      throw new ForbiddenException('Admin access disabled');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.headers['x-admin-key'];

    if (typeof provided !== 'string' || provided !== expected) {
      throw new ForbiddenException('Invalid admin key');
    }

    return true;
  }
}
