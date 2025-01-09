import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
} from "class-validator";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@Length(6)
	password: string;

	@IsOptional()
	@IsString()
	avatar?: string;
}
