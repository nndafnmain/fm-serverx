import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CartService {
	constructor(private readonly prisma: PrismaService) {}

	async addItem(productId: number, userId: number, quantity: number) {
		return this.prisma.cart.upsert({
			where: {
				userId_productId: {
					userId: userId,
					productId: productId,
				},
			},
			update: {
				quantity: {
					increment: quantity,
				},
			},
			create: {
				userId: userId,
				productId: productId,
				quantity: quantity,
				storeId: 1,
			},
		});
	}
}
