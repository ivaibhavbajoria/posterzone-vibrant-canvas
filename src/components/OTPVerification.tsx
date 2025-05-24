
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

interface OTPVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onResendOTP: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerificationComplete,
  onResendOTP,
}) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    try {
      // Simulate OTP verification - in real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit code
      if (otp.length === 6) {
        toast.success("OTP verified successfully!");
        onVerificationComplete();
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await onResendOTP();
      toast.success("OTP sent successfully!");
      setOtp("");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
        <p className="text-center text-gray-600">
          We've sent a 6-digit code to {email}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        <Button 
          onClick={handleVerifyOTP} 
          className="w-full" 
          disabled={isVerifying || otp.length !== 6}
        >
          {isVerifying ? "Verifying..." : "Verify OTP"}
        </Button>
        
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={handleResendOTP}
            disabled={isResending}
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OTPVerification;
