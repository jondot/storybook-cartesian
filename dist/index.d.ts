interface StoryVariant<T> {
    props: T;
    story: any;
    title: string;
}
declare type CartesianData<T> = {
    [P in keyof T]: Array<T[P]> | any;
};
declare const renderWithLegend: (legend: any) => (f: any) => (props: any) => any;
declare const renderWithLegendFlat: (legend: any) => (f: any) => (props: any) => any;
declare const xproduct: (vals: any[][]) => {}[][];
declare const choice: (...choices: any) => any[];
declare const cartesian: (stories: any) => {
    add: <Props>(seed: () => CartesianData<Props>, renderStory: (props: Props) => any, opts: {
        renderTitle?: ((props: Props) => string) | undefined;
        valid?: ((props: Props) => boolean) | undefined;
        apply?: ((stories: any, variants: StoryVariant<Props>[]) => void) | undefined;
    }) => void;
};
export { choice, renderWithLegend, renderWithLegendFlat, xproduct };
export default cartesian;
