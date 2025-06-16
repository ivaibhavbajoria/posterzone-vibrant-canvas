
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Search, Download, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface SecurityLog {
  id: string;
  user_id: string | null;
  action: string;
  resource: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

const SecurityAuditLogs = () => {
  const { isAdminLoggedIn } = useAdminAuth();
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchSecurityLogs();
    }
  }, [isAdminLoggedIn]);

  const fetchSecurityLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching security logs:', error);
        toast.error('Failed to load security logs');
        return;
      }

      // Transform the data to match our interface, handling ip_address type
      const transformedLogs = data?.map(log => ({
        ...log,
        ip_address: log.ip_address ? String(log.ip_address) : null
      })) || [];

      setLogs(transformedLogs);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load security logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('FAILED') || action.includes('ERROR')) return 'destructive';
    if (action.includes('LOGIN') || action.includes('SUCCESS')) return 'default';
    if (action.includes('ADMIN')) return 'secondary';
    return 'outline';
  };

  const getActionIcon = (action: string) => {
    if (action.includes('FAILED') || action.includes('ERROR')) {
      return <AlertTriangle className="h-3 w-3" />;
    }
    return <Shield className="h-3 w-3" />;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.resource && log.resource.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter.toUpperCase());
    return matchesSearch && matchesAction;
  });

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User ID', 'Action', 'Resource', 'IP Address', 'Details'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.created_at).toISOString(),
        log.user_id || 'Anonymous',
        log.action,
        log.resource || '',
        log.ip_address || '',
        JSON.stringify(log.details || {})
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security_audit_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAdminLoggedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>Admin authentication required to view security logs</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Audit Logs
            </CardTitle>
            <CardDescription>Monitor system security events and user activities</CardDescription>
          </div>
          <Button onClick={exportLogs} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search logs by action or resource..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="login">Login Events</SelectItem>
              <SelectItem value="admin">Admin Actions</SelectItem>
              <SelectItem value="data">Data Access</SelectItem>
              <SelectItem value="bulk">Bulk Operations</SelectItem>
              <SelectItem value="failed">Failed Events</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading security logs...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getActionBadgeVariant(log.action)} className="flex items-center gap-1 w-fit">
                      {getActionIcon(log.action)}
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.resource || '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.user_id ? log.user_id.substring(0, 8) + '...' : 'Anonymous'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.ip_address || '-'}
                  </TableCell>
                  <TableCell className="text-sm max-w-xs">
                    {log.details ? (
                      <details className="cursor-pointer">
                        <summary className="text-blue-600 hover:underline">View Details</summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    ) : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {filteredLogs.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No security logs found</p>
            <p>Security events will appear here as they occur.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAuditLogs;
