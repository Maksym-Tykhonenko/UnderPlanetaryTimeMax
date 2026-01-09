import {
    SafeAreaView as HaloSafeField,
    View as OrbitFrameHull,
    Image as PhotonCanvas,
    TouchableOpacity as PulseGlyphTap,
    Dimensions as SpanMetricForge,
} from 'react-native';
import SpaceSettingsplants from './SpaceSettingsplants';
import ChooseYourSpaceframe from './ChooseYourSpaceframe';
import React, {
    useState as spiralStateHook,
} from 'react';
import PlanetarySystemMain from './PlanetarySystemMain';


type DriftNodes =
    | 'wrapday-core'
    | 'spaceframe'
    | 'settings-planets'
    | 'spirit-config';

const { width: AXIS_WARP_W, height: AXIS_WARP_H } = SpanMetricForge.get('window');

const navGlyphOrbitals = [
    {
        jumpKey: 'spaceframe' as DriftNodes,
        iconFlux: require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/brimgs/timegallery.png'),
    },
    {
        jumpKey: 'wrapday-core' as DriftNodes,
        iconFlux: require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/brimgs/plusik.png'),
    },
    {
        jumpKey: 'settings-planets' as DriftNodes,
        iconFlux: require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/brimgs/prefsPlntr.png'),
    },
];

const OrbitsInterstellartimeSpaceOfApp: React.FC = () => {
    const [activeVector, setActiveVector] =
        spiralStateHook<DriftNodes>('wrapday-core');

    const CorePlanetaryField = (
        <PlanetarySystemMain
        />
    );

    const routeResolverMatrix = (node: DriftNodes) => {
        switch (node) {
            case 'wrapday-core':
                return CorePlanetaryField;
            case 'spaceframe':
                return <ChooseYourSpaceframe />;
            case 'settings-planets':
                return <SpaceSettingsplants />;
            default:
                return null;
        }
    };

    return (
        <OrbitFrameHull style={{ width: AXIS_WARP_W, flex: 1, height: AXIS_WARP_H }}>
            <PhotonCanvas
                source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/mainemptscr.png')}
                style={{
                    position: 'absolute',
                    width: AXIS_WARP_W,
                    height: AXIS_WARP_H,
                }}
                resizeMode="cover"
            />

            <HaloSafeField />

            {routeResolverMatrix(activeVector)}

            <OrbitFrameHull
                style={{
                    alignSelf: 'center',
                    elevation: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#0E062F',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowColor: '#000',
                    bottom: AXIS_WARP_H * 0.04,
                    borderRadius: AXIS_WARP_W * 0.1,
                    width: AXIS_WARP_H * 0.093 * 3,
                    height: AXIS_WARP_H * 0.093,
                    position: 'absolute',
                }}
            >
                {navGlyphOrbitals.map((glyph, idx) => (
                    <PulseGlyphTap
                        key={`orbit-glyph-${idx}`}
                        style={{
                            justifyContent: 'center',
                            width: AXIS_WARP_H * 0.093,
                            height: AXIS_WARP_H * 0.093,
                            borderRadius: AXIS_WARP_W * 0.1,
                            overflow: 'hidden',
                            alignItems: 'center',
                            backgroundColor:
                                activeVector === glyph.jumpKey ? '#FF902F' : 'transparent',
                        }}
                        onPress={() => setActiveVector(glyph.jumpKey)}
                    >
                        <PhotonCanvas
                            source={glyph.iconFlux}
                            style={{
                                resizeMode: 'contain',
                                height: AXIS_WARP_H * 0.037,
                                width: AXIS_WARP_H * 0.037,
                                tintColor:
                                    activeVector === glyph.jumpKey
                                        ? '#0E062F'
                                        : '#9999D1',
                            }}
                        />
                    </PulseGlyphTap>
                ))}
            </OrbitFrameHull>
        </OrbitFrameHull>
    );
};

export default OrbitsInterstellartimeSpaceOfApp;