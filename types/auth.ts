export interface AuthRequestBody {
  action: "register" | "login" | "list_solvers";
  username?: string;
  password?: string;
  userType?: "creator" | "solver";
  creatorUsername?: string;
}

export interface HashPasswordParams {
  password: string;
}

export interface VerifyPasswordParams extends HashPasswordParams {
  hash: string;
}
