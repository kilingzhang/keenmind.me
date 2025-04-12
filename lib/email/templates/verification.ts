export interface VerificationTemplateParams {
    url: string;
    host: string;
}

export const getVerificationHtml = ({ url, host }: VerificationTemplateParams) => `
    <div style="background-color: #f6f9fc; padding: 40px 0;">
        <div style="max-width: 560px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <img src="https://authjs.dev/img/logo.png" width="40" height="40" style="margin-bottom: 20px"/>
            <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px;">Login Verification</h1>
            <p style="color: #666; font-size: 16px; margin: 0 0 30px; line-height: 24px;">
                Please click the button below to complete login verification. If you did not request this verification, please ignore this email.
            </p>
            <div style="text-align: center;">
                <a href="${url}" 
                   style="display: inline-block; background-color: #2563eb; color: white; font-weight: 500; padding: 12px 32px; border-radius: 6px; text-decoration: none;">
                    Verify Login
                </a>
            </div>
            <p style="color: #666; font-size: 14px; margin: 30px 0 0;">
                If the button doesn't work, please copy and paste the following link in your browser:<br/>
                <a href="${url}" style="color: #2563eb; text-decoration: none; word-break: break-all;">
                    ${url}
                </a>
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;"/>
            <p style="color: #999; font-size: 12px; margin: 0;">
                This is an automated message, please do not reply.
            </p>
        </div>
    </div>
`;

export const getVerificationText = ({ url, host }: VerificationTemplateParams) => `
    Login Verification
    
    Please click the following link to complete login verification:
    ${url}
    
    If you did not request this verification, please ignore this email.
`; 