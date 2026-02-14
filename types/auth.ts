export interface AuthPostBody {
  action: "list_solvers" | "register" | "login";
  username: string;
  password: string;
  userType: "solver" | "creator";
  creatorUsername: string;
}
