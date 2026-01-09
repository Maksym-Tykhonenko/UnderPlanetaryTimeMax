import React, { useState, useRef } from 'react';
import {
    Share,
    SafeAreaView,
    Keyboard,
    TouchableOpacity as TimeTapOpacity,
    Text as Nuretextime,
    Dimensions as Derdimensaryme,
    FlatList,
    Animated,
    Modal,
    TextInput,
    Image as OrbImg,
    TouchableWithoutFeedback,
    Pressable,
    View as Netarviewder,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { underfontstime } from '../underfontstime';

const PLANETS = [
    require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/planetimages/pink.png'),
    require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/planetimages/red.png'),
    require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/planetimages/yellow.png'),
];

export default function PlanetarySystemMain({
    onQuizStateChange,
}: {
    onQuizStateChange?: (state: { quizStarted: boolean, quizDone: boolean }) => void
}) {
    const { width: planetwidth, height: planetHeit } = Derdimensaryme.get('window');

    // --- State ---
    const [filter, setFilter] = useState<'ALL' | 'UNTIL' | 'SINCE'>('ALL');
    const [modalVisible, setModalVisible] = useState(false);
    const [events, setEvents] = useState<any[]>([]);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventNote, setEventNote] = useState('');
    const [customImage, setCustomImage] = useState<string | null>(null);

    // --- Delete Modal State ---
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);

    // --- Detail Modal State ---
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [detailEvent, setDetailEvent] = useState<any | null>(null);

    // --- Helpers ---
    const resetModal = () => {
        setEventTitle('');
        setEventDate('');
        setEventTime('');
        setEventNote('');
        setCustomImage(null);
    };

    // --- Image Picker ---
    const pickImage = async () => {
        ImagePicker.launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
                maxWidth: 1024,
                maxHeight: 1024,
                quality: 1,
            },
            (response) => {
                if (response.didCancel) return;
                if (response.errorCode) return;
                if (response.assets && response.assets.length > 0) {
                    setCustomImage(response.assets[0].uri || null);
                }
            }
        );
    };

    // Порожній стан
    const renderEmpty = () => (
        <Netarviewder style={{
            flex: 1,
            alignItems: 'center',
        }}>
            <Netarviewder style={{
                marginBottom: planetHeit * 0.04,
            }}>
                {/* Тут SVG або зображення зірок/точок */}
                <OrbImg
                    source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/empty-cosmos.png')}
                    style={{
                        width: planetwidth * 0.59,
                        height: planetwidth * 0.59,
                        resizeMode: 'contain',
                        marginTop: planetHeit * 0.03,
                    }}
                />
            </Netarviewder>
            <Nuretextime
                style={{
                    color: '#fff',
                    fontFamily: underfontstime.planPopSemiBold,
                    fontSize: planetwidth * 0.05,
                    textAlign: 'center',
                }}
            >
                Your cosmos is waiting for its first planet
            </Nuretextime>
        </Netarviewder>
    );

    // --- Date diff helpers ---
    function getDaysDiff(eventDate: string) {
        // eventDate in format dd.mm.yyyy
        if (!eventDate || eventDate.length !== 10) return null;
        const [dd, mm, yyyy] = eventDate.split('.');
        const event = new Date(Number(yyyy), Number(mm) - 1, Number(dd), 0, 0, 0, 0);
        const now = new Date();
        // Zero out time for today
        now.setHours(0, 0, 0, 0);
        const diff = Math.floor((event.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    }

    // --- Carousel state ---
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList<any>>(null);

    // --- Carousel scroll handler ---
    const onViewRef = useRef(({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    });
    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 60 });

    // --- Carousel render ---
    const renderEvent = ({ item, index }: { item: any, index: number }) => {
        const diff = getDaysDiff(item.date);
        let label = '';
        let days = '';
        if (diff !== null) {
            if (diff > 0) {
                label = 'Days Until';
                days = `${diff} DAYS`;
            } else if (diff < 0) {
                label = 'Days Since';
                days = `${Math.abs(diff)} DAYS`;
            } else {
                label = 'Today';
                days = '0 DAYS';
            }
        } else {
            label = 'Days Until';
            days = '-- DAYS';
        }

        // Card scaling logic
        const isActive = index === activeIndex;
        const scale = isActive ? 1 : 0.7;
        const opacity = isActive ? 1 : 0.45;
        const zIndex = isActive ? 2 : 1;
        const translateY = isActive ? 0 : planetHeit * 0.06;

        return (
            <Animated.View
                style={{
                    width: planetwidth * 0.7,
                    alignSelf: 'center',
                    zIndex,
                    transform: [
                        { scale },
                        { translateY },
                    ],
                    opacity,
                    marginHorizontal: planetwidth * 0.025,
                }}
            >
                <Pressable
                    style={{
                        paddingVertical: planetHeit * 0.04,
                        width: '100%',
                        borderColor: '#4A2B7C',
                        borderRadius: planetwidth * 0.06,
                        borderWidth: 2,
                        alignItems: 'center',
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOpacity: 0.2,
                        shadowRadius: 10,
                        backgroundColor: '#0E062F',
                    }}
                    onLongPress={() => {
                        setEventToDelete(item.id);
                        setDeleteModalVisible(true);
                    }}
                    onPress={() => {
                        setDetailEvent(item);
                        setDetailModalVisible(true);
                    }}
                >
                    <OrbImg
                        source={
                            item.imageType === 'planet'
                                ? PLANETS[item.image]
                                : item.image
                                    ? { uri: item.image }
                                    : PLANETS[0]
                        }
                        style={{
                            width: isActive ? planetwidth * 0.32 : planetwidth * 0.21,
                            height: isActive ? planetwidth * 0.32 : planetwidth * 0.21,
                            borderRadius: isActive ? planetwidth * 0.16 : planetwidth * 0.105,
                            marginBottom: planetHeit * 0.025,
                        }}
                    />
                    <Nuretextime style={{
                        color: '#fff',
                        fontFamily: underfontstime.planPopSemiBold,
                        fontSize: isActive ? planetwidth * 0.06 : planetwidth * 0.045,
                        textAlign: 'center',
                    }}>
                        {item.title ? item.title : 'Untitled Event'}
                    </Nuretextime>
                    <Nuretextime style={{
                        fontFamily: underfontstime.planPopMed,
                        marginBottom: planetHeit * 0.01,
                        fontSize: isActive ? planetwidth * 0.045 : planetwidth * 0.035,
                        marginTop: planetHeit * 0.01,
                        color: '#B9A7D1',
                    }}>
                        {label}
                    </Nuretextime>
                    <Netarviewder style={{
                        marginTop: planetHeit * 0.01,
                        backgroundColor: '#25195C',
                        paddingVertical: isActive ? planetHeit * 0.012 : planetHeit * 0.008,
                        borderRadius: planetwidth * 0.03,
                        paddingHorizontal: isActive ? planetwidth * 0.09 : planetwidth * 0.06,
                    }}>
                        <Nuretextime style={{
                            color: '#CB579C',
                            fontFamily: underfontstime.planPopSemiBold,
                            fontSize: isActive ? planetwidth * 0.05 : planetwidth * 0.035,
                            textAlign: 'center',
                        }}>
                            {days}
                        </Nuretextime>
                    </Netarviewder>
                </Pressable>
            </Animated.View>
        );
    };

    // --- Date formatting and validation ---
    function formatDateInput(text: string) {
        // Only digits, max 8
        let cleaned = text.replace(/\D/g, '').slice(0, 8);
        let day = cleaned.slice(0, 2);
        let month = cleaned.slice(2, 4);
        let year = cleaned.slice(4, 8);

        let formatted = '';
        if (day) formatted += day;
        if (month) formatted += '.' + month;
        if (year) formatted += '.' + year;

        // Validate day/month/year if possible
        if (cleaned.length >= 4) {
            let d = parseInt(day, 10);
            let m = parseInt(month, 10);
            if (m > 12) month = '12';
            if (m < 1) month = '01';
            let y = year ? parseInt(year, 10) : undefined;
            let maxDay = 31;
            if (m === 2) {
                maxDay = y && ((y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)) ? 29 : 28;
            } else if ([4, 6, 9, 11].includes(m)) {
                maxDay = 30;
            }
            if (d > maxDay) day = maxDay.toString().padStart(2, '0');
            if (d < 1) day = '01';
            formatted = day;
            if (month) formatted += '.' + month;
            if (year) formatted += '.' + year;
        }
        return formatted;
    }

    function handleDateChange(text: string) {
        setEventDate(formatDateInput(text));
    }

    // --- Time formatting and validation ---
    function formatTimeInput(text: string) {
        let cleaned = text.replace(/\D/g, '').slice(0, 4);
        let hour = cleaned.slice(0, 2);
        let minute = cleaned.slice(2, 4);

        let formatted = '';
        if (hour) formatted += hour;
        if (minute) formatted += ':' + minute;

        // Validate hour/minute
        if (cleaned.length >= 2) {
            let h = parseInt(hour, 10);
            if (h > 23) hour = '23';
            if (h < 0) hour = '00';
            formatted = hour;
            if (minute) {
                let m = parseInt(minute, 10);
                if (m > 59) minute = '59';
                if (m < 0) minute = '00';
                formatted += ':' + minute;
            }
        }
        return formatted;
    }

    function handleTimeChange(text: string) {
        setEventTime(formatTimeInput(text));
    }

    // Модалка додавання події
    const renderModal = () => (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => {
                setModalVisible(false);
                resetModal();
            }}
        >
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <Netarviewder style={{
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    flex: 1,
                    alignItems: 'center',
                }}>
                    <Netarviewder style={{
                        padding: planetwidth * 0.06,
                        alignItems: 'center',
                        borderRadius: planetwidth * 0.06,
                        backgroundColor: '#0E062F',
                        width: planetwidth * 0.9,
                    }}>
                        <Nuretextime style={{
                            color: '#FF902F',
                            fontFamily: underfontstime.planPopSemiBold,
                            fontSize: planetwidth * 0.06,
                            marginBottom: planetHeit * 0.03,
                        }}>
                            Shape a New Planet
                        </Nuretextime>
                        {/* Планети */}
                        <Netarviewder style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: planetHeit * 0.025,
                        }}>
                            <OrbImg
                                source={PLANETS[0]}
                                style={{
                                    opacity: 0.7,
                                    height: planetwidth * 0.21,
                                    marginHorizontal: planetwidth * 0.01,
                                    borderRadius: planetwidth * 0.08,
                                    width: planetwidth * 0.21,
                                }}
                            />
                            <TimeTapOpacity onPress={pickImage}>
                                <OrbImg
                                    source={customImage ? { uri: customImage } : PLANETS[1]}
                                    style={{
                                        marginHorizontal: planetwidth * 0.01,
                                        height: planetwidth * 0.21,
                                        borderRadius: planetwidth * 0.095,
                                        width: planetwidth * 0.21,
                                    }}
                                />
                            </TimeTapOpacity>
                            <OrbImg
                                source={PLANETS[2]}
                                style={{
                                    borderRadius: planetwidth * 0.08,
                                    width: planetwidth * 0.21,
                                    opacity: 0.7,
                                    marginHorizontal: planetwidth * 0.01,
                                    height: planetwidth * 0.21,
                                }}
                            />
                        </Netarviewder>
                        {/* Upload */}
                        <TimeTapOpacity
                            onPress={pickImage}
                            style={{
                                paddingVertical: planetHeit * 0.012,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#25195C',
                                borderRadius: planetwidth * 0.03,
                                width: '100%',
                                paddingHorizontal: planetwidth * 0.09,
                                marginBottom: planetHeit * 0.025,
                                flexDirection: 'row',
                            }}
                        >
                            <OrbImg
                                source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/uploadIcon.png')}
                                style={{
                                    width: planetwidth * 0.05,
                                    height: planetwidth * 0.05,
                                    marginRight: planetwidth * 0.05,
                                }}
                            />
                            <Nuretextime style={{
                                color: '#CB579C',
                                fontFamily: underfontstime.planPopSemiBold,
                                fontSize: planetwidth * 0.045,
                            }}>
                                UPLOAD
                            </Nuretextime>
                        </TimeTapOpacity>
                        {/* Інпути */}
                        <Netarviewder style={{ width: '100%' }}>
                            <Nuretextime style={{
                                marginBottom: planetHeit * 0.008,
                                fontFamily: underfontstime.planPopMed,
                                fontSize: planetwidth * 0.04,
                                color: '#fff',
                            }}>Event Title</Nuretextime>
                            <TextInput
                                value={eventTitle}
                                onChangeText={setEventTitle}
                                style={{
                                    marginBottom: planetHeit * 0.018,
                                    backgroundColor: '#25195C',
                                    paddingHorizontal: planetwidth * 0.04,
                                    borderRadius: planetwidth * 0.03,
                                    width: '100%',
                                    color: '#fff',
                                    fontSize: planetwidth * 0.045,
                                    paddingVertical: planetHeit * 0.012,
                                    fontFamily: underfontstime.planPopRegul,
                                }}
                            />
                            <Nuretextime style={{
                                color: '#fff',
                                fontFamily: underfontstime.planPopMed,
                                fontSize: planetwidth * 0.04,
                                marginBottom: planetHeit * 0.008,
                            }}>Event Date</Nuretextime>
                            <TextInput
                                placeholderTextColor='#AAAAAA'
                                onChangeText={handleDateChange}
                                placeholder="dd.mm.yyyy"
                                value={eventDate}
                                keyboardType="number-pad"
                                maxLength={10}
                                style={{
                                    marginBottom: planetHeit * 0.018,
                                    width: '100%',
                                    fontSize: planetwidth * 0.045,
                                    backgroundColor: '#25195C',
                                    color: '#fff',
                                    fontFamily: underfontstime.planPopRegul,
                                    paddingVertical: planetHeit * 0.012,
                                    paddingHorizontal: planetwidth * 0.04,
                                    borderRadius: planetwidth * 0.03,
                                }}
                            />
                            <Nuretextime style={{
                                color: '#fff',
                                fontFamily: underfontstime.planPopMed,
                                fontSize: planetwidth * 0.04,
                                marginBottom: planetHeit * 0.008,
                            }}>Time</Nuretextime>
                            <TextInput
                                placeholderTextColor='#AAAAAA'
                                value={eventTime}
                                onChangeText={handleTimeChange}
                                maxLength={5}
                                keyboardType="number-pad"
                                placeholder="hh:mm"
                                style={{
                                    marginBottom: planetHeit * 0.018,
                                    backgroundColor: '#25195C',
                                    fontSize: planetwidth * 0.045,
                                    borderRadius: planetwidth * 0.03,
                                    color: '#fff',
                                    fontFamily: underfontstime.planPopRegul,
                                    paddingVertical: planetHeit * 0.012,
                                    width: '100%',
                                    paddingHorizontal: planetwidth * 0.04,
                                }}
                            />
                            <Nuretextime style={{
                                color: '#fff',
                                fontFamily: underfontstime.planPopMed,
                                fontSize: planetwidth * 0.04,
                                marginBottom: planetHeit * 0.008,
                            }}>Note</Nuretextime>
                            <TextInput
                                onChangeText={setEventNote}
                                value={eventNote}
                                style={{
                                    marginBottom: planetHeit * 0.018,
                                    width: '100%',
                                    paddingHorizontal: planetwidth * 0.04,
                                    backgroundColor: '#25195C',
                                    color: '#fff',
                                    fontFamily: underfontstime.planPopRegul,
                                    fontSize: planetwidth * 0.045,
                                    paddingVertical: planetHeit * 0.012,
                                    borderRadius: planetwidth * 0.03,
                                }}
                            />
                        </Netarviewder>
                        {/* Кнопки */}
                        <Netarviewder style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                            marginTop: planetHeit * 0.01,
                        }}>
                            <TimeTapOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    resetModal();
                                }}
                                style={{
                                    justifyContent: 'center',
                                    backgroundColor: '#25195C',
                                    alignItems: 'center',
                                    width: '48%',
                                    height: planetHeit * 0.061,
                                    borderRadius: planetwidth * 0.03,
                                }}
                            >
                                <Nuretextime style={{
                                    color: '#fff',
                                    fontFamily: underfontstime.planPopSemiBold,
                                    fontSize: planetwidth * 0.045,
                                }}>
                                    Cancel
                                </Nuretextime>
                            </TimeTapOpacity>
                            <TimeTapOpacity
                                onPress={async () => {
                                    let imageToSave = customImage;
                                    let imageType = 'uri';
                                    if (!imageToSave) {
                                        // Save the index of the random planet, not the require itself
                                        const randomIdx = Math.floor(Math.random() * PLANETS.length);
                                        imageToSave = randomIdx; // Save the index, not the require
                                        imageType = 'planet';
                                    }
                                    const newEvent = {
                                        id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
                                        title: eventTitle || 'Your Time Among the Stars',
                                        image: imageToSave,
                                        imageType, // 'uri' or 'planet'
                                        date: eventDate,
                                        time: eventTime,
                                        note: eventNote,
                                    };
                                    const updatedEvents = [newEvent, ...events];
                                    setEvents(updatedEvents);
                                    await AsyncStorage.setItem('planet_events', JSON.stringify(updatedEvents));
                                    setModalVisible(false);
                                    resetModal();
                                }}
                                style={{
                                    justifyContent: 'center',
                                    backgroundColor: '#281B61',
                                    width: '48%',
                                    borderColor: '#5EA4E0',
                                    borderRadius: planetwidth * 0.03,
                                    alignItems: 'center',
                                    height: planetHeit * 0.061,
                                    borderWidth: planetwidth * 0.01,
                                }}
                            >
                                <Nuretextime style={{
                                    color: '#CB579C',
                                    fontFamily: underfontstime.planPopSemiBold,
                                    fontSize: planetwidth * 0.045,
                                }}>
                                    SHAPE IT
                                </Nuretextime>
                            </TimeTapOpacity>
                        </Netarviewder>
                    </Netarviewder>
                </Netarviewder>
            </TouchableWithoutFeedback>
        </Modal>
    );

    // --- Delete Event Handler ---
    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;
        const updatedEvents = events.filter(ev => ev.id !== eventToDelete);
        setEvents(updatedEvents);
        await AsyncStorage.setItem('planet_events', JSON.stringify(updatedEvents));
        setDeleteModalVisible(false);
        setEventToDelete(null);
    };

    // --- Delete Modal ---
    const renderDeleteModal = () => (
        <Modal
            visible={deleteModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setDeleteModalVisible(false)}
        >
            <Netarviewder style={{
                    alignItems: 'center',
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    justifyContent: 'center',
                }}
            >
                <Netarviewder
                    style={{
                        alignItems: 'center',
                        padding: planetwidth * 0.06,
                        backgroundColor: '#fff',
                        width: planetwidth * 0.8,
                        borderWidth: 2,
                        elevation: 8,
                        shadowColor: '#000',
                        shadowOpacity: 0.18,
                        borderRadius: planetwidth * 0.045,
                        borderColor: '#CB579C',
                        shadowRadius: 10,
                    }}
                >
                    <Nuretextime
                        style={{
                            color: '#1A1A1A',
                            fontFamily: underfontstime.planPopSemiBold,
                            fontSize: planetwidth * 0.052,
                            textAlign: 'center',
                            marginBottom: planetHeit * 0.012,
                        }}
                    >
                        Delete This Event Planet?
                    </Nuretextime>
                    <Nuretextime
                        style={{
                            color: '#1A1A1A',
                            fontFamily: underfontstime.planPopRegul,
                            fontSize: planetwidth * 0.038,
                            textAlign: 'center',
                            marginBottom: planetHeit * 0.025,
                        }}
                    >
                        This planet will be removed from your system. The event date, countdown, and any attached memories will vanish from orbit
                    </Nuretextime>
                    <Netarviewder
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                            marginTop: planetHeit * 0.01,
                        }}
                    >
                        <TimeTapOpacity
                            onPress={() => setDeleteModalVisible(false)}
                            style={{
                                justifyContent: 'center',
                                flex: 1,
                                alignItems: 'center',
                                borderRadius: planetwidth * 0.025,
                                paddingVertical: planetHeit * 0.018,
                                borderWidth: 1,
                                borderColor: '#CB579C',
                                marginRight: planetwidth * 0.025,
                                backgroundColor: '#fff',
                            }}
                        >
                            <Nuretextime
                                style={{
                                    color: '#1A1A1A',
                                    fontFamily: underfontstime.planPopSemiBold,
                                    fontSize: planetwidth * 0.045,
                                }}
                            >
                                Keep It
                            </Nuretextime>
                        </TimeTapOpacity>
                        <TimeTapOpacity
                            onPress={handleDeleteEvent}
                            style={{
                                borderColor: '#CB579C',
                                alignItems: 'center',
                                marginLeft: planetwidth * 0.025,
                                justifyContent: 'center',
                                paddingVertical: planetHeit * 0.018,
                                flex: 1,
                                backgroundColor: '#fff',
                                borderWidth: 1,
                                borderRadius: planetwidth * 0.025,
                            }}
                        >
                            <Nuretextime
                                style={{
                                    color: '#FF3B3B',
                                    fontFamily: underfontstime.planPopSemiBold,
                                    fontSize: planetwidth * 0.045,
                                }}
                            >
                                Delete
                            </Nuretextime>
                        </TimeTapOpacity>
                    </Netarviewder>
                </Netarviewder>
            </Netarviewder>
        </Modal>
    );

    // --- Detail Modal ---
    const [detailTimeMode, setDetailTimeMode] = useState<'days' | 'weeks' | 'months' | 'time'>('time');
    const [detailTimer, setDetailTimer] = useState(0);

    // Update timer every second only if detailModalVisible and mode is 'time'
    React.useEffect(() => {
        if (detailModalVisible && detailTimeMode === 'time') {
            const interval = setInterval(() => {
                setDetailTimer(t => t + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [detailModalVisible, detailTimeMode]);

    function getTimeLeft(event: any) {
        if (!event?.date || event.date.length !== 10) return '--:--:--';
        const [dd, mm, yyyy] = event.date.split('.');
        const [hh = '00', min = '00'] = (event.time || '').split(':');
        const eventDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min), 0, 0);
        const now = new Date();
        let diff = eventDate.getTime() - now.getTime();
        // Always show positive value (absolute)
        diff = Math.abs(diff);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        return (
            String(days).padStart(2, '0') + ':' +
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0')
        );
    }

    function getDetailTimeValue(event: any) {
        if (!event?.date || event.date.length !== 10) return '--';
        const [dd, mm, yyyy] = event.date.split('.');
        const [hh = '00', min = '00'] = (event.time || '').split(':');
        const eventDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min), 0, 0);
        const now = new Date();
        let diff = eventDate.getTime() - now.getTime();
        // Always show positive value (no minus) for all modes
        diff = Math.abs(diff);
        if (detailTimeMode === 'days') {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            return String(days);
        }
        if (detailTimeMode === 'weeks') {
            const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
            return String(weeks);
        }
        if (detailTimeMode === 'months') {
            const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.4375));
            return String(months);
        }
        // time
        // detailTimer is used only to trigger re-render every second
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = detailTimer;
        return getTimeLeft(event);
    }

    const renderDetailModal = () => (
        <Modal
            visible={detailModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setDetailModalVisible(false)}
        >
            <Netarviewder
                style={{
                    flex: 1,
                    alignItems: 'center',
                }}
            >
                {/* Background image */}
                <OrbImg
                    source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/mainemptscr.png')}
                    style={{
                        resizeMode: 'cover',
                        width: planetwidth,
                        left: 0,
                        height: planetHeit,
                        top: 0,
                        position: 'absolute',
                    }}
                />
                <SafeAreaView />
                {/* Top buttons */}
                <Netarviewder
                    style={{
                        width: planetwidth * 0.95,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 10,
                    }}
                >
                    <TimeTapOpacity
                        onPress={() => setDetailModalVisible(false)}
                        style={{
                            alignItems: 'center',
                            height: planetwidth * 0.19,
                            justifyContent: 'center',
                            backgroundColor: '#1A0B2E',
                            borderRadius: planetwidth * 0.04,
                            width: planetwidth * 0.19,
                        }}
                    >
                        <OrbImg
                            source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/close.png')}
                            style={{
                                width: planetwidth * 0.05,
                                height: planetwidth * 0.05,
                                resizeMode: 'contain',
                            }}
                        />
                    </TimeTapOpacity>
                    <Netarviewder style={{ flexDirection: 'row' }}>
                        <TimeTapOpacity
                            onPress={() => {
                                Share.share({
                                    message: `I created an Event in Under Planetary Time!\nEvent: ${detailEvent?.title || 'Untitled Event'}\nDate: ${detailEvent?.date || 'N/A'}\nNote: ${detailEvent?.note || 'N/A'}`,
                                })
                            }}
                            style={{
                                alignItems: 'center',
                                width: planetwidth * 0.17,
                                justifyContent: 'center',
                                backgroundColor: '#1A0B2E',
                                borderRadius: planetwidth * 0.04,
                                height: planetwidth * 0.17,
                            }}
                        >
                            <OrbImg
                                source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/share.png')}
                                style={{
                                    resizeMode: 'contain',
                                    width: planetwidth * 0.06,
                                    tintColor: '#fff',
                                    height: planetwidth * 0.06,
                                }}
                            />
                        </TimeTapOpacity>
                    </Netarviewder>
                </Netarviewder>
                {/* Time mode buttons */}
                <Netarviewder
                    style={{
                        marginVertical: planetHeit * 0.025,
                        justifyContent: 'center',
                        flexDirection: 'row',
                        zIndex: 2,
                        alignItems: 'center',
                    }}
                >
                    {[
                        { mode: 'days', label: 'Days' },
                        { mode: 'weeks', label: 'Weeks' },
                        { mode: 'months', label: 'Months' },
                        { mode: 'time', label: 'Time' },
                    ].map(btn => (
                        <TimeTapOpacity
                            key={btn.mode}
                            onPress={() => setDetailTimeMode(btn.mode as any)}
                            style={{
                                marginHorizontal: planetwidth * 0.012,
                                borderRadius: planetwidth * 0.045,
                                paddingVertical: planetHeit * 0.018,
                                paddingHorizontal: planetwidth * 0.045,
                                justifyContent: 'center',
                                minWidth: planetwidth * 0.18,
                                alignItems: 'center',
                                backgroundColor: detailTimeMode === btn.mode ? '#FF902F' : '#1A0B2E',
                            }}
                        >
                            <Nuretextime
                                style={{
                                    color: detailTimeMode === btn.mode ? '#1A0B2E' : '#CB579C',
                                    fontFamily: underfontstime.planPopSemiBold,
                                    fontSize: planetwidth * 0.04,
                                    letterSpacing: 0.5,
                                }}
                            >
                                {btn.label}
                            </Nuretextime>
                        </TimeTapOpacity>
                    ))}
                </Netarviewder>
                {/* Card */}
                <Netarviewder
                    style={{
                        paddingVertical: planetHeit * 0.04,
                        zIndex: 2,
                        backgroundColor: '#1A0B2E',
                        borderWidth: 2,
                        borderColor: '#4A2B7C',
                        alignItems: 'center',
                        width: planetwidth * 0.93,
                        marginBottom: planetHeit * 0.03,
                        alignSelf: 'center',
                        borderRadius: planetwidth * 0.06,
                    }}
                >
                    <OrbImg
                        source={
                            detailEvent?.imageType === 'planet'
                                ? PLANETS[detailEvent.image]
                                : detailEvent?.image
                                    ? { uri: detailEvent.image }
                                    : PLANETS[0]
                        }
                        style={{
                            borderRadius: planetwidth * 0.16,
                            width: planetwidth * 0.32,
                            resizeMode: 'stretch',
                            marginBottom: planetHeit * 0.025,
                            height: planetwidth * 0.32,
                        }}
                    />
                    <Nuretextime style={{
                        fontSize: planetwidth * 0.06,
                        fontFamily: underfontstime.planPopSemiBold,
                        marginBottom: planetHeit * 0.01,
                        textAlign: 'center',
                        color: '#fff',
                    }}>
                        {detailEvent?.title || 'Untitled Event'}
                    </Nuretextime>
                    {detailEvent?.note && (
                        <Nuretextime style={{
                            fontFamily: underfontstime.timeSandisMed,
                            fontSize: planetwidth * 0.05,
                            marginBottom: planetHeit * 0.01,
                            textAlign: 'center',
                            color: '#fff',
                        }}>
                            {detailEvent.note}
                        </Nuretextime>
                    )}
                    <Nuretextime style={{
                        color: '#B9A7D1',
                        fontFamily: underfontstime.planPopMed,
                        fontSize: planetwidth * 0.045,
                        marginBottom: planetHeit * 0.01,
                    }}>
                        {(() => {
                            if (!detailEvent?.date) return '';
                            const diff = getDaysDiff(detailEvent.date);
                            if (diff === 0) return 'Today';
                            if (diff > 0) return 'Days Until';
                            if (diff < 0) return 'Days Since';
                            return '';
                        })()}
                    </Nuretextime>
                    <Netarviewder style={{
                        paddingVertical: planetHeit * 0.018,
                        borderRadius: planetwidth * 0.03,
                        paddingHorizontal: planetwidth * 0.09,
                        alignItems: 'center',
                        marginTop: planetHeit * 0.01,
                        width: '85%',
                        backgroundColor: '#25195C',
                        marginBottom: planetHeit * 0.03,
                    }}>
                        <Nuretextime style={{
                            color: '#CB579C',
                            fontFamily: underfontstime.planPopSemiBold,
                            fontSize: planetwidth * 0.052,
                            textAlign: 'center',
                            letterSpacing: 1,
                        }}>
                            {getDetailTimeValue(detailEvent)}
                        </Nuretextime>
                    </Netarviewder>
                </Netarviewder>
                {/* Delete button */}
                <TimeTapOpacity
                    onPress={async () => {
                        if (!detailEvent?.id) return;
                        const updatedEvents = events.filter(ev => ev.id !== detailEvent.id);
                        setEvents(updatedEvents);
                        await AsyncStorage.setItem('planet_events', JSON.stringify(updatedEvents));
                        setDetailModalVisible(false);
                        setDetailEvent(null);
                    }}
                    style={{
                        position: 'absolute',
                        bottom: planetHeit * 0.07,
                        alignSelf: 'center',
                    }}
                >
                    <OrbImg
                        source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/deletebtn.png')}
                        style={{
                            height: planetwidth * 0.17,
                            resizeMode: 'contain',
                            width: planetwidth * 0.17,
                        }}
                    />
                </TimeTapOpacity>
            </Netarviewder>
        </Modal>
    );

    // --- Load events from AsyncStorage on mount ---
    React.useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem('planet_events');
                if (stored) setEvents(JSON.parse(stored));
            } catch { }
        })();
    }, []);

    // --- Filtered events for carousel ---
    const getFilteredEvents = () => {
        if (filter === 'ALL') return events;
        if (filter === 'UNTIL') {
            return events.filter(ev => {
                const diff = getDaysDiff(ev.date);
                return diff !== null && diff > 0;
            });
        }
        if (filter === 'SINCE') {
            return events.filter(ev => {
                const diff = getDaysDiff(ev.date);
                return diff !== null && diff < 0;
            });
        }
        return events;
    };

    // --- Main ---
    return (
        <Netarviewder
            style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: planetHeit * 0.01,
            }}
        >
            {/* Title block */}
            <Netarviewder
                style={{
                    alignItems: 'center',
                    width: planetwidth * 0.93,
                    marginBottom: planetHeit * 0.03,
                    borderRadius: planetwidth * 0.06,
                    paddingVertical: planetHeit * 0.025,
                    backgroundColor: '#0E062F',
                }}
            >
                <Nuretextime style={{
                    color: '#FF902F',
                    fontFamily: underfontstime.planPopSemiBold,
                    fontSize: planetwidth * 0.055,
                    textAlign: 'center',
                }}>
                    Your Planetary System
                </Nuretextime>
            </Netarviewder>
            {/* Filter buttons (окремий блок під заголовком) */}
            <Netarviewder
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: planetHeit * 0.03,
                    width: planetwidth * 0.93,
                }}
            >
                {[
                    { label: 'ALL', text: 'ALL' },
                    { label: 'UNTIL', text: 'DAYS UNTIL' },
                    { label: 'SINCE', text: 'DAYS SINCE' },
                ].map((item, idx) => (
                    <TimeTapOpacity
                        key={item.label}
                        onPress={() => setFilter(item.label as any)}
                        style={{
                            height: planetHeit * 0.064,
                            borderRadius: planetwidth * 0.045,
                            alignItems: 'center',
                            paddingVertical: planetHeit * 0.018,
                            backgroundColor: filter === item.label ? '#FF902F' : '#0E062F',
                            justifyContent: 'center',
                            width: planetwidth * 0.3,
                        }}
                    >
                        <Nuretextime
                            style={{
                                color: filter === item.label ? '#0E062F' : '#CB579C',
                                fontFamily: underfontstime.planPopSemiBold,
                                fontSize: planetwidth * 0.04,
                                letterSpacing: 0.5,
                            }}
                        >
                            {item.text}
                        </Nuretextime>
                    </TimeTapOpacity>
                ))}
            </Netarviewder>
            {/* Events or Empty */}
            <Netarviewder style={{ flex: 1, width: '100%' }}>
                {getFilteredEvents().length === 0 ? (
                    renderEmpty()
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={getFilteredEvents()}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index }) =>
                            renderEvent({
                                item,
                                index,
                                onPress: () => {
                                    setDetailEvent(item);
                                    setDetailModalVisible(true);
                                },
                            })
                        }
                        contentContainerStyle={{
                            paddingTop: planetHeit * 0.04,
                            paddingBottom: planetHeit * 0.12,
                        }}
                        initialScrollIndex={activeIndex}
                        horizontal
                        snapToInterval={planetwidth * 0.75}
                        decelerationRate="fast"
                        showsHorizontalScrollIndicator={false}
                        style={{ flexGrow: 0 }}
                        onViewableItemsChanged={onViewRef.current}
                        snapToAlignment="center"
                        viewabilityConfig={viewConfigRef.current}
                        getItemLayout={(_, index) => ({
                            length: planetwidth * 0.75,
                            offset: planetwidth * 0.75 * index,
                            index,
                        })}
                    />
                )}
            </Netarviewder>

            <TimeTapOpacity
                onPress={() => setModalVisible(true)}
                style={{
                    position: 'absolute',
                    width: planetwidth * 0.18,
                    bottom: planetHeit * 0.17,
                    backgroundColor: '#CB579C',
                    borderRadius: planetwidth * 0.09,
                    shadowColor: '#000',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowOpacity: 0.18,
                    shadowRadius: 10,
                    borderColor: '#fff',
                    elevation: 6,
                    borderWidth: 3,
                    height: planetwidth * 0.18,
                }}
            >
                <OrbImg
                    source={require('../UnderPlanetaryTimeAssets/UnderPlanetaryTimeImages/brimgs/plusik.png')}
                    style={{
                        width: planetwidth * 0.09,
                        height: planetwidth * 0.09,
                        tintColor: '#fff',
                    }}
                />
            </TimeTapOpacity>
            {/* Modal */}
            {renderModal()}
            {renderDeleteModal()}
            {renderDetailModal()}
        </Netarviewder>
    );

    function getTimeLeft(event: any) {
        if (!event?.date || event.date.length !== 10) return '--:--:--';
        const [dd, mm, yyyy] = event.date.split('.');
        const [hh = '00', min = '00'] = (event.time || '').split(':');
        const eventDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min), 0, 0);
        const now = new Date();
        let diff = eventDate.getTime() - now.getTime();
        // Always show positive value (absolute)
        diff = Math.abs(diff);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        return (
            String(days).padStart(2, '0') + ':' +
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0')
        );
    }
}