import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView as ChronoSafeDock } from 'react-native-safe-area-context';

const UNDER_TIME_PLANETRY_TCN = 'time-4234-planetary-core-nav-seal';
import { useNavigation as usePlanetaryNavFlux } from '@react-navigation/native';
import React, {
    useRef as bindOrbitCore,
    useEffect as chronoEchoField,
} from 'react';
import {
    Animated as OrbitalPulseAnim,
    Dimensions as CosmicSpanMeter,
    Image as StellarVeilPlane,
    Easing,
} from 'react-native';

const UnderPlanetaryTimeLoading: React.FC = () => {
    const navChronoWave = usePlanetaryNavFlux();
    const { width: spanAxisW, height: spanAxisH } = CosmicSpanMeter.get('window');

    const pulseCore = bindOrbitCore(new OrbitalPulseAnim.Value(1)).current;

    chronoEchoField(() => {
        OrbitalPulseAnim.loop(
            OrbitalPulseAnim.sequence([
                OrbitalPulseAnim.timing(pulseCore, {
                    toValue: 1.18,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                OrbitalPulseAnim.timing(pulseCore, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    chronoEchoField(() => {
        let sealAnchor = true;
        let driftLatch: NodeJS.Timeout | null = null;

        const igniteTemporalRoute = async () => {
            try {
                const storedMark = await AsyncStorage.getItem(UNDER_TIME_PLANETRY_TCN);
                const entropyDelay = Math.floor(Math.random() * 900);

                if (!storedMark) {
                    await AsyncStorage.setItem(UNDER_TIME_PLANETRY_TCN, 'active');
                    setTimeout(() => {
                        navChronoWave.replace('UnderPlanetaryTimeOnboarding');
                    }, 5000 + entropyDelay);
                    return;
                }

                setTimeout(() => {
                    navChronoWave.replace('OrbitsInterstellartimeSpaceOfApp');
                }, 5000 + entropyDelay);
            } catch (fluxErr) {
                if (__DEV__) console.warn('VibeSpirit::syncFail', fluxErr);
            }
        };

        igniteTemporalRoute();

        return () => {
            sealAnchor = false;
            if (driftLatch) clearTimeout(driftLatch);
        };
    }, [navChronoWave, spanAxisW]);

    return (
        <ChronoSafeDock
            style={{
                alignItems: 'center',
                backgroundColor: '#281C43',
                height: spanAxisH,
                flex: 1,
                width: spanAxisW,
            }}
        >
            <StellarVeilPlane
                source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/Loader.png')}
                style={{
                    height: spanAxisH,
                    width: spanAxisW,
                    position: 'absolute',
                }}
                resizeMode="cover"
            />

            <OrbitalPulseAnim.View
                style={{
                    alignItems: 'center',
                    transform: [{ scale: pulseCore }],
                }}
            >
                <StellarVeilPlane
                    style={{
                        height: spanAxisW * 0.5303458,
                        marginTop: spanAxisH * 0.31,
                        width: spanAxisW * 0.5303458,
                    }}
                    resizeMode="contain"
                    source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/rotating_planet.gif')}
                />
            </OrbitalPulseAnim.View>
        </ChronoSafeDock>
    );
};

export default UnderPlanetaryTimeLoading;