import QRCode from 'qrcode';
import { ref, onUnmounted } from 'vue';

// TOTP configuration
const TOTP_CONFIG = {
  digits: 6,
  timeStep: 30, // seconds
};

export function useOneTimeQrCode() {
  const qrDataUrl = ref<string>('');
  const expiryTimestamp = ref<number>(0);
  const timeLeft = ref<number>(0);
  const isLoading = ref<boolean>(false);
  let intervalId: NodeJS.Timeout | null = null;

  /**
   * Convert string to Uint8Array
   */
  const stringToBytes = (str: string): Uint8Array => {
    return new TextEncoder().encode(str);
  };

  /**
   * Generate HMAC using Web Crypto API
   */
  const generateHMAC = async (key: Uint8Array, message: Uint8Array): Promise<ArrayBuffer> => {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    return crypto.subtle.sign('HMAC', cryptoKey, message);
  };

  /**
   * Generates a time-based one-time password token for a user
   * @param userId The ID of the user
   * @param secret An optional secret. If not provided, one will be generated based on the userId
   * @returns The generated token
   */
  const generateToken = async (userId: string, secret?: string): Promise<string> => {
    try {
      const userSecret = secret || `LabSyncro-${userId}-${new Date().toISOString().split('T')[0]}`;
      const counter = Math.floor(Date.now() / 1000 / TOTP_CONFIG.timeStep);
      
      // Convert counter to 8-byte buffer
      const counterBytes = new Uint8Array(8);
      let tempCounter = counter;
      for (let i = counterBytes.length - 1; i >= 0; i--) {
        counterBytes[i] = tempCounter & 0xff;
        tempCounter >>= 8;
      }

      const hmac = await generateHMAC(stringToBytes(userSecret), counterBytes);
      const hmacArray = new Uint8Array(hmac);
      
      // Get offset from last nibble
      const offset = hmacArray[hmacArray.length - 1] & 0xf;
      
      // Generate 4-byte code from HMAC
      let code = 
        ((hmacArray[offset] & 0x7f) << 24) |
        (hmacArray[offset + 1] << 16) |
        (hmacArray[offset + 2] << 8) |
        hmacArray[offset + 3];

      // Get last n digits
      code = code % Math.pow(10, TOTP_CONFIG.digits);
      
      // Pad with leading zeros if needed
      return code.toString().padStart(TOTP_CONFIG.digits, '0');
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  };

  /**
   * Verify a token against expected values
   * @param token The token to verify
   * @param userId The userId that was used to generate the token
   * @param secret Optional secret used when generating the token
   * @returns True if the token is valid, false otherwise
   */
  const verifyToken = async (token: string, userId: string, secret?: string): Promise<boolean> => {
    try {
      const currentToken = await generateToken(userId, secret);
      return token === currentToken;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  };

  /**
   * Generate a QR code containing a one-time token for a user
   * @param userId The ID of the user  
   * @param extraData Optional additional data to include in the QR code
   */
  const generateQrCode = async (userId: string, extraData?: Record<string, any>) => {
    try {
      isLoading.value = true;
      
      // Generate token
      const token = await generateToken(userId);
      
      // Calculate token expiry time
      const now = Math.floor(Date.now() / 1000);
      const step = TOTP_CONFIG.timeStep;
      expiryTimestamp.value = (Math.floor(now / step) + 1) * step * 1000;
      
      // Create data object to be encoded in QR code 
      const qrData = JSON.stringify({
        token,
        userId,
        timestamp: Date.now(),
        expiry: expiryTimestamp.value,
        ...extraData,
      });
      
      // Generate QR code as data URL
      qrDataUrl.value = await QRCode.toDataURL(qrData);
      
      // Start the countdown
      startCountdown();
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Start countdown for token expiry 
   */
  const startCountdown = () => {
    // Clear any existing interval
    if (intervalId) clearInterval(intervalId);
    
    // Update time left on interval
    intervalId = setInterval(() => {
      const now = Date.now();
      if (now >= expiryTimestamp.value) {
        // Token expired, regenerate
        timeLeft.value = 0;
        if (intervalId) clearInterval(intervalId);
      } else {
        timeLeft.value = Math.floor((expiryTimestamp.value - now) / 1000);
      }
    }, 1000);
  };

  /**
   * Handle a scanned QR code to verify the token inside
   * @param scannedQrData The data from the scanned QR code
   * @returns The user ID and any extra data if verification succeeds, null otherwise
   */
  const verifyScannedQrCode = async (scannedQrData: string): Promise<{ userId: string; extraData?: any } | null> => {
    try {
      // Parse the QR data
      const qrData = JSON.parse(scannedQrData);
      const { token, userId, timestamp, expiry, ...extraData } = qrData;
      
      // Check if token has expired
      if (Date.now() > expiry) {
        console.error('Token has expired');
        return null;
      }
      
      // Verify the token
      const isValid = await verifyToken(token, userId);
      if (!isValid) {
        console.error('Invalid token');
        return null;
      }
      
      // Token is valid, return user ID and any extra data
      return { userId, extraData };
    } catch (error) {
      console.error('Error verifying QR code:', error);
      return null;
    }
  };

  /**
   * Clean up resources when component unmounts
   */
  const cleanUp = () => {
    if (intervalId) clearInterval(intervalId);
    qrDataUrl.value = '';
    expiryTimestamp.value = 0;
    timeLeft.value = 0;
  };

  onUnmounted(() => {
    cleanUp();
  });

  return {
    qrDataUrl,
    timeLeft,
    isLoading,
    generateToken,
    verifyToken,
    generateQrCode,
    verifyScannedQrCode,
    cleanUp,
  };
}
