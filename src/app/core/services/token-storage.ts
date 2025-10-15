import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode'; 

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
interface DecodedToken {
  sub: string; //users email
  roles: string[]; //array of roles
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getAccessToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void { 
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  
  public getUser(): any { 
    const token = this.getAccessToken();
    if (token) {
        const decoded: DecodedToken = jwtDecode(token);
        return { email: decoded.sub }; // Return at least the email
    }
    return {};
  }

  public getRole(): 'ADMIN' | 'STAFF' | 'USER' | null {
    const token = this.getAccessToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.authorities && decoded.authorities.length > 0) {
        const roleString = decoded.authorities[0]; 
        if (roleString.startsWith('ROLE_')) {
          return roleString.substring(5); // Returns "STAFF", "ADMIN", or "USER"
        }
        return roleString;
      }
    }
    return null;
  }
  
}