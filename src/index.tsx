import App from "./App";
import React from "react";
import {render} from "react-dom";
import configSchema from './schemas/schema';
import uiSchema from "./schemas/uiSchema";
import {WidgetConfig} from "./types";
import { WidgetModuleContext, WidgetMountElement, WidgetMount } from '@kaaiot/services';

// Do some stuff before mounting
export const bootstrap = () => {

}

export const mount: WidgetMount<WidgetConfig> = (nodeElement: WidgetMountElement, context: WidgetModuleContext<WidgetConfig>) => {
    render(
        <App widgetContext={context} />,
        nodeElement.rootNodeElement

    );
}

// Some teardown logic on unmount
export const unmount = () => {

}

export const configurationSchema = () => {    
    return {
        schema: configSchema,
        uiSchema
    }
}
