import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

const SECRET_KEY = environment.SECRET_KEY ?? "your-secret-key-123";

export class CryptoService {
    static encrypt(value: string): string {
        return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
    }

    static decrypt(value: string): string {
        try {
            const bytes = CryptoJS.AES.decrypt(value, SECRET_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            return '';
        }
    }
}
