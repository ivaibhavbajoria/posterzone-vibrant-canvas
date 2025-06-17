
import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  action: string;
  resource?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityService {
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const { data, error } = await supabase.rpc('log_enhanced_security_event', {
        p_action: event.action,
        p_resource: event.resource || null,
        p_details: event.details || null,
        p_ip_address: event.ipAddress || null,
        p_user_agent: event.userAgent || navigator.userAgent,
        p_session_id: this.getSessionId(),
        p_risk_level: event.riskLevel || 'low'
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Security logging error:', error);
    }
  }

  async logLoginAttempt(email: string, success: boolean, details?: any): Promise<void> {
    const riskLevel = success ? 'low' : 'medium';
    await this.logSecurityEvent({
      action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      resource: 'auth',
      details: { email: this.sanitizeInput(email), ...details },
      riskLevel
    });
  }

  async logAdminAccess(resource: string, action: string, details?: any): Promise<void> {
    await this.logSecurityEvent({
      action: `ADMIN_${action.toUpperCase()}`,
      resource,
      details,
      riskLevel: 'medium'
    });
  }

  async logDataAccess(table: string, action: string, recordId?: string): Promise<void> {
    await this.logSecurityEvent({
      action: `DATA_${action.toUpperCase()}`,
      resource: table,
      details: { recordId },
      riskLevel: action.includes('DELETE') ? 'high' : 'low'
    });
  }

  async logBulkImport(fileName: string, totalRows: number, successCount: number, failureCount: number): Promise<void> {
    await this.logSecurityEvent({
      action: 'BULK_IMPORT',
      resource: 'posters',
      details: {
        fileName: this.sanitizeInput(fileName),
        totalRows,
        successCount,
        failureCount
      },
      riskLevel: failureCount > 0 ? 'medium' : 'low'
    });
  }

  async logSuspiciousActivity(activity: string, details?: any): Promise<void> {
    await this.logSecurityEvent({
      action: 'SUSPICIOUS_ACTIVITY',
      resource: 'security',
      details: { activity, ...details },
      riskLevel: 'high'
    });
  }

  // Rate limiting helper with enhanced security
  private rateLimitMap = new Map<string, { count: number; resetTime: number; blocked: boolean }>();

  checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const entry = this.rateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs, blocked: false });
      return true;
    }

    if (entry.blocked || entry.count >= maxAttempts) {
      if (!entry.blocked) {
        entry.blocked = true;
        this.logSuspiciousActivity('RATE_LIMIT_EXCEEDED', { key, attempts: entry.count });
      }
      return false;
    }

    entry.count++;
    return true;
  }

  // Enhanced input sanitization
  sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .replace(/javascript:/gi, '') // Remove javascript protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 1000); // Limit length
  }

  // SQL injection prevention helper
  escapeSQL(input: string): string {
    if (!input || typeof input !== 'string') return '';
    return input.replace(/'/g, "''");
  }

  // CSRF token generation and validation
  generateCSRFToken(): string {
    const token = crypto.randomUUID();
    sessionStorage.setItem('csrf_token', token);
    return token;
  }

  validateCSRFToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token;
  }

  // Session ID management
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  // File validation for uploads
  validateFileUpload(file: File, allowedTypes: string[], maxSize: number = 5 * 1024 * 1024): boolean {
    // Check file size
    if (file.size > maxSize) {
      throw new Error('File size exceeds maximum allowed size');
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not allowed');
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = allowedTypes.map(type => type.split('/')[1]);
    if (!extension || !allowedExtensions.includes(extension)) {
      throw new Error('File extension not allowed');
    }

    return true;
  }

  // Password strength validation
  validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // XSS protection
  escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

export const securityService = new SecurityService();
