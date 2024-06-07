import { useCallback, useState } from 'react';

/**
 * Hook to deal with list of components multiselection
 * @param elementIds list of all ids used for selection, whether they are selected or not
 * for "handleShiftAndCtrlClick" to work, this list needs to be sorted in the same order as it is displayed
 */
export const useMultiselect = (elementIds: string[]) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const clearSelection = useCallback(() => {
        setSelectedIds([]);
    }, []);

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
            //setLastSelectedElementId(elementToToggleId);
        },
        [selectedIds]
    );

    const handleShiftAndCtrlClick = (
        clickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        clickedElementId: string
    ) => {
        /*if (clickEvent.shiftKey) {
            handleShiftClick(clickedElementId);
            return;
        }

        if (clickEvent.ctrlKey) {
            toggleSelection(clickedElementId);
            return;
        }*/
    };

    const toggleSelectAll = useCallback(() => {
        if (selectedIds.length === 0) {
            setSelectedIds([...elementIds]);
        } else {
            setSelectedIds([]);
        }
    }, [elementIds, selectedIds.length]);

    return {
        selectedIds,
        toggleSelection,
        toggleSelectAll,
        clearSelection,
        handleShiftAndCtrlClick,
    };
};
