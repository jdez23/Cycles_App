import { createNavigationContainerRef } from '@react-navigation/native';

import { CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
        navigationRef.dispatch(
            CommonActions.navigate({name, params
        })
    );
}
