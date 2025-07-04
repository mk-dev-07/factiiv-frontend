import Head from "next/head";
import Sidebar from "../../components/sidebar";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import HeaderActions from "../../components/header-actions";

const Privacy = () => {
	return (
		<div>
			<Head>
				<title>Privacy Policy | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
						{/* <Search client:visible /> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
						<LogoSvg />
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
						<main className="lg:px-6 w-full">
							{/*
							<h1 className="text-4xl font-extrabold dark:text-white">
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
							<h3 className="text-2xl font-bold dark:text-white">
							<p className="dark:text-white pb-2">
							*/}
							<h1 className="text-4xl font-extrabold dark:text-white pb-6">
								Privacy Policy
							</h1>
							<p className="dark:text-white pb-2">
								It is Factiiv&rsquo;s policy to respect your privacy regarding
								any information we may collect while operating our website. This
								Privacy Policy applies to&nbsp;
								<a href="https://factiiv.io/">
									<u>https://factiiv.io/</u>
								</a>{" "}
								(hereinafter, &ldquo;us&rdquo;, &ldquo;we&rdquo;, or
								&ldquo;https://factiiv.io/&rdquo;). We respect your privacy and
								are committed to protecting personally identifiable information
								you may provide us through the Website. We have adopted this
								privacy policy (&ldquo;Privacy Policy&rdquo;) to explain what
								information may be collected on our Website, how we use this
								information, and under what circumstances we may disclose the
								information to third parties. This Privacy Policy applies only
								to information we collect through the Website and does not apply
								to our collection of information from other sources.
							</p>
							<p className="dark:text-white pb-2">
								This Privacy Policy, together with the Terms and conditions
								posted on our Website, set forth the general rules and policies
								governing your use of our Website. Depending on your activities
								when visiting our Website, you may be required to agree to
								additional terms and conditions.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								Website Visitors
							</h2>
							<p className="dark:text-white pb-2">
								Like most website operators, Factiiv collects
								non-personally-identifying information of the sort that web
								browsers and servers typically make available, such as the
								browser type, language preference, referring site, and the date
								and time of each visitor request. Factiiv&rsquo;s purpose in
								collecting non-personally identifying information is to better
								understand how Factiiv&rsquo;s visitors use its website. From
								time to time, Factiiv may release non-personally-identifying
								information in the aggregate, e.g., by publishing a report on
								trends in the usage of its website.
							</p>
							<p className="dark:text-white pb-2">
								Factiiv also collects potentially personally-identifying
								information like Internet Protocol (IP) addresses for logged in
								users and for users leaving comments on https://factiiv.io/
								blog posts. Factiiv only discloses logged in user and commenter
								IP addresses under the same circumstances that it uses and
								discloses personally-identifying information as described below.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								Gathering of Personally-Identifying Information
							</h2>
							<p className="dark:text-white pb-2">
								Certain visitors to Factiiv&rsquo;s websites choose to interact
								with Factiiv in ways that require Factiiv to gather
								personally-identifying information. The amount and type of
								information that Factiiv gathers depends on the nature of the
								interaction. For example, we ask visitors who sign up for a blog
								at https://factiiv.io/ to provide a username and email address.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								Security
							</h2>
							<p className="dark:text-white pb-2">
								The security of your Personal Information is important to us,
								but remember that no method of transmission over the Internet,
								or method of electronic storage is 100% secure. While we strive
								to use commercially acceptable means to protect your Personal
								Information, we cannot guarantee its absolute security.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								Advertisements
							</h2>
							<p className="dark:text-white pb-2">
								Ads appearing on our website may be delivered to users by
								advertising partners, who may set cookies. These cookies allow
								the ad server to recognize your computer each time they send you
								an online advertisement to compile information about you or
								others who use your computer. This information allows ad
								networks to, among other things, deliver targeted advertisements
								that they believe will be of most interest to you. This Privacy
								Policy covers the use of cookies by Factiiv and does not cover
								the use of cookies by any advertisers.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								Links To External Sites
							</h2>
							<p className="dark:text-white pb-2">
								Our Service may contain links to external sites that are not
								operated by us. If you click on a third party link, you will be
								directed to that third party&rsquo;s site. We strongly advise
								you to review the Privacy Policy and terms and conditions of
								every site you visit.
							</p>
							<p className="dark:text-white pb-2">
								We have no control over, and assume no responsibility for the
								content, privacy policies or practices of any third party sites,
								products or services.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								Protection of Certain Personally-Identifying Information
							</h2>
							<p className="dark:text-white pb-2">
								Factiiv discloses potentially personally-identifying and
								personally-identifying information only to those of its
								employees, contractors and affiliated organizations that (i)
								need to know that information in order to process it on
								Factiiv&rsquo;s behalf or to provide services available at
								Factiiv&rsquo;s website, and (ii) that have agreed not to
								disclose it to others. Some of those employees, contractors and
								affiliated organizations may be located outside of your home
								country; by using Factiiv&rsquo;s website, you consent to the
								transfer of such information to them. Factiiv will not rent or
								sell potentially personally-identifying and
								personally-identifying information to anyone. Other than to its
								employees, contractors and affiliated organizations, as
								described above, Factiiv discloses potentially
								personally-identifying and personally-identifying information
								only in response to a subpoena, court order or other
								governmental request, or when Factiiv believes in good faith
								that disclosure is reasonably necessary to protect the property
								or rights of Factiiv, third parties or the public at large.
							</p>
							<p className="dark:text-white pb-2">
								If you are a registered user of https://factiiv.io/ and have
								supplied your email address, Factiiv may occasionally send you
								an email to tell you about new features, solicit your feedback,
								or just keep you up to date with what&rsquo;s going on with
								Factiiv and our products. We primarily use our blog to
								communicate this type of information, so we expect to keep this
								type of email to a minimum. If you send us a request (for
								example via a support email or via one of our feedback
								mechanisms), we reserve the right to publish it in order to help
								us clarify or respond to your request or to help us support
								other users. Factiiv takes all measures reasonably necessary to
								protect against the unauthorized access, use, alteration or
								destruction of potentially personally-identifying and
								personally-identifying information.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								Aggregated Statistics
							</h2>
							<p className="dark:text-white pb-2">
								Factiiv may collect statistics about the behavior of visitors to
								its website. Factiiv may display this information publicly or
								provide it to others. However, Factiiv does not disclose your
								personally-identifying information.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								Cookies
							</h2>
							<p className="dark:text-white pb-2">
								To enrich and perfect your online experience, Factiiv uses
								&ldquo;Cookies&rdquo;, similar technologies and services
								provided by others to display personalized content, appropriate
								advertising and store your preferences on your computer.
							</p>
							<p className="dark:text-white pb-2">
								A cookie is a string of information that a website stores on a
								visitor&rsquo;s computer, and that the visitor&rsquo;s browser
								provides to the website each time the visitor returns. Factiiv
								uses cookies to help Factiiv identify and track visitors, their
								usage of https://factiiv.io/, and their website access
								preferences. Factiiv visitors who do not wish to have cookies
								placed on their computers should set their browsers to refuse
								cookies before using Factiiv&rsquo;s websites, with the drawback
								that certain features of Factiiv&rsquo;s websites may not
								function properly without the aid of cookies.
							</p>
							<p className="dark:text-white pb-2">
								By continuing to navigate our website without changing your
								cookie settings, you hereby acknowledge and agree to
								Factiiv&rsquo;s use of cookies.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								E-commerce
							</h2>
							<p className="dark:text-white pb-2">
								Those who engage in transactions with Factiiv &ndash; by
								purchasing Factiiv&rsquo;s services or products, are asked to
								provide additional information, including as necessary the
								personal and financial information required to process those
								transactions. In each case, Factiiv collects such information
								only insofar as is necessary or appropriate to fulfill the
								purpose of the visitor&rsquo;s interaction with Factiiv. Factiiv
								does not disclose personally-identifying information other than
								as described below. And visitors can always refuse to supply
								personally-identifying information, with the caveat that it may
								prevent them from engaging in certain website-related
								activities.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								Business Transfers
							</h2>
							<p className="dark:text-white pb-2">
								If Factiiv, or substantially all of its assets, were acquired,
								or in the unlikely event that Factiiv goes out of business or
								enters bankruptcy, user information would be one of the assets
								that is transferred or acquired by a third party. You
								acknowledge that such transfers may occur, and that any acquirer
								of Factiiv may continue to use your personal information as set
								forth in this policy.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								Privacy Policy Changes
							</h2>
							<p className="dark:text-white pb-2">
								Although most changes are likely to be minor, Factiiv may change
								its Privacy Policy from time to time, and in Factiiv&rsquo;s
								sole discretion. Factiiv encourages visitors to frequently check
								this page for any changes to its Privacy Policy. Your continued
								use of this site after any change in this Privacy Policy will
								constitute your acceptance of such change.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								What we collect and store
							</h2>
							<p className="dark:text-white pb-2">
								We collect information about you during the checkout process in
								our store.
							</p>
							<p className="dark:text-white pb-2">
								While you visit our site, we&rsquo;ll track:
							</p>
							<ol className="list-decimal pl-12">
								<li>
									<p className="dark:text-white pb-2">
										Products you&rsquo;ve viewed: we&rsquo;ll use this to, for
										example, show you products you&rsquo;ve recently viewed
									</p>
								</li>
								<li>
									<p className="dark:text-white pb-2">
										Location, IP address, and browser type: we&rsquo;ll use this
										for purposes like estimating taxes and shipping
									</p>
								</li>
								<li>
									<p className="dark:text-white pb-2">
										Shipping address: we&rsquo;ll ask you to enter this so we
										can, for instance, estimate shipping before you place an
										order, and send you the order!
									</p>
								</li>
							</ol>
							<p className="dark:text-white pb-2">
								We&rsquo;ll also use cookies to keep track of cart contents
								while you&rsquo;re browsing our site.
							</p>
							<p className="dark:text-white pb-2">
								When you purchase from us, we&rsquo;ll ask you to provide
								information including your name, billing address, shipping
								address, email address, phone number, credit card/payment
								details and optional account information like username and
								password. We&rsquo;ll use this information for purposes, such
								as, to:
							</p>
							<ol className="list-decimal pl-12">
								<li>
									<p className="dark:text-white pb-2">
										Send you information about your account and order
									</p>
								</li>
								<li>
									<p className="dark:text-white pb-2">
										Respond to your requests, including refunds and complaints
									</p>
								</li>
								<li>
									<p className="dark:text-white pb-2">
										Process payments and prevent fraud
									</p>
								</li>
								<li>
									<p className="dark:text-white pb-2">
										Set up your account for our store
									</p>
								</li>
								<li>
									<p className="dark:text-white pb-2">
										Comply with any legal obligations we have, such as
										calculating taxes
									</p>
								</li>
								<li>
									<p className="dark:text-white pb-2">
										Improve our store offerings
									</p>
								</li>
								<li>
									<p className="dark:text-white pb-2">
										Send you marketing messages, if you choose to receive them
									</p>
								</li>
							</ol>
							<p className="dark:text-white pb-2">
								If you create an account, we will store your name, address,
								email, and phone number, which will be used to populate the
								checkout for future orders.
							</p>
							<p className="dark:text-white pb-2">
								We generally store information about you for as long as we need
								the information for the purposes for which we collect and use
								it, and we are not legally required to continue to keep it. For
								example, we will store order information for XXX years for tax
								and accounting purposes. This includes your name, email address,
								and billing and shipping addresses.
							</p>
							<p className="dark:text-white pb-2">
								We will also store comments or reviews if you choose to leave
								them.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								Who on our team has access
							</h2>
							<p className="dark:text-white pb-2">
								Members of our team have access to the information you provide
								us. For example, both Administrators and Shop Managers can
								access:
							</p>
							<ol className="list-decimal pl-12">
								<li>
									<p className="dark:text-white pb-2">
										Order information like what was purchased, when it was
										purchased and where it should be sent, and
									</p>
								</li>
								<li>
									<p className="dark:text-white pb-2">
										Customer information like your name, email address, and
										billing and shipping information.
									</p>
								</li>
							</ol>
							<p className="dark:text-white pb-2">
								Our team members have access to this information to help fulfill
								orders, process refunds and support you.
							</p>
							<hr />
							<h2 className="text-3xl font-bold dark:text-white py-2 pb-4">
								What we share with others
							</h2>
							<p className="dark:text-white pb-2">
								We share information with third parties who help us provide our
								orders and store services to you.
							</p>
						</main>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Privacy;
