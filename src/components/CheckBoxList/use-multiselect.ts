import { useCallback, useEffect, useState } from 'react';

/**
 * Hook to deal with list of components multiselection
 * @param elementIds list of all ids used for selection, whether they are selected or not
 * for "handleShiftAndCtrlClick" to work, this list needs to be sorted in the same order as it is displayed
 */
export const useMultiselect = (elementIds: string[]) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [lastSelectedElementId, setLastSelectedElementId] = useState<
        string | null
    >(null);

    const clearSelection = () => {
        setSelectedIds([]);
    };

    useEffect(() => {
        clearSelection();
        console.log(lastSelectedElementId);
        setLastSelectedElementId(null);
    }, [elementIds, lastSelectedElementId]);

    const toggleSelection = useCallback(
        (elementToToggleId: string) => {
            const elementIndex = selectedIds.indexOf(elementToToggleId);
            let newSelectedIds;
            if (elementIndex < 0) {
                newSelectedIds = [...selectedIds, elementToToggleId];
            } else {
                newSelectedIds = selectedIds.filter(
                    (id) => id !== elementToToggleId
                );
            }
            setSelectedIds(newSelectedIds);
            setLastSelectedElementId(elementToToggleId);
        },
        [selectedIds]
    );

    /*const addElementsToSelection = useCallback(
        (elementsToSelectIds: string[]) => {
            const newSelectedIds = [
                ...selectedIds,
                ...elementsToSelectIds.filter(
                    (id) => !selectedIds.includes(id)
                ),
            ];
            setSelectedIds(newSelectedIds);
        },
        [selectedIds]
    );*/

    /*const removeElementsFromSelection = useCallback(
        (elementsToUnselectIds: string[]) => {
            const newSelectedIds = selectedIds.filter(
                (id) => !elementsToUnselectIds.includes(id)
            );
            setSelectedIds(newSelectedIds);
        },
        [selectedIds]
    ); */

    /*const handleShiftClick = useCallback(
        (clickedElementId: string) => {
            window.getSelection()?.empty();

            const lastSelectedIdIndex = lastSelectedElementId
                ? elementIds.indexOf(lastSelectedElementId)
                : -1;
            const clickedElementIdIndex = elementIds.indexOf(clickedElementId);

            if (clickedElementIdIndex < 0) {
                return;
            }

            if (lastSelectedIdIndex < 0) {
                toggleSelection(clickedElementId);
                return;
            }

            const elementsToToggle = elementIds.slice(
                Math.min(lastSelectedIdIndex, clickedElementIdIndex),
                Math.max(lastSelectedIdIndex, clickedElementIdIndex) + 1
            );

            if (selectedIds.includes(clickedElementId)) {
                removeElementsFromSelection(elementsToToggle);
            } else {
                addElementsToSelection(elementsToToggle);
            }
            setLastSelectedElementId(clickedElementId);
        },
        [
            elementIds,
            lastSelectedElementId,
            selectedIds,
            addElementsToSelection,
            removeElementsFromSelection,
            toggleSelection,
        ]
    );*/

    const handleShiftAndCtrlClick = (
        clickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        clickedElementId: string
    ) => {
        if (clickEvent.shiftKey) {
            //handleShiftClick(clickedElementId);
            return;
        }

        if (clickEvent.ctrlKey) {
            toggleSelection(clickedElementId);
            return;
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === 0) {
            setSelectedIds([...elementIds]);
        } else {
            setSelectedIds([]);
        }
    };

    return {
        selectedIds,
        toggleSelection,
        toggleSelectAll,
        clearSelection,
        handleShiftAndCtrlClick,
    };
};
