import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    console.log("Sending contact email from:", email);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Send confirmation email to the user
    const userEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Heritage Guide <onboarding@resend.dev>",
        to: [email],
        subject: "We received your message - Heritage Guide",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Georgia', serif; line-height: 1.6; color: #2d2418; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { text-align: center; padding-bottom: 30px; border-bottom: 2px solid #c9a55c; }
              .logo { font-size: 28px; color: #5a4b35; font-weight: bold; }
              .content { padding: 30px 0; }
              .message-box { background: #f8f6f2; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; padding-top: 30px; border-top: 1px solid #e5ddd0; color: #8b7355; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🏛️ Heritage Guide</div>
              </div>
              <div class="content">
                <h2>Thank you for reaching out, ${name}!</h2>
                <p>We've received your message and our team will get back to you within 24-48 hours.</p>
                
                <div class="message-box">
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Your Message:</strong></p>
                  <p>${message.replace(/\n/g, '<br>')}</p>
                </div>
                
                <p>In the meantime, feel free to explore our virtual tours and discover more heritage sites!</p>
                <p>Best regards,<br>The Heritage Guide Team</p>
              </div>
              <div class="footer">
                <p>© 2024 Heritage Guide. All rights reserved.</p>
                <p>Discover the World's Cultural Treasures</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const userEmailData = await userEmailRes.json();
    console.log("User confirmation email sent:", userEmailData);

    if (!userEmailRes.ok) {
      throw new Error(userEmailData.message || "Failed to send email");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
