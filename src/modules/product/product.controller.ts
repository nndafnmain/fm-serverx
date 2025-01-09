import { Controller } from "@nestjs/common";
import { R2Service } from "../r2/r2.service";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("product")
export class ProductController {
	constructor(
		private readonly r2Service: R2Service,
		private readonly prisma: PrismaService,
	) {}
}
