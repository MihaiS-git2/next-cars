import Link from "next/link";

export default function MainFooter() {
    return (
        <footer className="bg-zinc-800 opacity-80 flex flex-row align-middle justify-center fixed bottom-0 left-0 w-full">
            <Link
                href="https://mihais-git.github.io/"
                className="text-cyan-400 my-4"
            >
                Mihai Suciu &copy; 2025
            </Link>
        </footer>
    );
}
