// Tokens are kept in memory to prevent XSS theft via localStorage.
// For persistent sessions, the refresh token is stored in an HttpOnly cookie
// set by the server — never in JS-accessible storage.

let accessToken: string | null = null
let tokenExpiry: number | null = null

export const tokenService = {
  getAccessToken(): string | null {
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
      return accessToken
    }
    this.clearTokens()
    return null
  },

  setAccessToken(token: string, expiresInSeconds: number): void {
    accessToken = token
    tokenExpiry = Date.now() + expiresInSeconds * 1000
  },

  clearTokens(): void {
    accessToken = null
    tokenExpiry = null
  },

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null
  },
}
