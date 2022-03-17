import { ExecutionContext, Injectable } from "@nestjs/common";
import { CanActivate } from '@nestjs/common';
import { Request } from "express";
import { Observable } from "rxjs";

// @Injectable()
// export class AuthGuard implements CanActivate {
//     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//         const req = context.switchToHttp().getRequest<Request>()
//         const authHeader = req.headers.authorization
//         const token = authHeader.split(" ")[1]
//     }

// }