import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react';
import api from '../services/api';
import { useSnackbar } from 'notistack';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedBook {
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher?: string;
  description?: string;
  url_img?: string;
  keyword?: string;
  quantity?: number;
  barcodes?: string;
}

interface ImportStatus {
  row: number;
  title: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

const ImportExcelModal: React.FC<ImportExcelModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ParsedBook[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const bstr = e.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws) as any[];

        const mappedData: ParsedBook[] = rawData.map((row) => ({
          title: row.Title || row.title || '',
          author: row.Author || row.author || '',
          isbn: String(row.ISBN || row.isbn || ''),
          category: row.Category || row.category || '',
          publisher: row.Publisher || row.publisher || '',
          description: row.Description || row.description || '',
          url_img: row['URL Image'] || row.url_img || '',
          keyword: row.Keyword || row.keyword || '',
          quantity: row.Quantity || row.quantity || row.Copies || row.copies || 1,
          barcodes: row.Barcodes || row.barcodes || '',
        })).filter(book => book.title && book.isbn);

        setData(mappedData);
        setImportStatus(mappedData.map((book, index) => ({
          row: index + 1,
          title: book.title,
          status: 'pending'
        })));
      } catch (err) {
        console.error('Parsing error:', err);
        enqueueSnackbar('Failed to parse Excel file. Please check the format.', { variant: 'error' });
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (!file) return;
    setIsImporting(true);

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/books/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.ok) {
            enqueueSnackbar(response.data.message || 'Import successful!', { variant: 'success' });
            if (response.data.data?.errorCount > 0) {
              enqueueSnackbar(`${response.data.data.errorCount} rows failed. Check console for details.`, { variant: 'warning' });
              console.warn('Import partial failures:', response.data.data.errors);
            }
            onSuccess();
            onClose();
        } else {
            enqueueSnackbar(response.data.message || 'Import failed.', { variant: 'error' });
        }
    } catch (err: any) {
        console.error('Import error:', err);
        enqueueSnackbar(err.response?.data?.message || 'Failed to import records.', { variant: 'error' });
    } finally {
        setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      { 
        Title: 'Sample Book', 
        Author: 'Author Name', 
        ISBN: '9781234567890', 
        Category: 'Science', 
        Publisher: 'Example Pub', 
        Description: 'Short desc', 
        'URL Image': '', 
        Keyword: 'tag1, tag2', 
        Quantity: 5,
        Barcodes: 'BC-001, BC-002 (Optional: Leave empty to auto-gen based on Quantity)'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Books");
    XLSX.writeFile(wb, "BookHub_Import_Template.xlsx");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-oxford-blue/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-parchment w-full max-w-4xl max-h-[90vh] rounded-academic shadow-2xl flex flex-col overflow-hidden border border-oxford-blue/10">
        {/* Header */}
        <div className="p-6 border-b border-oxford-blue/10 flex justify-between items-center bg-white/50">
          <div>
            <h2 className="text-2xl font-serif font-black text-oxford-blue tracking-tight">Bulk Import Archives</h2>
            <p className="text-xs font-mono font-black text-brass uppercase tracking-widest mt-1">Batch Registry via Spreadsheet</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-oxford-blue/5 rounded-full transition-colors cursor-pointer">
            <X className="h-6 w-6 text-oxford-blue/40" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {!file ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-oxford-blue/20 rounded-academic bg-white/30 group hover:border-brass/40 transition-colors">
              <Upload className="h-16 w-16 text-oxford-blue/10 group-hover:text-brass/20 transition-colors mb-4" />
              <p className="text-sm font-serif font-bold text-oxford-blue mb-2">Registry Sheet Not Found</p>
              <p className="text-xs text-charcoal/50 mb-6 italic">Upload a .xlsx or .xls file to begin batch processing.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-academic text-xs cursor-pointer"
                >
                  Select File
                </button>
                <button 
                  onClick={downloadTemplate}
                  className="px-6 py-2 border border-oxford-blue/30 text-oxford-blue font-mono text-xs font-black uppercase tracking-widest hover:bg-oxford-blue/5 transition-colors rounded-academic flex items-center gap-2 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Template
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".xlsx, .xls"
                className="hidden" 
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-academic border border-oxford-blue/5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="bg-brass/10 p-3 rounded-academic">
                    <FileText className="h-6 w-6 text-brass" />
                  </div>
                  <div>
                    <p className="text-sm font-serif font-black text-oxford-blue">{file.name}</p>
                    <p className="text-[10px] font-mono font-black text-charcoal/40 uppercase">Size: {(file.size / 1024).toFixed(2)} KB • Rows: {data.length}</p>
                  </div>
                </div>
                {!isImporting && (
                  <button 
                    onClick={() => { setFile(null); setData([]); setImportStatus([]); }}
                    className="text-xs font-mono font-black text-red-500 uppercase tracking-widest hover:underline cursor-pointer"
                  >
                    Remove File
                  </button>
                )}
              </div>

              {/* Preview Table */}
              <div className="border border-oxford-blue/10 rounded-academic overflow-hidden shadow-inner">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-oxford-blue/5 font-mono font-black text-oxford-blue/60 uppercase tracking-widest border-b border-oxford-blue/10">
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Book Title</th>
                      <th className="px-4 py-3">ISBN</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3 text-right">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-oxford-blue/5 bg-white/50">
                    {importStatus.slice(0, 10).map((status, idx) => (
                      <tr key={idx} className="hover:bg-parchment/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-charcoal/40">{status.row}</td>
                        <td className="px-4 py-3 font-serif font-bold text-oxford-blue max-w-[200px] truncate">{status.title}</td>
                        <td className="px-4 py-3 font-mono text-brass">{data[idx]?.isbn}</td>
                        <td className="px-4 py-3 uppercase tracking-tighter">{data[idx]?.category}</td>
                        <td className="px-4 py-3 text-right">
                          {status.status === 'pending' && <span className="text-charcoal/30 italic">Queued</span>}
                          {status.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />}
                          {status.status === 'error' && (
                            <div className="flex items-center justify-end gap-1 text-red-500 group relative">
                              <AlertCircle className="h-4 w-4" />
                              <span className="hidden group-hover:block absolute right-6 bg-red-500 text-white text-[10px] p-2 rounded shadow-lg z-10 w-40">
                                {status.message}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {importStatus.length > 10 && (
                      <tr className="bg-parchment/20">
                        <td colSpan={5} className="px-4 py-2 text-center text-[10px] font-mono font-black text-charcoal/40 uppercase tracking-[0.4em]">
                          And {importStatus.length - 10} more items...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-oxford-blue/10 flex justify-between items-center bg-white/50">
          <button 
            onClick={onClose}
            disabled={isImporting}
            className="text-xs font-mono font-black text-oxford-blue/60 uppercase tracking-widest hover:text-oxford-blue disabled:opacity-30 cursor-pointer"
          >
            Cancel Session
          </button>
          <div className="flex gap-4">
            {file && (
              <button 
                onClick={handleImport}
                disabled={isImporting || data.length === 0}
                className="btn-academic text-xs flex items-center gap-2 min-w-[150px] justify-center cursor-pointer"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Begin Registry
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExcelModal;
