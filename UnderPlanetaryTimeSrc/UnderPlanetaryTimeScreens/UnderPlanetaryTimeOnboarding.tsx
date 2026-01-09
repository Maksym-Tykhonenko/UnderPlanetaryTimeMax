import {
    TouchableOpacity as TimePulseFragment,
    useWindowDimensions as PlanetarySpanOracle,
    Image as OrbitVeilShard,
    View as TemporalShellMatrix,
    TouchableWithoutFeedback as VoidTapCurtain,
} from 'react-native';
import { useNavigation as useOrbitNavTide } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState as useChronoLoop } from 'react';
import { Text as GlyphChronoRune } from 'react-native-gesture-handler';
import { underfontstime } from '../underfontstime';

const SPACE_TOCKENS_OF_TIME = 'space-onboard-tockens-v1';

const UnderPlanetaryTimeOnboarding: React.FC = () => {
    const [epochPointer, shiftEpochPointer] = useChronoLoop(0);
    const navPlanetaryFlow = useOrbitNavTide();

    const planetaryScrollCache = [
        require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/planetsStart/YourTimeAmongTheStars.png'),
        require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/planetsStart/TrackWhatMatters.png'),
        require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/planetsStart/EventsInPlanetaryForm.png'),
    ];

    const { width: chronoWidthSpan, height: chronoHeightSpan } = PlanetarySpanOracle();

    const mutateEpoch = async () => {
        if (epochPointer < planetaryScrollCache.length - 1) {
            shiftEpochPointer(prevEpoch => prevEpoch + 1);
        } else {
            try {
                await AsyncStorage.setItem(SPACE_TOCKENS_OF_TIME, 'complete');
            } catch (sealGlitch) {
                if (__DEV__) console.warn('VibeSpirit::onboardSaveFail', sealGlitch);
            }
            navPlanetaryFlow.replace?.('OrbitsInterstellartimeSpaceOfApp');
        }
    };

    const activeChronoVeil = planetaryScrollCache[epochPointer];

    return (
        <VoidTapCurtain onPress={mutateEpoch}>
            <TemporalShellMatrix
                style={{
                    flex: 1,
                    width: chronoWidthSpan,
                    height: chronoHeightSpan,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}
            >
                <OrbitVeilShard
                    source={activeChronoVeil}
                    resizeMode="cover"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: chronoWidthSpan,
                        height: chronoHeightSpan,
                    }}
                />

                <TimePulseFragment
                    activeOpacity={0.9}
                    onPress={() => {
                        navPlanetaryFlow.replace?.('OrbitsInterstellartimeSpaceOfApp');
                    }}
                    style={{
                        position: 'absolute',
                        top: chronoHeightSpan * 0.08,
                        right: chronoWidthSpan * 0.05,
                    }}
                >
                    <GlyphChronoRune
                        style={{
                            fontFamily: underfontstime.planPopSemiBold,
                            fontSize: chronoWidthSpan * 0.05,
                            color: 'white',
                            paddingHorizontal: chronoWidthSpan * 0.04,
                            paddingVertical: chronoHeightSpan * 0.019,
                        }}
                    >
                        Skip
                    </GlyphChronoRune>
                </TimePulseFragment>
            </TemporalShellMatrix>
        </VoidTapCurtain>
    );
};

export default UnderPlanetaryTimeOnboarding;