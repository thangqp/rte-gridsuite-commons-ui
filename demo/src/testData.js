/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';

/* Icons for customization*/
import FlashOnIcon from '@material-ui/icons/FlashOn';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import WavesIcon from '@material-ui/icons/Waves';
import EcoIcon from '@material-ui/icons/Eco';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import FiberNewIcon from '@material-ui/icons/FiberNew';

export const LOGS_JSON = {
    taskKey: 'Test',
    defaultName: 'Test',
    taskValues: {},
    subReporters: [
        {
            taskKey: 'loadflow',
            defaultName: 'loadflow',
            taskValues: {},
            subReporters: [
                {
                    taskKey: 'loadFlow',
                    // eslint-disable-next-line no-template-curly-in-string
                    defaultName: 'Load flow on network ${networkId}',
                    taskValues: {
                        networkId: {
                            value: 'test',
                            type: 'UNTYPED',
                        },
                    },
                    subReporters: [
                        {
                            taskKey: 'createLfNetwork',
                            // eslint-disable-next-line no-template-curly-in-string
                            defaultName: 'Create network ${networkNum}',
                            taskValues: {
                                networkNum: {
                                    value: 0,
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [],
                        },
                        {
                            taskKey: 'postLoading',
                            defaultName:
                                // eslint-disable-next-line no-template-curly-in-string
                                'Post loading process on network CC${numNetworkCc} SC${numNetworkSc}',
                            taskValues: {
                                numNetworkCc: {
                                    value: 0,
                                    type: 'UNTYPED',
                                },
                                numNetworkSc: {
                                    value: 0,
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'networkSize',
                                    defaultMessage:
                                        // eslint-disable-next-line no-template-curly-in-string
                                        'Network CC${numNetworkCc} SC${numNetworkSc} has ${nbBuses} buses (voltage remote control: ${nbRemoteControllerBuses} controllers, ${nbRemoteControlledBuses} controlled) and ${nbBranches} branches',
                                    values: {
                                        nbBranches: {
                                            value: 3,
                                            type: 'UNTYPED',
                                        },
                                        nbRemoteControlledBuses: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        nbRemoteControllerBuses: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        nbBuses: {
                                            value: 3,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkCc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkSc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'networkBalance',
                                    defaultMessage:
                                        // eslint-disable-next-line no-template-curly-in-string
                                        'Network CC${numNetworkCc} SC${numNetworkSc} balance: active generation=${activeGeneration} MW, active load=${activeLoad} MW, reactive generation=${reactiveGeneration} MVar, reactive load=${reactiveLoad} MVar',
                                    values: {
                                        reactiveLoad: {
                                            value: 18.0,
                                            type: 'UNTYPED',
                                        },
                                        activeLoad: {
                                            value: 180.0,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkCc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkSc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        activeGeneration: {
                                            value: 200.0,
                                            type: 'UNTYPED',
                                        },
                                        reactiveGeneration: {
                                            value: 0.0,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'OuterLoop',
                            // eslint-disable-next-line no-template-curly-in-string
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Distributed slack on generation',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'mismatchDistributionSuccess',
                                    defaultMessage:
                                        // eslint-disable-next-line no-template-curly-in-string
                                        'Iteration ${iteration}: slack bus active power (${initialMismatch} MW) distributed in ${nbIterations} iterations',
                                    values: {
                                        reportSeverity: {
                                            value: 'ERROR',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        nbIterations: {
                                            value: 1,
                                            type: 'UNTYPED',
                                        },
                                        iteration: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        initialMismatch: {
                                            value: -19.98634545729172,
                                            type: 'Mismatch',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'NoMismatchDistribution',
                                    defaultMessage:
                                        // eslint-disable-next-line no-template-curly-in-string
                                        'Iteration ${iteration}: already balanced',
                                    values: {
                                        reportSeverity: {
                                            value: 'FATAL',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        iteration: {
                                            value: 1,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'OuterLoop',
                            // eslint-disable-next-line no-template-curly-in-string
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Reactive limits',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [],
                        },
                        {
                            taskKey: 'OuterLoop',
                            // eslint-disable-next-line no-template-curly-in-string
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Distributed slack on generation',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'NoMismatchDistribution',
                                    defaultMessage:
                                        // eslint-disable-next-line no-template-curly-in-string
                                        'Iteration ${iteration}: already balanced',
                                    values: {
                                        reportSeverity: {
                                            value: 'WARN',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        iteration: {
                                            value: 1,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'OuterLoop',
                            // eslint-disable-next-line no-template-curly-in-string
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Reactive limits',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [],
                        },
                    ],
                    reports: [],
                },
            ],
            reports: [],
        },
    ],
    reports: [],
};

export const STUDY_UUID = '00000000-1111-2222-3333-444444444444';
const NETWORK_UUID = '00000000-1111-2222-3333-444444444444';
const EQUIPMENTS = [
    {
        id: 'ident1',
        name: 'name1',
        type: 'LOAD',
        voltageLevelsIds: ['voltlv1'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident2',
        name: 'name2',
        type: 'GENERATOR',
        voltageLevelsIds: ['vl2'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident3',
        name: 'name3',
        type: 'BREAKER',
        voltageLevelsIds: ['vl3'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident4',
        name: 'name4',
        type: 'HVDC',
        voltageLevelsIds: ['vl41', 'vl42'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident5',
        name: 'name5',
        type: 'SUBSTATION',
        voltageLevelsIds: ['vl51', 'vl52'],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident6',
        name: 'name6',
        type: 'VOLTAGE_LEVEL',
        voltageLevelsIds: ['vl6'],
        networkUuid: NETWORK_UUID,
    },
];

let PokemonTree = [
    {
        id: 'D1',
        name: 'Team',
        icon: <FolderOpenIcon />,
        children: [
            {
                id: '1',
                parentId: 'D1',
                name: 'Pikachu',
                type: 'Electric',
                power: '23',
                icon: <FlashOnIcon />,
            },
            {
                id: '2',
                parentId: 'D1',
                name: 'Spectrum',
                type: 'Spectre',
                power: '51',
            },
            {
                id: '3',
                parentId: 'D1',
                name: 'Roucoups',
                type: 'Vol',
                power: '42',
            },
            {
                id: '4',
                parentId: 'D1',
                name: 'Lamantin',
                type: 'Glace',
                power: '127',
                icon: <AcUnitIcon />,
            },
            {
                id: '5',
                parentId: 'D1',
                name: 'Mew',
                type: 'Psy',
                power: '134',
            },
            {
                id: '6',
                parentId: 'D1',
                name: 'Machoc',
                type: 'Combat',
                power: '64',
            },
        ],
    },
    {
        id: 'D2',
        name: 'Reserve',
        icon: <FolderOpenIcon />,
        children: [
            {
                id: '7',
                parentId: 'D2',
                name: 'Dracofeu',
                type: 'Feu',
                power: '84',
                icon: <WhatshotIcon />,
            },
            {
                id: '8',
                parentId: 'D2',
                name: 'Florizard',
                type: 'Plante',
                power: '72',
                icon: <EcoIcon />,
            },
            {
                id: '9',
                parentId: 'D2',
                name: 'Tortank',
                type: 'Eau',
                power: '78',
                icon: <WavesIcon />,
            },
            {
                id: '10',
                parentId: 'D2',
                name: 'Artikodin',
                type: 'Glace',
                power: '133',
                icon: <AcUnitIcon />,
            },
        ],
    },
    {
        id: 'D3',
        name: 'Empty Collect',
        icon: <FolderOpenIcon />,
        children: [],
    },
];

let PokemonList = [
    {
        id: '1',
        name: 'Pikachu',
        type: 'Electric',
        power: '23',
        icon: <FlashOnIcon />,
    },
    { id: '2', name: 'Spectrum', type: 'Spectre', power: '51' },
    { id: '3', name: 'Roucoups', type: 'Vol', power: '42' },
    {
        id: '4',
        name: 'Lamantin',
        type: 'Glace',
        power: '127',
        icon: <AcUnitIcon />,
    },
    { id: '5', name: 'Mew', type: 'Psy', power: '134' },
    { id: '6', name: 'Machoc', type: 'Combat', power: '64' },
];

let IDCounter = 100; // Start at 100 to avoid conflicts for demo
function fetchInfinitePokemonList() {
    IDCounter++;
    PokemonList = [
        ...PokemonList,
        {
            id: IDCounter.toString(),
            name: 'Métamorph_' + new Date().getTime(),
            type: 'Normal',
            power: '1',
            icon: <FiberNewIcon />,
        },
    ];
    return PokemonList;
}

function fetchInfinitePokemonTree(nodeId) {
    IDCounter++;

    let PokemonTreeCopy = [...PokemonTree];
    const dirFound = PokemonTreeCopy.find((element) => element.id === nodeId);

    if (dirFound) {
        dirFound.children.push({
            id: IDCounter.toString(),
            name: 'Métamorph_' + new Date().getTime(),
            type: 'Normal',
            power: '1',
            icon: <FiberNewIcon />,
        });
    }

    PokemonTree = PokemonTreeCopy;
    return PokemonTree;
}

export const searchEquipments = (searchTerm, equipmentLabelling) => {
    if (searchTerm) {
        return equipmentLabelling
            ? EQUIPMENTS.filter((equipment) =>
                  equipment.name.includes(searchTerm)
              )
            : EQUIPMENTS.filter((equipment) =>
                  equipment.id.includes(searchTerm)
              );
    } else {
        return [];
    }
};

export {
    PokemonTree as testDataTree,
    PokemonList as testDataList,
    fetchInfinitePokemonTree as fetchInfiniteTestDataTree,
    fetchInfinitePokemonList as fetchInfiniteTestDataList,
};
