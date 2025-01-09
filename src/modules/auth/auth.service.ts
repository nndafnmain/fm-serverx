import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Roles } from "@prisma/client";
import { UsersService } from "src/modules/users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { compare } from "bcrypt";

export interface IPayload {
	id: number;
	email: string;
	role: Roles;
}

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.userService.findOne(email);

		const isMatch = await compare(password, user.password);

		if (!isMatch) throw new UnauthorizedException("Invalid credentials");

		return user;
	}

	async login(user: IPayload) {
		const payload = { id: user.id, email: user.email, role: user.role };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async register(data: CreateUserDto) {
		const userRegister = await this.userService.create({
			email: data.email,
			username: data.username,
			password: data.password,
			avatar: data.avatar,
		});
		return userRegister;
	}
}
