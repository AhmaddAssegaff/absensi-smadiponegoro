import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-blue-600 py-6 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Absensi SMADIP. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <Link
            href="https://github.com/AhmaddAssegaff"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.258.793-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.612-4.042-1.612-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.204.084 1.837 1.237 1.837 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.76-1.604-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.654 1.653.242 2.874.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.624-5.475 5.921.43.372.814 1.102.814 2.222 0 1.606-.014 2.9-.014 3.293 0 .32.192.694.8.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </Link>
          <Link
            href="https://www.instagram.com/smaislamdiponegoroska"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.849c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.735 0 8.332.012 7.052.07 5.771.129 4.612.345 3.678 1.278 2.745 2.211 2.529 3.37 2.47 4.651.412 8.332 0 8.735 0 12s.012 3.668.07 4.948c.058 1.281.274 2.44 1.207 3.373.933.933 2.092 1.149 3.373 1.207 1.28.058 1.683.07 4.948.07s3.668-.012 4.948-.07c1.281-.058 2.44-.274 3.373-1.207.933-.933 1.149-2.092 1.207-3.373.058-1.28.07-1.683.07-4.948s-.012-3.668-.07-4.948c-.058-1.281-.274-2.44-1.207-3.373C19.388.345 18.229.129 16.948.07 15.668.012 15.265 0 12 0z" />
              <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </Link>
          <Link
            href="https://smaidipska.ypid.or.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
};
