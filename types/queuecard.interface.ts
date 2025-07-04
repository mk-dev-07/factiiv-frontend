export interface IQueueCardItem {
    count: number;
    lable: string;
    link: string;
}

export interface IQueueCardProps {
	name: string;
	linkLabel: string;
	linkTo: string;
    itemList?: IQueueCardItem[];
	InfoTooltip?: () => JSX.Element;
}