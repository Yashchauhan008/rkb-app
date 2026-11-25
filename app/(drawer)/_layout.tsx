import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomDrawerContent from '@/components/CustomDrawerContent';
import { useUser } from '@/src/context/UserContext';

export default function DrawerLayout() {
    const { isAuthenticated, isLoading } = useUser();
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;

    // Auth guard: protected area requires a session
    if (!isLoading && !isAuthenticated) return <Redirect href="/login" />;

    return (
        <GestureHandlerRootView style={styles.container}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerShown: false,
                    drawerType: isLargeScreen ? 'permanent' : 'front',
                    drawerStyle: {
                        width: isLargeScreen ? 320 : '80%',
                        backgroundColor: '#FFFFFF',
                        borderRightWidth: isLargeScreen ? 1 : 0,
                        borderRightColor: '#F5F5F5',
                    },
                    overlayColor: 'rgba(0, 0, 0, 0.4)',
                    swipeEnabled: !isLargeScreen,
                }}
            >
                <Drawer.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
