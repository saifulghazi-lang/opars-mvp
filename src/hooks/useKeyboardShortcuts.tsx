import { useEffect } from 'react';

interface KeyboardShortcuts {
    onApprove?: () => void;
    onReject?: () => void;
    onEscape?: () => void;
    enabled?: boolean;
}

export function useKeyboardShortcuts({
    onApprove,
    onReject,
    onEscape,
    enabled = true
}: KeyboardShortcuts) {
    useEffect(() => {
        if (!enabled) return;

        function handleKeyDown(event: KeyboardEvent) {
            // Ignore if user is typing in an input/textarea
            const target = event.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            // Handle shortcuts
            switch (event.key.toLowerCase()) {
                case 'a':
                    event.preventDefault();
                    onApprove?.();
                    break;
                case 'r':
                    event.preventDefault();
                    onReject?.();
                    break;
                case 'escape':
                    event.preventDefault();
                    onEscape?.();
                    break;
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onApprove, onReject, onEscape, enabled]);
}
