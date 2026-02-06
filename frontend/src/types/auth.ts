// Types for Google OAuth configuration
export interface AuthOptions {
  providers: Provider[];
  callbacks: AuthCallbacks;
  pages: AuthPages;
  session: SessionConfig;
  jwt: JWTConfig;
}

export interface Provider {
  id: string;
  name: string;
  type: string;
  clientId: string;
  clientSecret: string;
  authorization: {
    url: string;
    params: {
      prompt: string;
      access_type: string;
      response_type: string;
    };
  };
  token: {
    url: string;
  };
  userinfo: {
    url: string;
    async request(context: { provider: Provider; tokens: TokenSet; }): Promise<User> {
      return context.tokens.access_token ? {
        id: '',
        name: '',
        email: '',
        image: '',
      } : {
        id: '',
        name: '',
        email: '',
        image: '',
      };
    };
  };
  id: string;
  name: string;
  type: string;
  clientId: string;
  clientSecret: string;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface TokenSet {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  expires_at?: number;
}

export interface Session {
  user?: User;
  expires?: string;
  accessToken?: string;
}

export interface JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthCallbacks {
  signIn?: (user: User, account: Account) => Promise<boolean>;
  jwt?: (token: JWT, user: User | null, account: Account | null) => Promise<JWT>;
  session?: (session: Session, token: JWT) => Promise<Session>;
}

export interface AuthPages {
  signIn?: string;
  error?: string;
}

export interface SessionConfig {
  strategy: 'jwt' | 'database';
  maxAge?: number;
}

export interface JWTConfig {
  maxAge?: number;
}

export interface Account {
  provider: string;
  providerAccountId: string;
  type: string;
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  expires_at?: number;
}
