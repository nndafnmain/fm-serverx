import { Body, Controller, Post } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { CreateTrxDto } from "./dto/create-trx.dto";

@Controller("api/transaction")
export class TransactionController {
	constructor(private readonly trxService: TransactionService) {}

	@Post("/create")
	async createTrx(@Body() trxDto: CreateTrxDto) {
		return await this.trxService.createTransaction(trxDto);
	}
}
