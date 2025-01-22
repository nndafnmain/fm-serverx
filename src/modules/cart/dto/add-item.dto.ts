import { IsNumber } from "class-validator";

export class AddItemDto {
	@IsNumber()
	productId: number;
	@IsNumber()
	userId: number;
}

export class UpdateItemDto {
	@IsNumber()
	productId: number;
	@IsNumber()
	userId: number;
	@IsNumber()
	quantity: number;
}
