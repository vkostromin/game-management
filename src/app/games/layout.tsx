import Breadcrumbs from "@/components/Breadcrumbs";

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Breadcrumbs />
      {children}
    </div>
  );
} 