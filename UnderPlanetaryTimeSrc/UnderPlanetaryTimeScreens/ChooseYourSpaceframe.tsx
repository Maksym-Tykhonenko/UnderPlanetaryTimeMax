import React, { useRef, useState, useEffect, } from 'react';
import {
    Text as UnderTetxt,
    Share,
    View as Planeviewtary,
    Dimensions as TimeorbitationSize,
    TouchableOpacity as Nowunderyoucantouch,
    FlatList,
    Image as Beimgage,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Animated as RNAnimated, Easing } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as ImagePicker from 'react-native-image-picker';
import { underfontstime } from '../underfontstime';

const STICKERS = [
    require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/stickers/anotherComet.png'),
    require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/stickers/earth.png'),
    require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/stickers/fireball.png'),
    require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/stickers/planet.png'),
    require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/stickers/orbit.png'),
    require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/stickers/radioStation.png'),
    require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/stickers/rocket.png'),
    require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/stickers/Space.png'),
    require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/stickers/star.png'),
];

export default function ChooseYourSpaceframe({
    onQuizStateChange,
}: {
    onQuizStateChange?: (state: { quizStarted: boolean, quizDone: boolean }) => void
}) {
    const { width: planetwidth, height: planetHeit } = TimeorbitationSize.get('window');

    // --- State ---
    const [filter, setFilter] = useState<'SPACEFRAME' | 'SAVED'>('SPACEFRAME');
    const [photo, setPhoto] = useState<string | null>(null);
    const [stickers, setStickers] = useState<{ src: any, pos: { x: number, y: number } }[]>([]);
    const [showPicker, setShowPicker] = useState(false);
    const [saved, setSaved] = useState(false);
    const [savedItems, setSavedItems] = useState<any[]>([]);

    // --- ViewShot ref for sharing photo+stickers ---
    const viewShotRef = useRef<any>(null);
    // --- refs for saved items' ViewShots ---
    const savedViewShotRefs = useRef<{ [id: string]: any }>({});

    // --- Load photo from AsyncStorage ---
    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem('svdPlntryTime');
            if (saved) {
                const arr = JSON.parse(saved);
                if (arr.length > 0) setPhoto(arr[0]);
            }
        })();
    }, []);

    // --- Save photo to AsyncStorage ---
    const savePhoto = async (uri: string) => {
        await AsyncStorage.setItem('svdPlntryTime', JSON.stringify([uri]));
        setPhoto(uri);
    };

    // --- Pick image from gallery ---
    const pickImage = async () => {
        ImagePicker.launchImageLibrary(
            { mediaType: 'photo', quality: 1 },
            async (response) => {
                if (response.assets && response.assets.length > 0) {
                    const uri = response.assets[0].uri;
                    if (uri) {
                        await savePhoto(uri);
                        setStickers([]); // reset stickers on new photo
                    }
                }
            }
        );
    };

    // --- Add/remove sticker to photo ---
    const handleToggleSticker = (idx: number) => {
        // Унікальні позиції для кожного стікера (змінити під свій дизайн)
        const positions = [
            { x: planetwidth * 0.0, y: planetHeit * 0.0 },
            { x: planetwidth * 0.23, y: planetHeit * 0.07 },
            { x: planetwidth * 0.7, y: planetHeit * 0.01 },
            { x: planetwidth * 0.70, y: planetHeit * 0.23 },
            { x: planetwidth * 0.05, y: planetHeit * 0.21 },
            { x: planetwidth * 0.45, y: planetHeit * 0.22 },
            { x: planetwidth * 0.271, y: planetHeit * 0.17 },
            { x: planetwidth * 0.59, y: planetHeit * 0.1 },
            { x: planetwidth * 0.71, y: planetHeit * 0.16 },
        ];
        setStickers((prev) => {
            const exists = prev.find(s => s.src === STICKERS[idx]);
            if (exists) {
                // Remove sticker
                return prev.filter(s => s.src !== STICKERS[idx]);
            } else {
                // Add sticker at its unique position
                return [...prev, { src: STICKERS[idx], pos: positions[idx] }];
            }
        });
    };

    // --- Remove photo ---
    const handleRemovePhoto = async () => {
        await AsyncStorage.removeItem('svdPlntryTime');
        setPhoto(null);
        setStickers([]);
    };

    // --- Remove photo from spaceframe (just clear current, do not delete from saved) ---
    const handleClearSpaceframe = async () => {
        setPhoto(null);
        setStickers([]);
        await AsyncStorage.removeItem('svdPlntryTime');
    };

    // --- Generate unique id for saved item ---
    const generateId = () => `${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    // --- Save or unsave (toggle) current photo+stickers in saved array in AsyncStorage ---
    const handleSaveToggle = async () => {
        if (!photo) return;
        const raw = await AsyncStorage.getItem('svdPlntryTimeSaved');
        let arr = [];
        if (raw) {
            try { arr = JSON.parse(raw); } catch { }
        }
        // Find by photo+stickers
        const idx = arr.findIndex((el: any) =>
            el.photo === photo &&
            JSON.stringify(el.stickers) === JSON.stringify(stickers)
        );
        if (idx !== -1) {
            // Remove from saved
            arr.splice(idx, 1);
            setSaved(false);
        } else {
            // Add to saved
            const item = { id: generateId(), photo, stickers };
            arr.unshift(item);
            setSaved(true);
        }
        await AsyncStorage.setItem('svdPlntryTimeSaved', JSON.stringify(arr));
        // Update savedItems if in SAVED tab
        if (filter === 'SAVED') setSavedItems(arr);
    };

    // --- Delete saved item by id ---
    const handleDeleteSaved = async (id: string) => {
        const raw = await AsyncStorage.getItem('svdPlntryTimeSaved');
        let arr = [];
        if (raw) {
            try { arr = JSON.parse(raw); } catch { }
        }
        const newArr = arr.filter((el: any) => el.id !== id);
        await AsyncStorage.setItem('svdPlntryTimeSaved', JSON.stringify(newArr));
        setSavedItems(newArr);
    };

    // --- Check if current photo+stickers is already saved ---
    useEffect(() => {
        if (!photo) {
            setSaved(false);
            return;
        }
        (async () => {
            const raw = await AsyncStorage.getItem('svdPlntryTimeSaved');
            if (raw) {
                try {
                    const arr = JSON.parse(raw);
                    const found = arr.find((el: any) =>
                        el.photo === photo &&
                        JSON.stringify(el.stickers) === JSON.stringify(stickers)
                    );
                    setSaved(!!found);
                } catch {
                    setSaved(false);
                }
            } else {
                setSaved(false);
            }
        })();
    }, [photo, stickers]);

    // --- Load saved items when filter changes to SAVED ---
    useEffect(() => {
        if (filter === 'SAVED') {
            (async () => {
                const raw = await AsyncStorage.getItem('svdPlntryTimeSaved');
                if (raw) {
                    try {
                        setSavedItems(JSON.parse(raw));
                    } catch {
                        setSavedItems([]);
                    }
                } else {
                    setSavedItems([]);
                }
            })();
        }
    }, [filter]);

    // --- Share handler for saved items ---
    const handleShareSaved = (photoUri: string) => {
        Share.share({ url: photoUri });
    };

    // --- Animation for empty state ---
    const emptyAnim = useRef(new RNAnimated.Value(0)).current;

    useEffect(() => {
        if (filter === 'SAVED' && savedItems.length === 0) {
            RNAnimated.loop(
                RNAnimated.sequence([
                    RNAnimated.timing(emptyAnim, {
                        toValue: 1,
                        duration: 2500,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    RNAnimated.timing(emptyAnim, {
                        toValue: 0,
                        duration: 2500,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            emptyAnim.stopAnimation();
            emptyAnim.setValue(0);
        }
    }, [filter, savedItems.length]);

    // --- Share photo with stickers ---
    const handleSharePhotoWithStickers = async () => {
        if (!viewShotRef.current) return;
        try {
            const uri = await viewShotRef.current.capture?.();
            if (uri) {
                await Share.share({ url: uri });
            }
        } catch (e) {
            // handle error if needed
        }
    };

    // --- Share handler for saved items (with stickers) ---
    const handleShareSavedWithStickers = async (id: string) => {
        const ref = savedViewShotRefs.current[id];
        if (!ref) return;
        try {
            const uri = await ref.capture?.();
            if (uri) {
                await Share.share({ url: uri });
            }
        } catch (e) {
            // handle error if needed
        }
    };

    // --- Render when no photo ---
    const renderEmpty = () => (
        <Planeviewtary style={{
            flex: 1,
            alignItems: 'center',

        }}>
            <Planeviewtary style={{
                borderRadius: planetwidth * 0.05,
                marginBottom: planetHeit * 0.04,
                backgroundColor: '#0E062F',
                justifyContent: 'center',
                width: planetwidth * 0.91,
                height: planetwidth * 0.91,
                alignItems: 'center',
            }}>
                <Beimgage
                    source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/empty-cosmos.png')}
                    style={{
                        marginTop: planetHeit * 0.03,
                        height: planetwidth * 0.19,
                        resizeMode: 'contain',
                        width: planetwidth * 0.19,
                    }}
                />
            </Planeviewtary>
            <Nowunderyoucantouch
                onPress={pickImage}
                style={{
                    justifyContent: 'center',
                    marginTop: planetHeit * 0.01,
                    borderColor: '#5EA4E0',
                    width: planetwidth * 0.91,
                    height: planetHeit * 0.065,
                    borderRadius: planetwidth * 0.04,
                    alignItems: 'center',
                    borderWidth: planetwidth * 0.01,
                    backgroundColor: '#281B61',
                }}
            >
                <UnderTetxt style={{
                    color: '#CB579C',
                    fontFamily: underfontstime.planPopSemiBold,
                    fontSize: planetwidth * 0.045,
                }}>
                    PICK YOUR MOMENT
                </UnderTetxt>
            </Nowunderyoucantouch>
        </Planeviewtary>
    );

    // --- Render photo with stickers and controls ---
    const renderPhoto = () => (
        <Planeviewtary style={{
            flex: 1,
            alignItems: 'center',
        }}>
            {/* Photo with stickers */}
            <ViewShot
                ref={viewShotRef}
                options={{
                    format: 'jpg',
                    quality: 0.95,
                    result: 'tmpfile',
                }}
                style={{
                    backgroundColor: '#1B1147',
                    height: planetHeit * 0.33,
                    borderRadius: planetwidth * 0.05,
                    overflow: 'hidden',
                    marginBottom: planetHeit * 0.025,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: planetwidth * 0.93,
                }}
            >
                <Planeviewtary
                    style={{
                        overflow: 'hidden',
                        justifyContent: 'center',
                        borderRadius: planetwidth * 0.05,
                        backgroundColor: '#1B1147',
                        height: planetHeit * 0.33,
                        alignItems: 'center',
                        width: planetwidth * 0.93,
                    }}
                >
                    <Beimgage
                        source={{ uri: photo! }}
                        style={{
                            borderRadius: planetwidth * 0.05,
                            height: planetHeit * 0.33,
                            resizeMode: 'cover',
                            position: 'absolute',
                            width: planetwidth * 0.93,
                        }}
                    />
                    {/* Stickers on photo */}
                    {stickers.map((sticker, idx) => (
                        <Beimgage
                            key={idx}
                            source={sticker.src}
                            style={{
                                resizeMode: 'contain',
                                position: 'absolute',
                                height: planetwidth * 0.23,
                                top: sticker.pos.y,
                                width: planetwidth * 0.23,
                                left: sticker.pos.x,
                            }}
                        />
                    ))}
                </Planeviewtary>
            </ViewShot>
            {/* Controls row */}
            <Planeviewtary style={{
                alignItems: 'center',
                width: planetwidth * 0.93,
                marginBottom: planetHeit * 0.02,
                justifyContent: 'space-between',
                flexDirection: 'row',
            }}>
                <Nowunderyoucantouch
                    onPress={handleClearSpaceframe}
                    style={{
                        borderRadius: planetwidth * 0.06,
                        backgroundColor: '#FF4D4D',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Beimgage
                        source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/deletebtn.png')}
                        style={{
                            width: planetwidth * 0.17,
                            height: planetwidth * 0.17,
                            resizeMode: 'contain',
                        }}
                    />
                </Nowunderyoucantouch>
                <Planeviewtary style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    gap: planetwidth * 0.01,
                    alignItems: 'center',
                    width: planetwidth * 0.53,
                }}>
                    <Nowunderyoucantouch
                        onPress={handleSharePhotoWithStickers}
                        style={{
                            justifyContent: 'center',
                            height: planetwidth * 0.17,
                            borderRadius: planetwidth * 0.04,
                            width: planetwidth * 0.17,
                            alignItems: 'center',
                            backgroundColor: '#0E062F',
                        }}
                    >
                        <Beimgage
                            source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/share.png')}
                            style={{
                                width: planetwidth * 0.07,
                                height: planetwidth * 0.07,
                                resizeMode: 'contain',
                            }}
                        />
                    </Nowunderyoucantouch>
                    <Nowunderyoucantouch
                        onPress={handleSaveToggle}
                        style={{
                            backgroundColor: saved ? '#FF902F' : '#0E062F',
                            height: planetwidth * 0.17,
                            borderRadius: planetwidth * 0.04,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: planetwidth * 0.17,
                        }}
                    >
                        <Beimgage
                            source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/star.png')}
                            style={{
                                width: planetwidth * 0.07,
                                height: planetwidth * 0.07,
                                resizeMode: 'contain',
                            }}
                        />
                    </Nowunderyoucantouch>
                </Planeviewtary>
            </Planeviewtary>
            {/* Stickers row (horizontal scroll) */}
            <Planeviewtary style={{
                width: planetwidth * 0.93,
                marginBottom: planetHeit * 0.01,
            }}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, idx) => idx.toString()}
                    data={STICKERS}
                    horizontal
                    contentContainerStyle={{
                        paddingHorizontal: planetwidth * 0.01,
                        alignItems: 'center',
                        gap: planetwidth * 0.03,
                        justifyContent: 'flex-start',
                    }}
                    renderItem={({ item, index }) => {
                        const isActive = stickers.some(s => s.src === item);
                        return (
                            <Nowunderyoucantouch
                                onPress={() => handleToggleSticker(index)}
                                style={{
                                    opacity: isActive ? 1 : 0.6,
                                    height: planetwidth * 0.23,
                                    alignItems: 'center',
                                    borderWidth: isActive ? planetwidth * 0.01 : 0,
                                    justifyContent: 'center',
                                    backgroundColor: isActive ? '#1B1147' : 'transparent',
                                    width: planetwidth * 0.23,
                                    borderColor: isActive ? '#FF902F' : 'transparent',
                                    borderRadius: planetwidth * 0.04,
                                }}
                            >
                                <Beimgage
                                    style={{
                                        height: planetwidth * 0.18,
                                        width: planetwidth * 0.18,
                                        resizeMode: 'contain',
                                    }}
                                    source={item}
                                />
                            </Nowunderyoucantouch>
                        );
                    }}
                />
            </Planeviewtary>
        </Planeviewtary>
    );

    // --- Render saved items ---
    const renderSaved = () => (
        <Planeviewtary style={{ flex: 1, width: '100%', alignItems: 'center' }}>
            {savedItems.length === 0 ? (
                <Planeviewtary style={{ flex: 1, alignItems: 'center' }}>
                    <RNAnimated.View
                        style={{
                            transform: [
                                {
                                    translateY: emptyAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -planetHeit * 0.025],
                                    }),
                                },
                                {
                                    translateX: emptyAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, planetwidth * 0.05],
                                    }),
                                },
                                {
                                    rotate: emptyAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['-8deg', '8deg'],
                                    }),
                                },
                            ],
                        }}
                    >
                        <Beimgage
                            source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/empty-cosmos.png')}
                            style={{
                                resizeMode: 'contain',
                                marginTop: planetHeit * 0.03,
                                height: planetwidth * 0.5,
                                width: planetwidth * 0.5,
                            }}
                        />
                    </RNAnimated.View>
                    <RNAnimated.View
                        style={{
                            opacity: emptyAnim.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [1, 0.7, 1],
                            }),
                        }}
                    >
                        <UnderTetxt style={{
                            textAlign: 'center',
                            color: '#fff',
                            marginTop: planetHeit * 0.03,
                            fontSize: planetwidth * 0.045,
                            fontFamily: underfontstime.planPopSemiBold,
                        }}>
                            Decorate and save your moment with cosmic marks
                        </UnderTetxt>
                    </RNAnimated.View>
                </Planeviewtary>
            ) : (
                <FlatList
                    data={savedItems}
                    keyExtractor={(item) => item.id || item.photo}
                    contentContainerStyle={{
                        paddingBottom: planetHeit * 0.03,
                        alignItems: 'center',
                    }}
                    renderItem={({ item }) => (
                        <Planeviewtary style={{
                            overflow: 'hidden',
                            backgroundColor: '#1B1147',
                            width: planetwidth * 0.93,
                            borderRadius: planetwidth * 0.05,
                            marginBottom: planetHeit * 0.03,
                        }}>
                            <ViewShot
                                ref={ref => {
                                    if (ref) savedViewShotRefs.current[item.id] = ref;
                                }}
                                options={{
                                    format: 'jpg',
                                    quality: 0.95,
                                    result: 'tmpfile',
                                }}
                                style={{
                                    backgroundColor: '#1B1147',
                                    height: planetHeit * 0.33,
                                    justifyContent: 'center',
                                    borderRadius: planetwidth * 0.05,
                                    overflow: 'hidden',
                                    alignItems: 'center',
                                    width: planetwidth * 0.93,
                                }}
                            >
                                <Planeviewtary style={{
                                    backgroundColor: '#1B1147',
                                    height: planetHeit * 0.33,
                                    borderRadius: planetwidth * 0.05,
                                    overflow: 'hidden',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: planetwidth * 0.93,
                                }}>
                                    <Beimgage
                                        source={{ uri: item.photo }}
                                        style={{
                                            width: planetwidth * 0.93,
                                            height: planetHeit * 0.33,
                                            resizeMode: 'cover',
                                            position: 'absolute',
                                            borderRadius: planetwidth * 0.05,
                                        }}
                                    />
                                    {(item.stickers || []).map((sticker: any, idx: number) => (
                                        <Beimgage
                                            key={idx}
                                            source={sticker.src}
                                            style={{
                                                width: planetwidth * 0.23,
                                                left: sticker.pos.x,
                                                top: sticker.pos.y,
                                                height: planetwidth * 0.23,
                                                position: 'absolute',
                                                resizeMode: 'contain',
                                            }}
                                        />
                                    ))}
                                </Planeviewtary>
                            </ViewShot>
                            {/* Saved controls */}
                            <Planeviewtary style={{
                                alignItems: 'flex-end',
                                right: planetwidth * 0.02,
                                position: 'absolute',
                                flexDirection: 'column',
                                gap: planetwidth * 0.01,
                                top: planetwidth * 0.035,
                            }}>
                                <Nowunderyoucantouch
                                    onPress={() => handleDeleteSaved(item.id)}
                                    style={{
                                        borderRadius: planetwidth * 0.065,
                                        marginBottom: planetwidth * 0.03,
                                    }}
                                >
                                    <Beimgage
                                        source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/deletebtn.png')}
                                        style={{
                                            width: planetwidth * 0.13,
                                            height: planetwidth * 0.13,
                                            resizeMode: 'contain',
                                        }}
                                    />
                                </Nowunderyoucantouch>
                                <Nowunderyoucantouch
                                    onPress={() => handleShareSavedWithStickers(item.id)}
                                    style={{
                                        backgroundColor: '#0E062F',
                                        height: planetwidth * 0.13,
                                        justifyContent: 'center',
                                        borderRadius: planetwidth * 0.03,
                                        alignItems: 'center',
                                        width: planetwidth * 0.13,
                                    }}
                                >
                                    <Beimgage
                                        source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/share.png')}
                                        style={{
                                            width: planetwidth * 0.07,
                                            height: planetwidth * 0.07,
                                            resizeMode: 'contain',
                                        }}
                                    />
                                </Nowunderyoucantouch>
                            </Planeviewtary>
                        </Planeviewtary>
                    )}
                />
            )}
        </Planeviewtary>
    );

    // --- Main ---
    return (
        <Planeviewtary
            style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: planetHeit * 0.01,
            }}
        >
            {/* Title block */}
            <Planeviewtary
                style={{
                    paddingVertical: planetHeit * 0.025,
                    backgroundColor: '#0E062F',
                    marginBottom: planetHeit * 0.03,
                    borderRadius: planetwidth * 0.06,
                    alignItems: 'center',
                    width: planetwidth * 0.93,
                }}
            >
                <UnderTetxt style={{
                    fontSize: planetwidth * 0.055,
                    fontFamily: underfontstime.planPopSemiBold,
                    textAlign: 'center',
                    color: '#FF902F',
                }}>
                    Choose Your Spaceframe
                </UnderTetxt>
            </Planeviewtary>
            {/* Filter buttons */}
            <Planeviewtary
                style={{
                    width: planetwidth * 0.93,
                    justifyContent: 'space-between',
                    marginBottom: planetHeit * 0.03,
                    alignItems: 'center',
                    flexDirection: 'row',
                }}
            >
                {['SPACEFRAME', 'SAVED'].map((item, idx) => (
                    <Nowunderyoucantouch
                        key={item}
                        onPress={() => setFilter(item as any)}
                        style={{
                            height: planetHeit * 0.064,
                            borderRadius: planetwidth * 0.035,
                            paddingVertical: planetHeit * 0.018,
                            justifyContent: 'center',
                            width: planetwidth * 0.451,
                            alignItems: 'center',
                            backgroundColor: filter === item ? '#FF902F' : '#0E062F',
                        }}
                    >
                        <UnderTetxt
                            style={{
                                fontSize: planetwidth * 0.04,
                                letterSpacing: 0.5,
                                color: filter === item ? '#0E062F' : '#CB579C',
                                fontFamily: underfontstime.planPopSemiBold,
                            }}
                        >
                            {item}
                        </UnderTetxt>
                    </Nowunderyoucantouch>
                ))}
            </Planeviewtary>
            {/* Main content */}
            <Planeviewtary style={{ flex: 1, width: '100%' }}>
                {filter === 'SAVED'
                    ? renderSaved()
                    : (!photo ? renderEmpty() : renderPhoto())}
            </Planeviewtary>
        </Planeviewtary>
    );
}