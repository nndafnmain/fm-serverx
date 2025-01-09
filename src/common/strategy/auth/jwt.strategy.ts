import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IPayload } from "src/modules/auth/auth.service";

export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: "FIRZA12345",
		});
	}

	async validate(payload: IPayload) {
		return {
			id: payload.id,
			email: payload.email,
			role: payload.role,
		};
	}
}
