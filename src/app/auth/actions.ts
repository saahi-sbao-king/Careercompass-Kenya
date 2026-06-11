'use server';

/**
 * Verifies a reCAPTCHA token using Google Cloud Recaptcha Enterprise REST API.
 * Specifically configured for project: career-navigator-00
 */
export async function verifyRecaptcha(token: string, action: string) {
  const projectID = "career-navigator-00";
  const siteKey = "6LcITm0sAAAAAHyJBIAJtqp4L6ixag3XrkaRMO_O";
  const apiKey = process.env.RECAPTCHA_API_KEY;
  
  if (!apiKey) {
    console.warn("[reCAPTCHA] RECAPTCHA_API_KEY is missing. Verification skipped in development.");
    // In dev mode, we allow the request to proceed if the key isn't set yet
    if (process.env.NODE_ENV === 'development') return { success: true, score: 0.9 };
    return { success: false, score: 0, error: "API Key missing" };
  }

  // Official ReCAPTCHA Enterprise assessment URL
  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectID}/assessments?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: {
          token: token,
          expectedAction: action,
          siteKey: siteKey,
        },
      }),
    });

    const data = await response.json();

    // Check token validity and action consistency
    if (data.tokenProperties && !data.tokenProperties.valid) {
      console.error(`[reCAPTCHA] Invalid token: ${data.tokenProperties.invalidReason}`);
      return { success: false, score: 0 };
    }

    if (data.tokenProperties && data.tokenProperties.action === action) {
      const score = data.riskAnalysis?.score || 0;
      console.log(`[reCAPTCHA] Assessment score for ${action}: ${score}`);
      return { success: true, score };
    } else {
      console.error(`[reCAPTCHA] Action mismatch or missing token properties. Expected: ${action}`);
      return { success: false, score: 0 };
    }
  } catch (err) {
    console.error("[reCAPTCHA] Server verification failed:", err);
    // Fallback for dev environment
    if (process.env.NODE_ENV === 'development') return { success: true, score: 0.9 };
    return { success: false, score: 0 };
  }
}
