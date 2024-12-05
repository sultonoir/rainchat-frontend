interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <div className="min-h-screen">
      <main className="p-6">{children}</main>
    </div>
  );
}
