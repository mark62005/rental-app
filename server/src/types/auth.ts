import { JwtPayload } from "jsonwebtoken";

export interface IDecodedToken extends JwtPayload {
	sub: string;
	"custom:role"?: string;
}
