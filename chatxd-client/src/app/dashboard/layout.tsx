import LeftBar from "@/components/LeftBar";

export default function DashboardLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="flex-1 flex flex-row">
            <LeftBar />
            {children}
        </div>
    );
}