import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { Circle, CircleDotDashed, CheckCircle2 } from 'lucide-react'

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground",
                outline: "text-foreground border-border",
                // Status Pills with subtle styling
                pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
                reviewing: "bg-blue-50 text-blue-700 border-blue-200",
                decided: "bg-green-50 text-green-700 border-green-200",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    status?: 'Pending' | 'Reviewing' | 'Decided'
}

function Badge({ className, variant, status, children, ...props }: BadgeProps) {
    // Auto-detect variant from status if provided
    const effectiveVariant = status
        ? status.toLowerCase() as typeof variant
        : variant

    // Render status icon
    const StatusIcon = status === 'Pending'
        ? Circle
        : status === 'Reviewing'
            ? CircleDotDashed
            : status === 'Decided'
                ? CheckCircle2
                : null

    return (
        <div className={cn(badgeVariants({ variant: effectiveVariant }), className)} {...props}>
            {StatusIcon && <StatusIcon className="w-3 h-3" />}
            {children || status}
        </div>
    )
}

export { Badge, badgeVariants }
