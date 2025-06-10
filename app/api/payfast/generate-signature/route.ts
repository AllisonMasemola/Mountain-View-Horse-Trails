import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()
    
    // Log incoming payment data for debugging
    console.log('Received payment data for signature:', JSON.stringify(paymentData, null, 2));

    // Create a clean copy of the data, removing any empty values and the signature field
    const cleanData: Record<string, string> = {};
    
    // Only include non-empty string values
    Object.entries(paymentData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && key !== 'signature') {
        cleanData[key] = String(value);
      }
    });

    // Sort the keys alphabetically
    const sortedKeys = Object.keys(cleanData).sort();
    
    // Create the parameter string
    const paramString = sortedKeys
      .map(key => `${key}=${encodeURIComponent(cleanData[key]).replace(/%20/g, '+')}`)
      .join('&');

    // Get the passphrase from environment variables
    const passphrase = process.env.PAYFAST_PASSPHRASE || '';
    
    // Add passphrase if configured (PayFast expects passphrase to be included in the signature)
    const stringToSign = passphrase 
      ? `${paramString}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`
      : paramString;

    console.log('String to sign:', stringToSign);

    // Generate MD5 hash
    const signature = crypto
      .createHash('md5')
      .update(stringToSign)
      .digest('hex');

    console.log('Generated signature:', signature);

    return NextResponse.json({
      success: true,
      signature: signature,
    });
  } catch (error) {
    console.error("Signature generation error:", error);
    return NextResponse.json(
      { success: false, error: `Failed to generate signature: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
