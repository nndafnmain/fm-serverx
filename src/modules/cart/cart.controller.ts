import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { AddItemDto, DecItemDto } from "./dto/add-item.dto";

@Controller("api/cart")
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Post("increment")
	async addItem(@Body() addItemDto: AddItemDto) {
		const { productId, userId } = addItemDto;
		return this.cartService.addItem(Number(productId), Number(userId));
	}

	@Post("decrement")
	async decreaseItem(@Body() decItemDto: DecItemDto) {
		const { productId, userId } = decItemDto;
		return await this.cartService.decreaseItem(
			Number(productId),
			Number(userId),
		);
	}

	@Delete(":productId")
	async removeItem(
		@Param("productId") productId: number,
		@Body() userId: number,
	) {
		return await this.cartService.removeItem(productId, userId);
	}

	@Get(":userId")
	async getCartItems(
		@Param("userId") userId: number,
		@Query() paginationDto: PaginationDto,
	) {
		console.log(userId);

		return await this.cartService.getCartItems(Number(userId), paginationDto);
	}
}
