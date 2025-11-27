import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './Button';
import { X } from 'lucide-react';

interface SignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (signature: string) => void;
    title?: string;
}

export function SignatureModal({ isOpen, onClose, onConfirm, title = "Confirm Approval" }: SignatureModalProps) {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    if (!isOpen) return null;

    const handleClear = () => {
        sigCanvas.current?.clear();
        setIsEmpty(true);
    };

    const handleConfirm = () => {
        if (sigCanvas.current && !isEmpty) {
            const signatureData = sigCanvas.current.toDataURL();
            onConfirm(signatureData);
            handleClear();
        }
    };

    const handleBegin = () => {
        setIsEmpty(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 p-8 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Please sign below to confirm your approval
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Signature Pad */}
                <div className="space-y-3">
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white relative">
                        {/* Baseline */}
                        <div className="absolute bottom-12 left-0 right-0 h-px bg-gray-300 pointer-events-none" />

                        {/* Canvas */}
                        <SignatureCanvas
                            ref={sigCanvas}
                            canvasProps={{
                                className: 'w-full h-64 cursor-crosshair',
                            }}
                            onBegin={handleBegin}
                            velocityFilterWeight={0.7}
                            minWidth={1}
                            maxWidth={2.5}
                            penColor="black"
                        />

                        {/* Placeholder text */}
                        {isEmpty && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p className="text-gray-400 text-lg font-light">
                                    Sign here
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Clear button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleClear}
                            className="text-sm text-gray-600 hover:text-gray-900 underline"
                            disabled={isEmpty}
                        >
                            Clear signature
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isEmpty}
                        className="px-8 bg-black hover:bg-gray-800 text-white"
                    >
                        Sign & Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
}
