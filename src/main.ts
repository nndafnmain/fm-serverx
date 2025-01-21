import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { PrismaClient } from "@prisma/client";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
			validationError: { target: false },
		}),
	);

	app.useGlobalFilters(new GlobalExceptionFilter());
	app.enableCors({
		// origin: "http://localhost:5173",
		// methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	});
	const prisma = new PrismaClient({
		log: ["query", "info", "warn", "error"],
	});
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
