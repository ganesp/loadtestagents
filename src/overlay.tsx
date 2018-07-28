import * as React from "react";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as FabricOverlay from 'office-ui-fabric-react/lib/Overlay';

export interface IOverlayProps {
    className?: string;
    spinnerSize?: SpinnerSize;
    spinnerText?: string;
    visible?: boolean;
}

export class Overlay extends React.Component<IOverlayProps> {
    constructor(props: IOverlayProps) {
        super(props);
    }

    public render() {
        return (
            <FabricOverlay.Overlay
                className={`search-InProgress--overlay ${this.props.className}`}
                style={{ top: '50%', display: (this.props.visible == true ? 'block' : 'none' ) }}
            >
                <Spinner
                    className="spinner"
                    size={this.props.spinnerSize ? this.props.spinnerSize : SpinnerSize.medium}
                    label={this.props.spinnerText ? this.props.spinnerText : "Loading..."} />
            </FabricOverlay.Overlay >
        );
    }
}