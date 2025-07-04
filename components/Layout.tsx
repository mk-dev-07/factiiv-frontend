import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<div>
			{/* <Navbar /> */}
			{children}
		</div>
	);
};

export default Layout;
