import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { hash } from "bcrypt";
import { generateReferral } from "src/common/libs/create-referral";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async findOne(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
			select: {
				id: true,
				email: true,
				password: true,
				role: true,
			},
		});

		if (!user) throw new NotFoundException("user is not found");

		return user;
	}

	async create(data: CreateUserDto) {
		const isExist = await this.prisma.user.findFirst({
			where: {
				email: data.email,
			},
			select: {
				email: true,
			},
		});

		if (isExist)
			throw new ConflictException("User with the email already exist!");

		const hashedPassword = await hash(data.password, 10);
		const userReferral = generateReferral();

		const user = await this.prisma.user.create({
			data: {
				email: data.email,
				username: data.username,
				password: hashedPassword,
				referralCode: userReferral,
				avatar: data.avatar ? data.avatar : "",
			},
			select: {
				username: true,
				referralCode: true,
				email: true,
			},
		});

		if (!user) throw new BadRequestException("Failed to create new user!");

		return user;
	}
}
