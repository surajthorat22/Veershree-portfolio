import { Body, Controller, Inject, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import type { LoginDto } from "./auth.dto";

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  @Post("login")
  async login(@Body() body: LoginDto) {
    return await this.auth.login(body.username, body.password);
  }
}
