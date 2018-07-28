/// <reference types="vss-web-extension-sdk" />

import * as React from 'react';
import * as ReactDOM from "react-dom";
import { AppLayout } from "./applayout";
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

export function init(containerId: string) {
    initializeIcons();
    ReactDOM.render((
        <div className="hub-view">
            <AppLayout />
        </div>
    ), document.getElementById(containerId));
}