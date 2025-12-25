import { useState, useRef } from 'react';
import { Upload, FileJson, FileSpreadsheet, Download, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useCreateDestination } from '@/hooks/useDestinations';
import { toast } from 'sonner';

interface DestinationImport {
  title: string;
  slug?: string;
  region: string;
  country?: string;
  heritage_type: string;
  era?: string;
  description?: string;
  history?: string;
  best_time_to_visit?: string;
  is_published?: boolean;
  is_featured?: boolean;
  images?: string[];
  features?: string[];
  coordinates?: { lat: number; lng: number };
}

interface ValidationResult {
  row: number;
  data: DestinationImport;
  errors: string[];
  isValid: boolean;
}

interface BulkImportDestinationsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BulkImportDestinations = ({ open, onOpenChange }: BulkImportDestinationsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<ValidationResult[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [fileType, setFileType] = useState<'csv' | 'json' | null>(null);
  
  const createMutation = useCreateDestination();

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const validateDestination = (data: any, rowIndex: number): ValidationResult => {
    const errors: string[] = [];
    
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push('Title is required');
    }
    if (!data.region || typeof data.region !== 'string' || data.region.trim() === '') {
      errors.push('Region is required');
    }
    if (!data.heritage_type || typeof data.heritage_type !== 'string' || data.heritage_type.trim() === '') {
      errors.push('Heritage type is required');
    }

    // Parse arrays from CSV if they're strings
    let images = data.images;
    let features = data.features;
    
    if (typeof images === 'string') {
      images = images.split(';').map((s: string) => s.trim()).filter(Boolean);
    }
    if (typeof features === 'string') {
      features = features.split(';').map((s: string) => s.trim()).filter(Boolean);
    }

    // Parse coordinates
    let coordinates = data.coordinates;
    if (typeof coordinates === 'string') {
      try {
        coordinates = JSON.parse(coordinates);
      } catch {
        if (coordinates.includes(',')) {
          const [lat, lng] = coordinates.split(',').map((s: string) => parseFloat(s.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
            coordinates = { lat, lng };
          }
        }
      }
    }

    // Parse booleans
    const parseBoolean = (value: any) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes';
      }
      return false;
    };

    return {
      row: rowIndex + 1,
      data: {
        title: data.title?.trim() || '',
        slug: data.slug?.trim() || generateSlug(data.title || ''),
        region: data.region?.trim() || '',
        country: data.country?.trim() || undefined,
        heritage_type: data.heritage_type?.trim() || '',
        era: data.era?.trim() || undefined,
        description: data.description?.trim() || undefined,
        history: data.history?.trim() || undefined,
        best_time_to_visit: data.best_time_to_visit?.trim() || undefined,
        is_published: parseBoolean(data.is_published),
        is_featured: parseBoolean(data.is_featured),
        images: Array.isArray(images) ? images : [],
        features: Array.isArray(features) ? features : [],
        coordinates: coordinates && typeof coordinates === 'object' ? coordinates : undefined,
      },
      errors,
      isValid: errors.length === 0,
    };
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/^"|"$/g, ''));

      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }

    return rows;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isCSV = file.name.endsWith('.csv');
    const isJSON = file.name.endsWith('.json');

    if (!isCSV && !isJSON) {
      toast.error('Please upload a CSV or JSON file');
      return;
    }

    setFileType(isCSV ? 'csv' : 'json');

    const text = await file.text();
    let data: any[];

    try {
      if (isJSON) {
        const parsed = JSON.parse(text);
        data = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        data = parseCSV(text);
      }
    } catch (error) {
      toast.error('Failed to parse file. Please check the format.');
      return;
    }

    const validated = data.map((item, index) => validateDestination(item, index));
    setParsedData(validated);
  };

  const handleImport = async () => {
    const validItems = parsedData.filter(item => item.isValid);
    if (validItems.length === 0) {
      toast.error('No valid items to import');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < validItems.length; i++) {
      try {
        await createMutation.mutateAsync(validItems[i].data as any);
        successCount++;
      } catch (error) {
        failCount++;
        console.error('Failed to import:', validItems[i].data.title, error);
      }
      setImportProgress(Math.round(((i + 1) / validItems.length) * 100));
    }

    setIsImporting(false);
    
    if (failCount === 0) {
      toast.success(`Successfully imported ${successCount} destinations`);
      onOpenChange(false);
      setParsedData([]);
    } else {
      toast.warning(`Imported ${successCount} destinations, ${failCount} failed`);
    }
  };

  const downloadTemplate = (format: 'csv' | 'json') => {
    const sampleData = [
      {
        title: "Taj Mahal",
        region: "South Asia",
        country: "India",
        heritage_type: "Monument",
        era: "17th Century",
        description: "Iconic white marble mausoleum",
        history: "Built by Emperor Shah Jahan",
        best_time_to_visit: "October to March",
        is_published: true,
        is_featured: true,
        images: ["https://example.com/taj1.jpg", "https://example.com/taj2.jpg"],
        features: ["UNESCO Site", "Guided Tours", "Photography"],
        coordinates: { lat: 27.1751, lng: 78.0421 }
      }
    ];

    let content: string;
    let filename: string;
    let type: string;

    if (format === 'json') {
      content = JSON.stringify(sampleData, null, 2);
      filename = 'destinations-template.json';
      type = 'application/json';
    } else {
      const headers = ['title', 'region', 'country', 'heritage_type', 'era', 'description', 'history', 'best_time_to_visit', 'is_published', 'is_featured', 'images', 'features', 'coordinates'];
      const rows = sampleData.map(item => [
        item.title,
        item.region,
        item.country,
        item.heritage_type,
        item.era,
        item.description,
        item.history,
        item.best_time_to_visit,
        item.is_published,
        item.is_featured,
        item.images.join(';'),
        item.features.join(';'),
        `${item.coordinates.lat},${item.coordinates.lng}`
      ].map(v => `"${v}"`).join(','));
      
      content = [headers.join(','), ...rows].join('\n');
      filename = 'destinations-template.csv';
      type = 'text/csv';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsedData.filter(p => p.isValid).length;
  const invalidCount = parsedData.filter(p => !p.isValid).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Import Destinations
          </DialogTitle>
          <DialogDescription>
            Import multiple destinations from a CSV or JSON file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Download Templates */}
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Download template:</span>
            <Button variant="outline" size="sm" onClick={() => downloadTemplate('csv')}>
              <FileSpreadsheet className="w-4 h-4 mr-1" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadTemplate('json')}>
              <FileJson className="w-4 h-4 mr-1" />
              JSON
            </Button>
          </div>

          {/* File Upload */}
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">CSV or JSON files</p>
          </div>

          {/* Parsed Data Preview */}
          {parsedData.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FileSpreadsheet className="w-3 h-3" />
                    {parsedData.length} rows
                  </Badge>
                  {validCount > 0 && (
                    <Badge variant="default" className="bg-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {validCount} valid
                    </Badge>
                  )}
                  {invalidCount > 0 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {invalidCount} errors
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setParsedData([])}>
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              </div>

              <ScrollArea className="flex-1 max-h-[300px] border rounded-lg">
                <div className="p-3 space-y-2">
                  {parsedData.map((item, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border ${item.isValid ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            {item.isValid ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="font-medium text-sm">
                              Row {item.row}: {item.data.title || '(No title)'}
                            </span>
                          </div>
                          {item.data.region && (
                            <p className="text-xs text-muted-foreground ml-6">
                              {item.data.country && `${item.data.country}, `}{item.data.region} · {item.data.heritage_type}
                            </p>
                          )}
                          {item.errors.length > 0 && (
                            <div className="ml-6 mt-1 space-y-0.5">
                              {item.errors.map((error, i) => (
                                <p key={i} className="text-xs text-red-600">{error}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}

          {/* Import Progress */}
          {isImporting && (
            <Alert>
              <Loader2 className="w-4 h-4 animate-spin" />
              <AlertDescription>
                Importing destinations... {importProgress}%
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="gold" 
            onClick={handleImport} 
            disabled={validCount === 0 || isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import {validCount} Destination{validCount !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
