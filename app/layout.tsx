import './globals.css';import Nav from '@/components/Nav';
export const metadata={title:'StayFinder — Find Your Perfect Stay'};
export default function L({children}:{children:React.ReactNode}){return <html lang="en"><body><Nav/><main className="min-h-screen">{children}</main>
<footer className="bg-navy py-10 text-center text-sm text-gray-300">© {new Date().getFullYear()} StayFinder · Hotels, villas, apartments & homestays</footer></body></html>}
