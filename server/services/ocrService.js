import axios from 'axios';

const VERYFI_URL = 'https://api.veryfi.com/api/v8/partner/documents';

const VERYFI_CLIENT_ID = process.env.VERYFI_CLIENT_ID;
const VERYFI_AUTHORIZATION = process.env.VERYFI_AUTHORIZATION;

export async function scanReceipt(fileBuffer, filename) {
  try {
    const formData = new FormData();
    formData.append('file', fileBuffer, filename);

    const response = await axios.post(VERYFI_URL, formData, {
      headers: {
        'Client-Id': VERYFI_CLIENT_ID,
        'Authorization': VERYFI_AUTHORIZATION,
        ...formData.getHeaders(),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error calling Veryfi API:', error.response?.data || error.message);
    throw error;
  }
}
