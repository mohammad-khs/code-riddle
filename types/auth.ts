export interface AuthPostBody {
  action: "register" | "login" | "list_solvers";
  username?: string;
  password?: string;
  userType?: "creator" | "solver";
  creatorUsername?: string;
}

export interface HashPassword {
  password: string;
}

export interface VerifyPassword extends HashPassword {
  hash: string;
}
