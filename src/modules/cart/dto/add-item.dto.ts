import { IsNumber } from "class-validator";

export class AddItemDto {
	@IsNumber()
	productId: number;
	@IsNumber()
	userId: number;
}

export class DecItemDto {
	@IsNumber()
	productId: number;
	@IsNumber()
	userId: number;
}
