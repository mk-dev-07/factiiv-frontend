import React, { useState, useEffect } from "react";
import PaperPlaneSvg from "../svgs/PaperPlaneSvg";

interface IIssuesCard {
	messages: {
		text: string;
		sentBy: string;
		sentTime: string;
	}[];
}

const IssuesCard = ({ messages }: IIssuesCard) => {
	const [response, setResponse] = useState("");
	const [adminResponse, setAdminResponse] = useState<
		| {
				text: string;
				sentBy: string;
				sentTime: string;
		  }[]
		| null
	>(null);
	const handleSendMessage = () => {
		if (response === "") return;
		setAdminResponse((prev) => {
			return prev
				? [
					...prev,
					{
						text: response,
						sentBy: "AdminUsername",
						sentTime: new Date().toLocaleTimeString("en-US"),
					},
				  ]
				: [
					{
						text: response,
						sentBy: "AdminUsername",
						sentTime: new Date().toLocaleTimeString("en-US"),
					},
				  ];
		});
		setResponse("");
	};

	// Send message when Enter is pressed
	useEffect(() => {
		const keyDownHandler = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleSendMessage();
			}
		};
		document.addEventListener("keydown", keyDownHandler);
		return () => {
			document.removeEventListener("keydown", keyDownHandler);
		};
	});

	return (
		<div className="origin-top p-3 relative">
			<p className="text-lg font-medium mb-2">issue details</p>
			<p className="text-sm font-medium">trade line</p>
			<a className="underline text-topaz-dark" href="/admin/">
				92874687 ↗
			</a>
			<p className="text-sm font-medium">message history</p>
			<div className="space-y-3 flex flex-col">
				{messages.map((m) => {
					return (
						<div
							key={m.sentTime + m.text}
							className="rounded-xl rounded-bl-none text-onyx bg-gray-100 p-3 border-2 border-onyx self-start max-w-sm relative"
						>
							<p>{m.text}</p>
							<p className="text-xs font-bold mt-1">
								{m.sentBy} - {m.sentTime}
							</p>
						</div>
					);
				})}
				{adminResponse &&
					adminResponse.map((res) => {
						return (
							<div
								key={res.sentTime + res.text}
								className="rounded-xl rounded-br-none text-onyx bg-topaz-lighter p-3 border-2 border-onyx self-end max-w-sm relative"
							>
								<p>{res.text}</p>
								<p className="text-xs font-bold mt-1">
									{res.sentBy} - {res.sentTime}
								</p>
							</div>
						);
					})}
			</div>
			<div className="py-3 flex space-x-3 items-center mt-6">
				<input
					value={response}
					onChange={(e) => setResponse(e.target.value)}
					placeholder="write response to user here..."
					className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm h-12"
				/>
				<button
					id="send-message"
					onClick={handleSendMessage}
					className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm h-12 xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2"
				>
					<PaperPlaneSvg />
				</button>
			</div>
			<div className="my-3 max-w-xs mx-auto">
				<button id="mark-resolved" className="group grid w-full">
					<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full"></span>
					<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
						mark resolved
					</span>
				</button>
			</div>
			<iframe
				style={{
					display: "block",
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					overflow: "hidden",
					border: 0,
					opacity: 0,
					pointerEvents: "none",
					zIndex: -1,
				}}
				aria-hidden="true"
			></iframe>
		</div>
	);
};

export default IssuesCard;
