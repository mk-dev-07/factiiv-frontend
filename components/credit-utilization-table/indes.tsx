import Link from "next/link";
import { PropsWithoutRef } from "react";
import {
	HeaderCell,
	TableColumnDef,
	TotalCreditUtilizationData,
} from "../../types/score-details.interface";

const CreditUtilizationTable = ({
	data = [],
}: {
	data: TotalCreditUtilizationData[];
}) => {
	const columns: TableColumnDef[] = [
		{ id: "connection", label: "connection" },
		{ id: "type", label: "type" },
		{ id: "amount", label: "high credit limit" },
		{ id: "balance", label: "balance" },
		{ id: "usage", label: "usage %" },
		{ id: "view", label: "view", hidden: true },
	];

	const HeaderCell = ({ label, hidden }: HeaderCell) =>
		hidden ? (
			// hidden header cell
			<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
				<span className="sr-only">{label}</span>
			</th>
		) : (
			<th
				scope="col"
				className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-onyx sm:pl-6 md:pl-3"
			>
				{label}
			</th>
		);

	const renderCell = (
		column: string,
		value: boolean | string,
		data: TotalCreditUtilizationData
	) => {
		if (data.id === value) {
			return <td className="hidden w-0 h-0" key={data.id}></td>;
		}

		if (value === null || value === undefined) {
			return <span key={data.id}>N/A</span>;
		}

		if (typeof value === "string" && value.includes("/trade-details/")) {
			return (
				<td
					key={data.id}
					className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6 md:pr-0"
				>
					<Link
						href={{ pathname: data.view }}
						className="text-topaz hover:text-topaz-dark"
					>
						view <span className="sr-only"></span>
					</Link>
				</td>
			);
		}

		if (typeof value === "number") {
			return (
				<td
					key={data.id}
					className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-onyx sm:pl-6 md:pl-3"
				>
					{
						Math.round(value) + "%" //
					}
				</td>
			);
		}

		return (
			<td
				key={data.id}
				className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-onyx sm:pl-6 md:pl-3"
			>
				{"" + value}
			</td>
		);
	};

	return (
		<>
			{!data.length && (
				<p className="p-3 text-center">
					Currently nothing to display here. Once you establish trades, balance
					on individual tradelines will be listed here.
				</p>
			)}

			{!!data.length && (
				<table className="min-w-full divide-y divide-onyx">
					<thead>
						<tr>
							{columns.map(({ id, label, hidden }) => (
								<HeaderCell key={id} label={label} hidden={hidden}></HeaderCell>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-onyx">
						{(data ?? [])?.map((row) => (
							<tr key={row.view} className="hover:bg-gold-lightest">
								{Object.entries(row).map(([key, value]) =>
									renderCell(key, value, row)
								)}
							</tr>
						))}
						{/* <tr className="hover:bg-gold-lightest">
						<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-onyx sm:pl-6 md:pl-3">
							Tools R Us
						</td>
						<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-onyx sm:pl-6 md:pl-3">
							685431
						</td>
						<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-onyx sm:pl-6 md:pl-3">
							$4,000
						</td>
						<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
							$2,000
						</td>
						<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
							50.00%
						</td>
						<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6 md:pr-0">
							<a
								href="/trade-detail"
								className="text-topaz hover:text-topaz-dark"
							>
								view <span className="sr-only"></span>
							</a>
						</td>
					</tr> */}
					</tbody>
				</table>
			)}
		</>
	);
};

export default CreditUtilizationTable;
