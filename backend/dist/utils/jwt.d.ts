export interface JwtPayload {
    userId: string;
    roleId: string;
    roleName: string;
}
export declare function generateToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): JwtPayload;
//# sourceMappingURL=jwt.d.ts.map