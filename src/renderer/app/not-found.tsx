import Link from 'next/link';


export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-center px-4">
      <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-slate-700 dark:text-slate-300">Page Not Found</h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="mt-6 inline-block px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
        Go back home
      </Link>
    </div>
  );
}
