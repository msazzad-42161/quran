import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useQuery, useRealm } from '@realm/react';
import { Bookmark } from '../models/Bookmark';
import { NavigationProp, Route } from '@react-navigation/native';

interface MaqamProps {
    navigation: NavigationProp<any, any>;
    route: Route<any, any>;
}

export default function Maqam({ navigation, route }: MaqamProps) {
    const realm = useRealm();
    const bookmarks = useQuery(Bookmark);

    const renderItem = ({ item }: { item: Bookmark }) => (
        <Pressable
            style={({ pressed }) => ({
                ...styles.bookmarkContent,
                borderBottomWidth: pressed ? 2 : 5,
                borderRightWidth: pressed ? 2 : 5,
                borderTopWidth: pressed ? 2 : 1,
                borderLeftWidth: pressed ? 2 : 1,
                backgroundColor: pressed ? '#e8e8e8' : '#f5f5f5',
                // transform: pressed ? [{ translateY: 2 }, { translateX: 2 }] : [],
            })}
            onPress={() => {
                console.log(`Navigating to page ${item.pageNumber}`);
                navigation.navigate('hafezi', {
                    gotoPageNumber: item.pageNumber,
                })
            }}
        >
            <Text style={styles.pageNumber}>Page: {item.pageNumber}</Text>
            <Text style={styles.details}>{item.details}</Text>
            <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
        </Pressable>
    );
    return (
        <View style={styles.container}>
            {bookmarks.length === 0 ? (
                <Text style={styles.noBookmarks}>No bookmarks yet</Text>
            ) : (
                <FlatList
                    data={bookmarks}
                    renderItem={renderItem}
                    keyExtractor={item => item._id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContainer: {
        padding: 16,
        gap: 10,
    },
    bookmarkContent: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 16,
        borderBottomWidth: 5,
        borderRightWidth: 5,
        borderColor: '#ccc',
    },
    pageNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    details: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: '#999',
    },
    deleteButton: {
        backgroundColor: '#ff4444',
        padding: 8,
        borderRadius: 4,
        marginLeft: 8,
    },
    deleteText: {
        color: '#fff',
        fontSize: 14,
    },
    noBookmarks: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
});