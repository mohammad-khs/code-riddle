export interface Riddle {
  id: string;
  question: string;
  answer: string;
  media?: string;
  mediaType?: string;
}

export interface RiddleSet {
  id: string;
  riddles: Riddle[];
  mainMusic?: string;
}

export interface Prize {
  id: string;
  letter: string;
  music?: string;
  backgroundImage?: string;
}

export interface SubmitResponse {
  success: boolean;
  message?: string;
  prize?: Prize;
  error?: string;
}

export interface RiddlesApiResponse {
  riddleSet?: RiddleSet;
  error?: string;
}
