import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      login?: string | null;
      isAdmin?: boolean;
    };
  }

  interface User {
    id: string;
    isAdmin: boolean;
  }
}
