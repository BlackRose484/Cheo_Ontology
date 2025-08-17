export default function CharacterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent">
      {children}
    </div>
  );
}
