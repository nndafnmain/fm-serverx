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
import { AddItemDto, UpdateItemDto } from "./dto/add-item.dto";

@Controller("api/cart")
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Post("add")
	async addItem(@Body() addItemDto: AddItemDto) {
		const { productId, userId } = addItemDto;
		return this.cartService.addItem(Number(productId), Number(userId));
	}

	@Post("update")
	async updateItemQuantity(@Body() updateItemDto: UpdateItemDto) {
		const { productId, userId, quantity } = updateItemDto;

		if (quantity <= 0) {
			return this.cartService.removeItem(Number(productId), Number(userId));
		}

		return this.cartService.updateItemQuantity(
			Number(productId),
			Number(userId),
			Number(quantity),
		);
	}

	@Delete("delete/:userId/:productId")
	async removeItem(
		@Param("productId") productId: number,
		@Param("userId") userId: number,
	) {
		return await this.cartService.removeItem(Number(productId), Number(userId));
	}

	@Get(":userId")
	async getCartItems(
		@Param("userId") userId: number,
		@Query() paginationDto: PaginationDto,
	) {
		return await this.cartService.getCartItems(Number(userId), paginationDto);
	}
}
