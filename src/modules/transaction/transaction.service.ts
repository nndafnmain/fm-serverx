import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTrxDto } from "./dto/create-trx.dto";
import { nanoid } from "nanoid";
import {
	MIDTRANS_APP_URL,
	MIDTRANS_SERVER_KEY,
} from "src/common/libs/constants";

@Injectable()
export class TransactionService {
	constructor(private readonly prisma: PrismaService) {}

	async createTransaction(trxDto: CreateTrxDto) {
		const { userId, productId, qty } = trxDto;
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				username: true,
				email: true,
				id: true,
			},
		});

		if (!user) throw new NotFoundException("User is not found");

		const userCart = await this.prisma.cart.findMany({
			where: {
				userId: userId,
			},
			select: {
				quantity: true,
				products: {
					select: {
						id: true,
						productName: true,
						price: true,
						weight: true,
					},
				},
			},
		});

		if (userCart.length === 0) throw new BadRequestException("Cart is empty");

		const gross_amount = userCart.reduce(
			(acc, product) => acc + product.products.price * product.quantity,
			0,
		);

		const totalWeight = userCart.reduce(
			(acc, product) => acc + product.products.weight * product.quantity,
			0,
		);

		const items = userCart.map((product) => ({
			id: product.products.id,
			name: product.products.productName,
			price: product.products.price,
			quantity: product.quantity,
			weight: totalWeight,
		}));

		const trxId = `TRX-${nanoid(4)}-${nanoid(8)}`;

		const payload = {
			transaction_details: {
				order_id: trxId,
				gross_amount,
			},
			item_details: items,
			customer_details: {
				name: user.username,
				email: user.email,
			},
		};

		const authString = btoa(`${MIDTRANS_SERVER_KEY}`);

		const response = await fetch(`${MIDTRANS_APP_URL}/snap/v1/transactions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Basic ${authString}`,
			},
			body: JSON.stringify(payload),
		});

		if (response.status !== 201)
			throw new BadRequestException("Failed to create midtrans data");

		const data = await response.json();

		const trxResult = await this.prisma.$transaction(async (prisma) => {
			const newOrder = await prisma.order.create({
				data: {
					orderCode: trxId,
					totalPrice: gross_amount,
					totalWeight: totalWeight,
					status: "WAITING_FOR_PAYMENT",
					userId: user.id,
				},
				select: {
					users: {
						select: {
							username: true,
							email: true,
						},
					},
					id: true,
					orderCode: true,
					totalPrice: true,
					totalWeight: true,
					status: true,
				},
			});
			const newOrderItem = await prisma.orderItems.createMany({
				data: items.map((item) => ({
					quantity: item.quantity,
					total: gross_amount,
					totalWeight: totalWeight,
					orderId: newOrder.id,
					productId: item.id,
					discValue: 0,
					originalPrice: item.price,
				})),
			});
			return {
				newOrder,
				newOrderItem,
			};
		});
		console.log("PAYLOAD BOSS: ", payload);
		console.log("TOTAL", gross_amount);
		console.log("cart", userCart);
		console.log("TOKEN:", data.token);
		console.log("URL:", data.redirect_url);
		console.log("cart", trxResult);
		return {
			status: "success",
			data: {
				trxResult,
				snap_token: data.token,
				snap_redirect_url: data.redirect_url,
			},
		};
	}
}
