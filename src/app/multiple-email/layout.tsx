import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Multiple Email | SoyNet",
};

export default function MultipleEmailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
