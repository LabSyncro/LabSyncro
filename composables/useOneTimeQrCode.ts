import QRCode from 'qrcode';
import { useToast } from 'vue-toastification';
import { authService } from '~/services/auth';

const toast = useToast();

const TOTP_CONFIG = {
  digits: 6,
  timeStep: 60,
};

export function useOneTimeQrCode() {
  const qrDataUrl = ref<string>('');
  const expiryTimestamp = ref<number>(0);
  const timeLeft = ref<number>(0);
  const isLoading = ref<boolean>(false);
  let intervalId: NodeJS.Timeout | null = null;

  const stringToBytes = (str: string): Uint8Array => {
    return new TextEncoder().encode(str);
  };

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

      code = code % Math.pow(10, TOTP_CONFIG.digits);

      return code.toString().padStart(TOTP_CONFIG.digits, "0");
    } catch (error) {
      toast.error(`Lỗi khi tạo mã QR: ${error}`);
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
      toast.error(`Lỗi khi xác thực mã QR: ${error}`);
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
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      
      isLoading.value = true;
      const token = await generateToken(userId);
      
      const now = Date.now();
      const newExpiryTimestamp = now + (TOTP_CONFIG.timeStep * 1000);
      
      const qrData = JSON.stringify({
        token,
        userId,
        timestamp: now,
        expiry: newExpiryTimestamp,
        ...extraData,
      });
      
      qrDataUrl.value = await QRCode.toDataURL(qrData);
      expiryTimestamp.value = newExpiryTimestamp;
      timeLeft.value = TOTP_CONFIG.timeStep;
      
    } catch (error) {
      toast.error(`Lỗi khi tạo mã QR: ${error}`);
      qrDataUrl.value = '';
      expiryTimestamp.value = 0;
      timeLeft.value = 0;
    } finally {
      isLoading.value = false;
    }
  };

  const startCountdown = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    if (expiryTimestamp.value > Date.now()) {
      const initialTimeLeft = Math.max(0, Math.floor((expiryTimestamp.value - Date.now()) / 1000));
      if (timeLeft.value !== initialTimeLeft) {
        timeLeft.value = initialTimeLeft;
      }

      intervalId = setInterval(() => {
        const now = Date.now();
        if (now >= expiryTimestamp.value) {
          timeLeft.value = 0;
          clearInterval(intervalId!);
          intervalId = null;
        } else {
          const newTimeLeft = Math.max(0, Math.floor((expiryTimestamp.value - now) / 1000));
          if (timeLeft.value !== newTimeLeft) {
            timeLeft.value = newTimeLeft;
          }
        }
      }, 1000);
    } else {
      timeLeft.value = 0;
    }
  };

  /**
   * Handle a scanned QR code to verify the token inside
   * @param scannedQrData The data from the scanned QR code
   * @returns The user information and any extra data if verification succeeds, null otherwise
   */
  const verifyScannedQrCode = async (scannedQrData: string): Promise<{
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
      tel?: string;
      avatar?: string;
      last_active_at?: string;
      roles: Array<{ name: string; key: string; }>;
    };
    extraData?: Record<string, any>;
  } | null> => {
    try {
      const qrData = JSON.parse(scannedQrData);
      const { token, userId, timestamp, expiry, ...extraData } = qrData;
      
      if (Date.now() > expiry) {
        toast.error("Mã QR đã hết hạn");
        return null;
      }

      const isValid = await verifyToken(token, userId);
      if (!isValid) {
        toast.error("Mã QR không hợp lệ");
        return null;
      }

      try {
        const result = await authService.verifyQrToken(token, userId, timestamp);
        return {
          userId,
          user: result.user,
          extraData: Object.keys(extraData).length > 0 ? extraData : undefined
        };
      } catch (error: any) {
        if (error.statusCode === 403) {
          toast.error("Mã QR đã được sử dụng");
        } else {
          toast.error("Lỗi khi xác thực mã QR");
        }
        return null;
      }
    } catch (error) {
      toast.error(`Lỗi khi xác thực mã QR: ${error}`);
      return null;
    }
  };

  const cleanUp = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    qrDataUrl.value = '';
    expiryTimestamp.value = 0;
    timeLeft.value = 0;
    isLoading.value = false;
  };

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });

  return {
    qrDataUrl,
    timeLeft,
    isLoading,
    generateToken,
    verifyToken,
    generateQrCode,
    verifyScannedQrCode,
    startCountdown,
    cleanUp,
  };
}
