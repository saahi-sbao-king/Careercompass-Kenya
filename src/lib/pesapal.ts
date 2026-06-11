'use server';

/**
 * @fileOverview PesaPal V3 API Integration for Kenyan Payments.
 * FORCED TO LIVE PRODUCTION ENVIRONMENT.
 * 
 * Credentials: 
 * Key: YDa82FrHOVqWntReTpS5peUiCvRYu8zM
 * Secret: x5RTmWwMhHB3JHQQzrF1gED0LeE=
 */

const PESAPAL_URL = 'https://www.pesapal.com/pesapalv3';
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || 'YDa82FrHOVqWntReTpS5peUiCvRYu8zM'; 
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET || 'x5RTmWwMhHB3JHQQzrF1gED0LeE=';

async function getAuthToken() {
  try {
    const response = await fetch(`${PESAPAL_URL}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
      },
      body: JSON.stringify({ 
        consumer_key: CONSUMER_KEY, 
        consumer_secret: CONSUMER_SECRET 
      }),
      cache: 'no-store'
    });
    
    if (!response.ok) return null;
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('[PesaPal Auth Error]', error);
    return null;
  }
}

async function registerIPN(token: string) {
  try {
    const baseUrl = 'https://career-navigator-00.web.app';
    const ipnUrl = `${baseUrl}/api/pesapal/ipn`;

    const response = await fetch(`${PESAPAL_URL}/api/URLRegister/RegisterIPN`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: 'GET'
      }),
      cache: 'no-store'
    });
    
    const data = await response.json();
    return data.ipn_id || null;
  } catch (error) {
    return null;
  }
}

export async function initiatePayment(orderData: {
  amount: number;
  email: string;
  phoneNumber: string;
  name: string;
  description: string;
  callbackUrl: string;
}) {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, error: 'Strategic authentication failed.' };

    const ipnId = await registerIPN(token);
    if (!ipnId) return { success: false, error: 'IPN registration failed.' };

    const merchantReference = `CCK-${Date.now()}`;
    
    const payload = {
      id: merchantReference,
      currency: 'KES',
      amount: orderData.amount,
      description: orderData.description,
      callback_url: orderData.callbackUrl,
      notification_id: ipnId,
      billing_address: {
        email_address: orderData.email,
        phone_number: orderData.phoneNumber,
        country_code: "KE",
        first_name: orderData.name.split(' ')[0] || 'Scholar',
        last_name: orderData.name.split(' ')[1] || 'User'
      }
    };

    const response = await fetch(`${PESAPAL_URL}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    const result = await response.json();
    
    if (result.redirect_url) {
      return {
        success: true,
        redirectUrl: result.redirect_url,
        orderTrackingId: result.order_tracking_id,
        merchantReference
      };
    }
    return { success: false, error: result.message || 'Failed to generate checkout link.' };
  } catch (err) {
    return { success: false, error: 'Connection error. Please try again.' };
  }
}

export async function checkTransactionStatus(orderTrackingId: string) {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${PESAPAL_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}
