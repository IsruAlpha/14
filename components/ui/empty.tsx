import { ReactNode } from "react";

export function Empty({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-8">
            {children}
        </div>
    );
}

export function EmptyHeader({ children }: { children: ReactNode }) {
    return <div className="flex flex-col items-center space-y-4">{children}</div>;
}

export function EmptyTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <h1 className={className}>{children}</h1>;
}

export function EmptyDescription({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <p className={`text-center text-muted-foreground ${className}`}>{children}</p>;
}

export function EmptyContent({ children }: { children: ReactNode }) {
    return <div className="flex flex-col items-center space-y-4">{children}</div>;
}
