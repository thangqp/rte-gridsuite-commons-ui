import { PredefinedProperties } from './types';

export interface Metadata {
    name: string;
    url: string;
    appColor: string;
    hiddenInAppsMenu: boolean;
    resources: unknown;
}

export interface StudyMetadata extends Metadata {
    name: 'Study';
    predefinedEquipmentProperties: {
        [networkElementType: string]: PredefinedProperties;
    };
}
