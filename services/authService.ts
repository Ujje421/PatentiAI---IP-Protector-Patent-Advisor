
import { User, UserRole } from '../types';

interface StoredUser extends User {
  passwordHash: string; // In a real app, this would be a bcrypt hash
  googleId?: string;
}

const STORAGE_KEY_USERS = 'patentiai_users_db';
const STORAGE_KEY_SESSION = 'patentiai_session';

// Helper to simulate network delay for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to decode Google JWT
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const authService = {
  /**
   * Register a new user
   */
  async register(name: string, email: string, password: string, role: UserRole): Promise<User> {
    await delay(800); // Simulate API latency
    
    const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    const users: StoredUser[] = usersStr ? JSON.parse(usersStr) : [];

    // Check if user already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Account already exists with this email address.");
    }

    const newUser: StoredUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      organizationId: `ORG-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      lastLogin: new Date().toISOString(),
      passwordHash: password // Storing plain text for this frontend-only demo
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    
    // Auto login after registration
    const { passwordHash, ...userWithoutPassword } = newUser;
    this.setSession(userWithoutPassword);
    
    return userWithoutPassword;
  },

  /**
   * Log in an existing user
   */
  async login(email: string, password: string): Promise<User> {
    await delay(800); // Simulate API latency

    const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    const users: StoredUser[] = usersStr ? JSON.parse(usersStr) : [];

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // Check for password match (unless it's a Google-only account trying to login with password - handled by passwordHash check)
    if (user.passwordHash !== password) {
       // If user has no password (google only) or wrong password
       throw new Error("Invalid email or password.");
    }

    // Update last login timestamp
    user.lastLogin = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

    const { passwordHash, ...userWithoutPassword } = user;
    this.setSession(userWithoutPassword);
    
    return userWithoutPassword;
  },

  /**
   * Handle Google OAuth Login
   */
  async loginWithGoogle(credential: string): Promise<User> {
    await delay(500); // Small processing delay
    
    const payload = parseJwt(credential);
    if (!payload) throw new Error("Invalid Google Credential");

    const { email, name, sub } = payload;
    
    const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    const users: StoredUser[] = usersStr ? JSON.parse(usersStr) : [];
    
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      // User exists, update Google ID if missing and log in
      if (!user.googleId) {
        user.googleId = sub;
      }
      user.lastLogin = new Date().toISOString();
    } else {
      // Create new user from Google info
      user = {
        id: Math.random().toString(36).substr(2, 9),
        name: name || email.split('@')[0],
        email,
        role: 'Inventor', // Default role for social login
        organizationId: `ORG-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        lastLogin: new Date().toISOString(),
        passwordHash: '', // No password for Google users
        googleId: sub
      };
      users.push(user);
    }

    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    
    const { passwordHash, ...userWithoutPassword } = user;
    this.setSession(userWithoutPassword);
    
    return userWithoutPassword;
  },

  /**
   * Log out the current user
   */
  logout() {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  },

  /**
   * Get the currently logged in user from session
   */
  getCurrentUser(): User | null {
    const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch (e) {
      return null;
    }
  },

  /**
   * Internal helper to save session
   */
  setSession(user: User) {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
  }
};
