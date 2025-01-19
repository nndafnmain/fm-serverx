import { ProductCategory } from "@prisma/client";
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	productName: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsString()
	@IsNotEmpty()
	longDesc: string;

	@IsString()
	@IsNotEmpty()
	color: string;

	@IsString()
	@IsNotEmpty()
	type: string;

	@Transform(({ value }) => Number(value))
	@IsInt()
	@IsNotEmpty()
	@Min(0)
	price: number;

	@Transform(({ value }) => Number(value))
	@IsInt()
	@IsNotEmpty()
	@Min(0)
	stock: number;

	@Transform(({ value }) => Number(value))
	@IsInt()
	@IsNotEmpty()
	@Min(1)
	weight: number;

	@IsString()
	@IsNotEmpty()
	productCategory: ProductCategory;
}
// export class CreateProductDto {
// 	@IsNotEmpty()
// 	productName: string;

// 	@IsNotEmpty()
// 	description: string;

// 	@IsNotEmpty()
// 	longDesc: string;

// 	@IsNotEmpty()
// 	color: string;

// 	@IsNotEmpty()
// 	type: string;

// 	@IsNumber()
// 	price: number;

// 	@IsNumber()
// 	stock: number;

// 	@IsNumber()
// 	weight: number;

// 	@IsNotEmpty()
// 	productCategory: string;
// }
