import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface NavBarData {
    routelink: string;
    icon?: IconDefinition;
    visible?:boolean;
    label: string;
    rol?: string;
    expanded?: boolean;
    items?: NavBarData[];

}