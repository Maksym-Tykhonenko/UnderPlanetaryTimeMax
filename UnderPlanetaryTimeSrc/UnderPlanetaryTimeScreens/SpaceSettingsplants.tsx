import React, {
    useEffect as chronoSyncWave,
    useState as orbitToggleLatch,
} from 'react';
import {
    Switch,
    Alert,
    View as NebulaPanel,
    Text as GlyphLine,
    Image as PhotonBadge,
    Share,
    Linking,
    TouchableOpacity as RuneTapGate,
    Dimensions as AstroMetricPulse,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { underfontstime as chronoFontVault } from '../underfontstime';
import { useNavigation as useCosmicNav } from '@react-navigation/native';

export default function SpaceSettingsplants() {
    const { width: axisWidth, height: axisHeight } = AstroMetricPulse.get('window');
    const [notifyFlux, setNotifyFlux] = orbitToggleLatch<boolean>(true);

    const glyphShare = require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/share.png');
    const glyphReset = require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/dropAppData.png');

    const forgeButtonShell = () => ({
        flexDirection: 'row',
        backgroundColor: '#0E062F',
        borderRadius: axisWidth * 0.06,
        marginBottom: axisHeight * 0.025,
        alignItems: 'center',
        width: axisWidth * 0.93,
        paddingVertical: axisHeight * 0.025,
        paddingHorizontal: axisWidth * 0.06,
    });

    const forgeTextGlyph = (tone = '#fff') => ({
        color: tone,
        fontFamily: chronoFontVault.planPopRegul,
        fontSize: axisWidth * 0.048,
    });

    const forgeIconPulse = (id: string) => ({
        width: id === 'share' ? axisWidth * 0.08 : axisWidth * 0.06,
        height: id === 'share' ? axisWidth * 0.08 : axisWidth * 0.06,
        resizeMode: 'contain',
        tintColor: '#fff',
    });

    const NOTIFY_SEAL_KEY = 'notificationsEnabled';

    chronoSyncWave(() => {
        (async () => {
            try {
                const storedPulse = await AsyncStorage.getItem(NOTIFY_SEAL_KEY);
                if (storedPulse === null) {
                    await AsyncStorage.setItem(NOTIFY_SEAL_KEY, 'true');
                    setNotifyFlux(true);
                } else {
                    setNotifyFlux(storedPulse === 'true');
                }
            } catch {
                setNotifyFlux(true);
            }
        })();
    }, []);

    const navCosmosGate = useCosmicNav();

    const flipNotifySeal = async (val: boolean) => {
        setNotifyFlux(val);
        try {
            await AsyncStorage.setItem(NOTIFY_SEAL_KEY, val ? 'true' : 'false');
        } catch { }
    };

    const invokeResetRitual = () => {
        Alert.alert(
            'Reset the Entire Cosmos?',
            'This will erase all planets, saved moments, and photos. Your timeline will return to empty space, and nothing can be recovered',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        AsyncStorage.clear();
                        navCosmosGate.replace('UnderPlanetaryTimeLoading');
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const configRunes = [
        {
            rune: 'notifications',
            title: 'Notifications',
            icon: null,
            rightNode: (
                <Switch
                    thumbColor="#fff"
                    onValueChange={flipNotifySeal}
                    trackColor={{ false: '#3D2C7A', true: '#FF902F' }}
                    value={notifyFlux}
                    ios_backgroundColor="#3D2C7A"
                    style={{
                        transform: [
                            { scaleX: axisWidth / 375 * 1.1 },
                            { scaleY: axisWidth / 375 * 1.1 },
                        ],
                    }}
                />
            ),
            align: 'space-between',
            onPress: undefined,
        },
        {
            rune: 'share',
            title: 'Share the app',
            icon: glyphShare,
            rightNode: null,
            align: 'space-between',
            onPress: () =>
                Share.share({
                    message:
                        'I found this app really useful! My Magic app is Under Planetary Time. Here you can create your own planetary events and explore the cosmos.',
                }),
        },
        {
            rune: 'reset',
            title: 'Reset All Data',
            icon: glyphReset,
            rightNode: null,
            align: 'space-between',
            onPress: invokeResetRitual,
        },
        {
            rune: 'terms',
            title: 'Terms of Use',
            icon: null,
            rightNode: null,
            align: 'flex-start',
            onPress: () => {
                Linking.openURL(
                    'https://www.termsfeed.com/live/0874b2de-e405-4dab-98f8-5d4a2a04b5f4'
                );
            },
        },
    ];

    return (
        <NebulaPanel style={{
                justifyContent: 'flex-start',
                flex: 1,
                alignItems: 'center',
                backgroundColor: 'transparent',
                paddingTop: axisHeight * 0.01,
            }}
        >
            <NebulaPanel
                style={{
                    marginBottom: axisHeight * 0.03,
                    width: axisWidth * 0.93,
                    paddingVertical: axisHeight * 0.025,
                    backgroundColor: '#0E062F',
                    alignItems: 'center',
                    borderRadius: axisWidth * 0.06,
                }}
            >
                <GlyphLine
                    style={{
                        textAlign: 'center',
                        color: '#FF902F',
                        fontFamily: chronoFontVault.planPopSemiBold,
                        fontSize: axisWidth * 0.055,
                    }}
                >
                    Settings
                </GlyphLine>
            </NebulaPanel>

            {configRunes.map(node => (
                <RuneTapGate
                    key={node.rune}
                    style={{
                        ...forgeButtonShell(),
                        justifyContent: node.align,
                    }}
                    onPress={node.onPress}
                    activeOpacity={node.onPress ? 0.7 : 1}
                >
                    <GlyphLine style={forgeTextGlyph()}>
                        {node.title}
                    </GlyphLine>
                    {node.rightNode}
                    {node.icon && (
                        <PhotonBadge
                            source={node.icon}
                            style={forgeIconPulse(node.rune)}
                        />
                    )}
                </RuneTapGate>
            ))}
        </NebulaPanel>
    );
}