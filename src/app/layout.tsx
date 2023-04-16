import './globals.css';

export const metadata = {
	title: 'Path finding algorithm',
	description: 'Path finding algorithm visualization',
};

import { Roboto } from 'next/font/google';

const roboto = Roboto({
	weight: ['400', '500', '700'],
	subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={roboto.className}>
			<body>{children}</body>
		</html>
	);
}
