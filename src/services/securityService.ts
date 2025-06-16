
import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  action: string;
  resource?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

class SecurityService {
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const { data, error } = await supabase.rpc('log_security_event', {
        p_action: event.action,
        p_resource: event.resource || null,
        p_details: event.details || null,
        p_ip_address: event.ipAddress || null,
        p_user_agent: event.userAgent || navigator.userAgent
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Security logging error:', error);
    }
  }

  async logLoginAttempt(email: string, success: boolean, details?: any): Promise<void> {
    await this.logSecurityEvent({
      action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      resource: 'auth',
      details: { email, ...details }
    });
  }

  async logAdminAccess(resource: string, action: string, details?: any): Promise<void> {
    await this.logSecurityEvent({
      action: `ADMIN_${action.toUpperCase()}`,
      resource,
      details
    });
  }

  async logDataAccess(table: string, action: string, recordId?: string): Promise<void> {
    await this.logSecurityEvent({
      action: `DATA_${action.toUpperCase()}`,
      resource: table,
      details: { recordId }
    });
  }

  async logBulkImport(fileName: string, totalRows: number, successCount: number, failureCount: number): Promise<void> {
    await this.logSecurityEvent({
      action: 'BULK_IMPORT',
      resource: 'posters',
      details: {
        fileName,
        totalRows,
        successCount,
        failureCount
      }
    });
  }

  // Rate limiting helper
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const entry = this.rateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (entry.count >= maxAttempts) {
      return false;
    }

    entry.count++;
    return true;
  }

  // Input sanitization
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .trim();
  }

  // SQL injection prevention helper
  escapeSQL(input: string): string {
    return input.replace(/'/g, "''");
  }
}

export const securityService = new SecurityService();
