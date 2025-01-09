import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "../../common/guards/local-auth.guard";
import { CreateUserDto } from "../users/dto/create-user.dto";

@Controller("api/auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post("/login")
	async login(
		@Body() { email, password }: { email: string; password: string },
	) {
		const user = await this.authService.validateUser(email, password);
		return this.authService.login(user);
	}

	@Post("/register")
	async register(@Body() data: CreateUserDto) {
		return await this.authService.register({
			email: data.email,
			password: data.password,
			username: data.password,
			avatar: data.avatar,
		});
	}
}
