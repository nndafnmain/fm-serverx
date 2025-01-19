import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class PaginationDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt({ message: "Page must be an integer." })
	@Min(1, { message: "Page must be greater than or equal to 1." })
	page?: number = 1;

	@IsOptional()
	@Type(() => Number)
	@IsInt({ message: "Limit must be an integer." })
	@Min(1, { message: "Limit must be greater than or equal to 1." })
	limit?: number = 10;
}
