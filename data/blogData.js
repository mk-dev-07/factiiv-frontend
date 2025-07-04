/* eslint-disable linebreak-style */
// blogData.js
const blogData = [
	{
		id: 1,
		title: "The Future of AI in Web Development",
		meta_title: "The Future of AI in Web Development | Factiiv Blog",
		meta_description:
			"Explore how artificial intelligence is shaping the future of web development.",
		slug: "the-future-of-ai-in-web-development",
		permalink: "https://factiiv.com/blog/the-future-of-ai-in-web-development",
		tags: ["AI", "Web Development", "Technology"],
		categories: ["Development", "AI"],
		created_at: "2023-07-01T10:00:00Z",
		updated_at: "2023-07-10T14:30:00Z",
		description: `
      Artificial intelligence (AI) is revolutionizing the way we develop websites and applications. 
      From automating tedious tasks to enhancing user experience with intelligent features, AI is playing 
      a crucial role in the future of web development. In this blog post, we will explore the various ways 
      AI is being integrated into web development and how it can improve productivity, security, and the 
      overall user experience.
    `,
		status: "publish",
		feature_image: {
			url: "https://media.npr.org/assets/img/2023/05/24/gettyimages-1358149692-39527b1e42cc64b90835222f8aa203956538fe0e.jpg?s=1100&c=50&f=jpeg",
			alt_text: "AI in Web Development",
		},
		author: { name: "John Doe", email: "johndoe@example.com" },
		summary:
			"AI is revolutionizing web development by automating tasks, enhancing UX, and improving security. Explore how AI is shaping the future of web development.",
	},
	{
		id: 2,
		title: "A Guide to Responsive Web Design",
		meta_title: "Responsive Web Design | Factiiv Blog",
		meta_description:
			"Learn the essentials of responsive web design and how to create websites that work across all devices.",
		slug: "a-guide-to-responsive-web-design",
		permalink: "https://factiiv.com/blog/a-guide-to-responsive-web-design",
		tags: ["Web Design", "Responsive Design", "CSS"],
		categories: ["Design"],
		created_at: "2023-07-15T09:30:00Z",
		updated_at: "2023-07-20T16:00:00Z",
		description: `
      Responsive web design is an approach to web design that ensures websites look good and work well 
      on all devices, from desktop monitors to smartphones. By using flexible layouts, media queries, and 
      other CSS techniques, web designers can create sites that adapt to various screen sizes and orientations.
      In this blog, we'll cover the basics of responsive design and how to implement it on your website.
    `,
		status: "publish",
		feature_image: {
			url: "https://www.simplilearn.com/ice9/free_resources_article_thumb/Types_of_Artificial_Intelligence.jpg",
			alt_text: "Responsive Web Design",
		},
		author: { name: "Jane Smith", email: "janesmith@example.com" },
		summary:
			"Learn how responsive web design can help your website adapt to any device with flexible layouts and CSS techniques.",
	},
	{
		id: 3,
		title: "Understanding Web Accessibility Standards",
		meta_title: "Web Accessibility | Factiiv Blog",
		meta_description:
			"Discover the importance of web accessibility and how to make websites usable for everyone, including people with disabilities.",
		slug: "understanding-web-accessibility-standards",
		permalink:
			"https://factiiv.com/blog/understanding-web-accessibility-standards",
		tags: ["Accessibility", "Web Design", "User Experience"],
		categories: ["Design", "Development"],
		created_at: "2023-07-18T11:00:00Z",
		updated_at: "2023-07-22T12:15:00Z",
		description: `
      Web accessibility is about making the web usable for everyone, including people with disabilities. 
      This includes ensuring that websites are navigable by people with visual impairments, hearing impairments, 
      and other disabilities. In this blog, we will discuss the guidelines for making your website accessible, 
      as well as the tools and resources available to test and improve accessibility.
    `,
		status: "publish",
		feature_image: {
			url: "https://specials-images.forbesimg.com/imageserve/681ca34055b42894d760175e/960x0.jpg",
			alt_text: "JavaScript Frameworks",
		},
		author: { name: "Emily Brown", email: "emilybrown@example.com" },
		summary:
			"Web accessibility ensures that websites are usable for everyone, including people with disabilities. Learn how to improve your site's accessibility.",
	},
	{
		id: 4,
		title: "The Rise of JavaScript Frameworks in 2023",
		meta_title: "JavaScript Frameworks | Factiiv Blog",
		meta_description:
			"A deep dive into the popular JavaScript frameworks in 2023 and their role in modern web development.",
		slug: "the-rise-of-javascript-frameworks-in-2023",
		permalink:
			"https://factiiv.com/blog/the-rise-of-javascript-frameworks-in-2023",
		tags: ["Technology", "Frameworks", "Web Development"],
		categories: ["Development"],
		created_at: "2025-07-25T08:30:00Z",
		updated_at: "2023-07-27T10:00:00Z",
		description: `
      JavaScript frameworks have become essential for modern web development. They simplify building complex web 
      applications by providing ready-to-use libraries, components, and tools. In 2023, some of the most popular 
      JavaScript frameworks include React, Vue, and Angular. In this blog, we will explore these frameworks and 
      how they are shaping the future of web development.
    `,
		status: "draft",
		feature_image: {
			url: "https://optimicollege.co.za/wp-content/uploads/2023/07/ai-apprentice-to-ai-architect-1.jpg",
			alt_text: "Web Accessibility",
		},
		author: { name: "Michael Lee", email: "michaellee@example.com" },
		summary:
			"Explore the rise of JavaScript frameworks like React, Vue, and Angular in 2023 and their impact on web development.",
	},
	{
		id: 5,
		title: "Optimizing Web Performance for Better User Experience",
		meta_title: "Web Performance Optimization | Factiiv Blog",
		meta_description:
			"Learn how to optimize your website's performance and enhance user experience with faster load times.",
		slug: "optimizing-web-performance-for-better-user-experience",
		permalink:
			"https://factiiv.com/blog/optimizing-web-performance-for-better-user-experience",
		tags: ["Web Performance", "UX", "Optimization"],
		categories: ["UX"],
		created_at: "2023-07-28T12:00:00Z",
		updated_at: "2023-07-29T14:45:00Z",
		description: `
      Website performance is a critical factor in user experience. Slow-loading websites lead to frustrated users 
      and higher bounce rates. In this blog, we'll discuss the best practices for optimizing web performance, 
      including image compression, lazy loading, and using a content delivery network (CDN). 
    `,
		status: "publish",
		feature_image: {
			url: "https://www.imda.gov.sg/-/media/imda/images/content/news-and-events/impact-news-2024/04/ai-governance/ai-governance.webp",
			alt_text: "Web Performance Optimization",
		},
		author: { name: "Sara Johnson", email: "sarajohnson@example.com" },
		summary:
			"Improve your website's performance with best practices like image compression, lazy loading, and CDNs to boost user experience.",
	},
	{
		id: 6,
		title: "Optimizing Web Performance for Better User Experience",
		meta_title: "Web Performance Optimization | Factiiv Blog",
		meta_description:
			"Learn how to optimize your website's performance and enhance user experience with faster load times.",
		slug: "optimizing-web-performance-for-better-user-experience",
		permalink:
			"https://factiiv.com/blog/optimizing-web-performance-for-better-user-experience",
		tags: ["Web Performance", "Optimization"],
		categories: ["Development", "UX"],
		created_at: "2023-07-28T12:00:00Z",
		updated_at: "2023-07-29T14:45:00Z",
		description: `
      Website performance is a critical factor in user experience. Slow-loading websites lead to frustrated users 
      and higher bounce rates. In this blog, we'll discuss the best practices for optimizing web performance, 
      including image compression, lazy loading, and using a content delivery network (CDN). 
    `,
		status: "publish",
		feature_image: {
			url: "https://specials-images.forbesimg.com/imageserve/681ca34055b42894d760175e/960x0.jpg",
			alt_text: "JavaScript Frameworks",
		},
		author: { name: "Sara Johnson", email: "sarajohnson@example.com" },
		summary:
			"Improve your website's performance with best practices like image compression, lazy loading, and CDNs to boost user experience.",
	},
	{
		id: 7,
		title: "The Future of AI in Web Development",
		meta_title: "The Future of AI in Web Development | Factiiv Blog",
		meta_description:
			"Explore how artificial intelligence is shaping the future of web development.",
		slug: "the-future-of-ai-in-web-development",
		permalink: "https://factiiv.com/blog/the-future-of-ai-in-web-development",
		tags: ["AI", "Web Development", "Technology"],
		categories: ["Development", "AI"],
		created_at: "2023-07-01T10:00:00Z",
		updated_at: "2023-07-10T14:30:00Z",
		description: `
      Artificial intelligence (AI) is revolutionizing the way we develop websites and applications. 
      From automating tedious tasks to enhancing user experience with intelligent features, AI is playing 
      a crucial role in the future of web development. In this blog post, we will explore the various ways 
      AI is being integrated into web development and how it can improve productivity, security, and the 
      overall user experience.
    `,
		status: "publish",
		feature_image: {
			url: "https://optimicollege.co.za/wp-content/uploads/2023/07/ai-apprentice-to-ai-architect-1.jpg",
			alt_text: "Web Accessibility",
		},
		author: { name: "John Doe", email: "johndoe@example.com" },
		summary:
			"AI is revolutionizing web development by automating tasks, enhancing UX, and improving security. Explore how AI is shaping the future of web development.",
	},
	{
		id: 8,
		title: "A Guide to Responsive Web Design",
		meta_title: "Responsive Web Design | Factiiv Blog",
		meta_description:
			"Learn the essentials of responsive web design and how to create websites that work across all devices.",
		slug: "a-guide-to-responsive-web-design",
		permalink: "https://factiiv.com/blog/a-guide-to-responsive-web-design",
		tags: ["Web Design", "Responsive Design", "CSS"],
		categories: ["Design"],
		created_at: "2023-07-15T09:30:00Z",
		updated_at: "2023-07-20T16:00:00Z",
		description: `
      Responsive web design is an approach to web design that ensures websites look good and work well 
      on all devices, from desktop monitors to smartphones. By using flexible layouts, media queries, and 
      other CSS techniques, web designers can create sites that adapt to various screen sizes and orientations.
      In this blog, we'll cover the basics of responsive design and how to implement it on your website.
    `,
		status: "publish",
		feature_image: {
			url: "https://optimicollege.co.za/wp-content/uploads/2023/07/ai-apprentice-to-ai-architect-1.jpg",
			alt_text: "Web Accessibility",
		},
		author: { name: "Jane Smith", email: "janesmith@example.com" },
		summary:
			"Learn how responsive web design can help your website adapt to any device with flexible layouts and CSS techniques.",
	},
];

export default blogData;
