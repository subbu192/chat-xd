export default function AuthLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="flex-1 flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center gap-10 px-10 py-5 border-2 border-black">
                <div className="flex flex-col justify-center items-center gap-2">
                    <h1 className="text-4xl font-semibold">chatXD</h1>
                    <p className="text-sm">Real-Time Chat Application</p>
                </div>
                {children}
            </div>
        </div>
    );
}