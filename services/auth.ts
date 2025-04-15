export const authService = {
  async verifyQrToken(token: string, userId: string, timestamp: number): Promise<{ 
    success: boolean;
    user: {
      id: string;
      name: string;
      email: string;
      tel?: string;
      avatar?: string;
      last_active_at?: string;
      roles: Array<{ name: string; key: string; }>;
    }
  }> {
    return await $fetch('/api/auth/qr-tokens/verify', {
      method: 'POST',
      body: {
        token,
        userId,
        timestamp
      }
    });
  },

  async authenticateDevice(hmiCode: string): Promise<{
    success: boolean;
    user: {
      id: string;
      name: string;
      email: string;  
    }
  }> {
    return await $fetch('/api/auth/hmi/authenticate', {
      method: 'POST',
      body: { hmiCode }
    });
  }
}; 