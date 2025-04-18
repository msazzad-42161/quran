import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Asset } from 'expo-asset'
import AddMaqam from '../components/AddMaqam'
import { MaterialIcons } from '@expo/vector-icons';
import Pdf from 'react-native-pdf';
import { useQuery } from '@realm/react';
import { Bookmark } from '../models/Bookmark';
import { NavigationProp, Route } from '@react-navigation/native';

const TOTAL_PAGES = 614;
interface HafeziQuranProps {
    navigation: NavigationProp<any, any>;
    route: Route<any, any>;
}
const HafeziQuran = ({ navigation, route }: HafeziQuranProps) => {

    const bookmarks = useQuery(Bookmark);
    const pdfRef = useRef(null);
    const { gotoPageNumber } = route.params ?? { gotoPageNumber: 1 };

    const [isLoading, setIsLoading] = useState(true);
    const [pdfUri, setPdfUri] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(gotoPageNumber);
    const [error, setError] = useState<string | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadPdf = async () => {
            try {
                const [asset] = await Asset.loadAsync(require('../assets/main/hafezi_quran_emdadia.pdf'));

                if (isMounted) {
                    console.log('PDF URI:', asset.uri);
                    setPdfUri(asset.uri);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error loading PDF asset:", error);
                if (isMounted) {
                    setError(error instanceof Error ? error.message : 'Failed to load PDF');
                    setIsLoading(false);
                }
            }
        };

        loadPdf();

        return () => {
            isMounted = false;
            // Cleanup PDF instance
            if (pdfRef.current) {
                try {
                    // @ts-ignore
                    pdfRef.current?.unloadAsync();
                } catch (e) {
                    console.log('PDF cleanup error:', e);
                }
            }
        };
    }, []);

    useEffect(() => {
        const isPageBookmarked = bookmarks.some(bookmark => bookmark.pageNumber === currentPage);
        setIsBookmarked(isPageBookmarked);
    }, [bookmarks, currentPage]);

    if (error) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="black" />
                    <Text style={styles.loadingText}>تحميل القران ...</Text>
                </View>
            ) : (
                <Pdf
                    trustAllCerts={false}
                    source={{ uri: pdfUri?.toString(), cache: true }}
                    style={styles.pdf}
                    horizontal
                    enablePaging={true}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`Current page: ${page} from number of pages: ${numberOfPages}`);
                        setCurrentPage(page);
                    }}
                    showsHorizontalScrollIndicator={false}
                    page={gotoPageNumber}
                    ref={pdfRef}
                />
            )}

            <Pressable
                style={styles.maqamButton}
                onPress={() => setVisible(true)}
            >
                <Text>{currentPage}/614</Text>
                <Text style={styles.maqamText}>ماقآم</Text>
                <MaterialIcons name={isBookmarked ? "bookmark-added" : "bookmark-add"} size={18} color="black" />
            </Pressable>

            <AddMaqam
                pageNumber={currentPage}
                setVisible={setVisible}
                visible={visible}
            />
        </View>
    );
};

export default HafeziQuran;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
        backgroundColor: 'white',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdf: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    maqamButton: {
        alignSelf: 'flex-end',
        marginBottom: 20,
        marginRight: 20,
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    maqamText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});