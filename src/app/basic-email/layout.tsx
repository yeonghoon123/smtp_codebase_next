import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Basic Email | SoyNet",
};

export default function BasicEmailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
