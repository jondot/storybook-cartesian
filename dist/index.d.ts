interface StoryVariant<T> {
    props: T;
    story: any;
    title: string;
}
declare type CartesianData<T> = {
    [P in keyof T]: Array<T[P]> | any;
};
declare const renderWithLegend: (legend: any) => (f: any) => (props: any) => any;
declare const xproduct: (vals: any[][]) => {}[][];
declare const choice: (...choices: any) => any[];
declare const cartesian: (stories: any) => {
    add: <Props>(seed: () => CartesianData<Props>, renderTitle: (props: Props) => string, renderStory: (props: Props) => any, valid?: (props: Props) => boolean, apply?: (stories: any, variants: StoryVariant<Props>[]) => void) => void;
};
export { choice, renderWithLegend, xproduct };
export default cartesian;
