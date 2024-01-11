export type JwtTokenObject = {
  user_id: string;
};

export interface TokenDecoded extends JwtTokenObject {
  iat: number;
  exp: number;
}
