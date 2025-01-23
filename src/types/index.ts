import { User, Game, SignupStatus } from "@prisma/client";

export type SafeUser = Omit<User, "password"> & {
  password?: undefined;
};

export interface GameWithSignups extends Game {
  signups: {
    user: SafeUser;
    status: SignupStatus;
  }[];
  _count: {
    signups: number;
  };
}

export interface UserWithGames extends SafeUser {
  gameSignups: {
    game: Game;
    status: SignupStatus;
  }[];
}
