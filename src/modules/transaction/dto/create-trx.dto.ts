import { IsNumber, IsOptional } from "class-validator";

export class CreateTrxDto {
	@IsNumber()
	@IsOptional()
	productId: number;

	@IsNumber()
	userId: number;

	@IsNumber()
	@IsOptional()
	qty: number;
}
