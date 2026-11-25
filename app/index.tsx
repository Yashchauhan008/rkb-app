import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useUser } from '@/src/context/UserContext';

export default function Index() {
    const { isAuthenticated, isLoading } = useUser();

    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    return <Redirect href={isAuthenticated ? '/(drawer)/(tabs)/products' : '/login'} />;
}
