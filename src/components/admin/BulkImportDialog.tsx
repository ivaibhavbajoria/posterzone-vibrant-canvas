
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { localStorageService } from '@/services/localStorageService';
import { securityService } from '@/services/securityService';

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

const BulkImportDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx')) {
        toast.error('Please select a CSV or Excel file');
        return;
      }
      setFile(selectedFile);
      setImportResult(null);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'title,description,price,category,image_url,is_trending,is_best_seller\n' +
      'Sample Poster,Beautiful artwork description,299,Nature,https://example.com/image.jpg,false,true\n' +
      'Another Poster,Amazing design,399,Abstract,https://example.com/image2.jpg,true,false';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'poster_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        rows.push(row);
      }
    }

    return rows;
  };

  const validateRow = (row: any, index: number): string[] => {
    const errors: string[] = [];
    
    if (!row.title || row.title.trim() === '') {
      errors.push(`Row ${index + 2}: Title is required`);
    }
    
    if (!row.price || isNaN(parseFloat(row.price))) {
      errors.push(`Row ${index + 2}: Valid price is required`);
    }
    
    if (!row.category || row.category.trim() === '') {
      errors.push(`Row ${index + 2}: Category is required`);
    }

    // Validate image URL format
    if (row.image_url && !row.image_url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
      errors.push(`Row ${index + 2}: Invalid image URL format`);
    }

    return errors;
  };

  const processImport = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsProcessing(true);
    const errors: string[] = [];
    let successCount = 0;
    let totalRows = 0;

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      totalRows = rows.length;

      console.log('Importing', totalRows, 'rows');

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowErrors = validateRow(row, i);
        
        if (rowErrors.length > 0) {
          errors.push(...rowErrors);
          continue;
        }

        try {
          const posterData = {
            title: securityService.sanitizeInput(row.title),
            description: securityService.sanitizeInput(row.description || ''),
            price: parseFloat(row.price),
            category: securityService.sanitizeInput(row.category),
            image_url: row.image_url || '',
            is_trending: row.is_trending === 'true' || row.is_trending === '1',
            is_best_seller: row.is_best_seller === 'true' || row.is_best_seller === '1'
          };

          localStorageService.addPoster(posterData);
          successCount++;
        } catch (error) {
          errors.push(`Row ${i + 2}: Failed to import - ${error.message}`);
        }
      }

      // Log the bulk import activity
      await securityService.logBulkImport(
        file.name,
        totalRows,
        successCount,
        errors.length
      );

      const result: ImportResult = {
        total: totalRows,
        success: successCount,
        failed: errors.length,
        errors: errors.slice(0, 10) // Show only first 10 errors
      };

      setImportResult(result);

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} posters`);
      }

      if (errors.length > 0) {
        toast.error(`Failed to import ${errors.length} rows. Check the details below.`);
      }

    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to process the file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setImportResult(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetDialog();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Posters</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Upload a CSV file with columns: title, description, price, category, image_url, is_trending, is_best_seller
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="import-file">Select CSV File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="mt-2"
              />
            </div>

            {file && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">Selected file: {file.name}</p>
                <p className="text-sm text-gray-600">Size: {(file.size / 1024).toFixed(2)} KB</p>
              </div>
            )}

            <Button
              onClick={processImport}
              disabled={!file || isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : 'Import Posters'}
            </Button>
          </div>

          {importResult && (
            <div className="space-y-4">
              <h3 className="font-semibold">Import Results</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{importResult.total}</div>
                  <div className="text-sm text-blue-600">Total Rows</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                    <CheckCircle className="h-6 w-6" />
                    {importResult.success}
                  </div>
                  <div className="text-sm text-green-600">Successful</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
                    <XCircle className="h-6 w-6" />
                    {importResult.failed}
                  </div>
                  <div className="text-sm text-red-600">Failed</div>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Errors:</h4>
                  <div className="max-h-40 overflow-y-auto bg-red-50 p-3 rounded-lg">
                    {importResult.errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-700">{error}</p>
                    ))}
                    {importResult.failed > 10 && (
                      <p className="text-sm text-red-600 font-medium">
                        ... and {importResult.failed - 10} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkImportDialog;
