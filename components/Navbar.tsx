import Link from "next/link";

const Navbar = () => {
	return (
		<>
			<Link href="/verification-complete">VERIFICATION COMPLETE</Link>
			<hr />
			<Link href="/account-created">ACOUNT CREATED</Link>
			<hr />
			<Link href="/core-business">Core BUSINESS</Link>
			<hr />
			<Link href="/dashboard">DASHBOARD</Link>
			<hr />
			<Link href="/login">LOGIN</Link>
			<hr />
			<Link href="/passphrase-confirm">PASSPHASE CONFIRM</Link>
			<hr />
			<Link href="/passphrase">PASSPHASE REMEMBER</Link>
			<hr />
			<Link href="/passphrase-warning">PASSPHASE WARNING</Link>
			<hr />
			<Link href="/register">REGISTER</Link>
			<hr />
			<Link href="/verification">PASSPHASE WARNING</Link>
			<hr />
			<Link href="/verifying">VERIFYING</Link>
		</>
	);
};

export default Navbar;
