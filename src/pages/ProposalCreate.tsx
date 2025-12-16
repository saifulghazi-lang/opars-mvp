import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Upload, FileText, X, Loader2 } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function ProposalCreate() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        department: '',
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileError(null);

        if (!file) {
            setSelectedFile(null);
            return;
        }

        // Validate file type
        if (file.type !== 'application/pdf') {
            setFileError('Please select a PDF file');
            setSelectedFile(null);
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            setFileError('File size must be less than 10MB');
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    const clearFile = () => {
        setSelectedFile(null);
        setFileError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadFile = async (file: File): Promise<string | null> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `proposals/${fileName}`;

        setUploading(true);
        const { error: uploadError } = await supabase.storage
            .from('proposals')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            setFileError('Failed to upload file. Please try again.');
            setUploading(false);
            return null;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('proposals')
            .getPublicUrl(filePath);

        setUploading(false);
        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedFile) return;

        setLoading(true);

        // Upload file first
        const pdfUrl = await uploadFile(selectedFile);
        if (!pdfUrl) {
            setLoading(false);
            return;
        }

        // Create proposal with uploaded file URL
        const { error } = await supabase.from('proposals').insert({
            title: formData.title,
            department: formData.department,
            pdf_url: pdfUrl,
            created_by: user.id,
            status: 'Pending',
        });

        setLoading(false);
        if (error) {
            console.error('Error creating proposal:', error);
            alert('Failed to create proposal');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Proposal</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">Title</label>
                            <input
                                id="title"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="department" className="text-sm font-medium">Department</label>
                            <select
                                id="department"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            >
                                <option value="">Select Department</option>
                                <option value="Finance">Finance</option>
                                <option value="Operations">Operations</option>
                                <option value="HR">HR</option>
                                <option value="Secretariat">Secretariat</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">PDF Document</label>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {/* File upload area */}
                            {!selectedFile ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
                                >
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Click to upload PDF
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Max file size: 10MB
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4 border border-input rounded-lg bg-accent/30">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-8 w-8 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium truncate max-w-[200px]">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFile}
                                        className="h-8 w-8 p-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Error message */}
                            {fileError && (
                                <p className="text-sm text-destructive">{fileError}</p>
                            )}
                        </div>

                        <div className="pt-4 flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>Cancel</Button>
                            <Button type="submit" disabled={loading || uploading || !selectedFile}>
                                {uploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : loading ? (
                                    'Creating...'
                                ) : (
                                    'Create Proposal'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
