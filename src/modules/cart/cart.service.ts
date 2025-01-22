import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CartService {
	constructor(private readonly prisma: PrismaService) {}

	async addItem(productId: number, userId: number) {
		const item = this.prisma.cart.upsert({
			where: {
				userId_productId: {
					userId: userId,
					productId: productId,
				},
			},
			update: {
				quantity: {
					increment: 1,
				},
			},
			create: {
				userId: userId,
				productId: productId,
				quantity: 1,
			},
			select: {
				userId: true,
				quantity: true,
				products: {
					select: {
						productName: true,
					},
				},
			},
		});

		if (!item) {
			throw new BadRequestException("Failed to add to the cart");
		}

		return item;
	}

	async updateItemQuantity(
		productId: number,
		userId: number,
		quantity: number,
	) {
		const cartItem = await this.prisma.cart.findUnique({
			where: {
				userId_productId: { userId, productId },
			},
		});

		if (!cartItem) {
			throw new NotFoundException("Item in cart not found!");
		}

		return this.prisma.cart.update({
			where: {
				id: cartItem.id,
			},
			data: {
				quantity,
			},
		});
	}

	async removeItem(productId: number, userId: number) {
		const item = await this.prisma.cart.findUnique({
			where: {
				userId_productId: { userId, productId },
			},
		});

		if (!item) {
			throw new NotFoundException("Item in cart is not found!");
		}

		return this.prisma.cart.delete({
			where: {
				id: item.id,
			},
		});
	}

	async getCartItems(userId: number, paginationDto: PaginationDto) {
		const { limit, page } = paginationDto;
		const offset = (page - 1) * limit;

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
			},
		});

		if (!user) {
			throw new NotFoundException("User not found!");
		}

		const cartItems = await this.prisma.cart.findMany({
			skip: offset,
			take: limit,

			where: {
				userId: user.id,
			},
			select: {
				quantity: true,
				products: {
					select: {
						id: true,
						productName: true,
						price: true,
						stock: true,
						productImages: {
							take: 1,
							select: {
								id: true,
								imageUrl: true,
							},
						},
					},
				},
			},
		});

		if (!cartItems) {
			throw new NotFoundException("Cart not found!");
		}

		const totalCount = await this.prisma.cart.count();
		const totalPages = Math.ceil(totalCount / limit);
		return {
			data: cartItems,
			totalCount,
			totalPages,
			currentPage: page,
		};
	}
}
