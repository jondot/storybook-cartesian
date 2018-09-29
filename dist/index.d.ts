declare type CartesianData<T> = {
    [P in keyof T]: Array<T[P]>;
};
declare const cartesian: (stories: any) => {
    add: <Props>(seed: () => CartesianData<Props>, renderTitle: (props: Props) => string, renderStory: (props: Props) => any, valid?: (props: Props) => boolean, apply?: (stories: any, candidate: {
        props: Props;
        story: any;
        title: string;
    }) => void) => void;
};
export default cartesian;
