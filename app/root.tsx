import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import QueryProvider from "./components/providers/query-provider";
import { Toaster } from "./components/ui/sonner";
import Error404 from "./components/screens/error/404";
import Error403 from "./components/screens/error/403";
import Error500 from "./components/screens/error/500";
import GenericError from "./components/screens/error/generic-error";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Floranza - admin</title>
        <Meta />
        <Links />
      </head>
      <body>
        <QueryProvider>
          <Toaster theme="light" richColors />
          {children}
          <ScrollRestoration />
          <Scripts />
        </QueryProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}


export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {    
    switch (error.status) {
      case 404:
        return <Error404 />;
      case 403:
        return <Error403 />;
      case 500:
        return <Error500 />;
      default:
        return <GenericError error={error} />;
    }
  }
  
  return <GenericError error={error} />;
}