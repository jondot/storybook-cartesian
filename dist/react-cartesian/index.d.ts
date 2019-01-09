/// <reference types="react" />
declare const Tiles: ({ items, size, className }: {
    items: any[];
    className: string;
    size: {
        width: number;
        height: number;
    };
}) => JSX.Element;
declare const Rows: import("styled-components").StyledComponent<({ items, size, className }: {
    items: any[];
    className: string;
    size: {
        width: number;
        height: number;
    };
}) => JSX.Element, any, {}, never>;
declare const applyWith: (title: any, Komponent: any) => (stories: any, candidates: any) => void;
export { Tiles, Rows, applyWith };
