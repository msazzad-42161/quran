import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native';
import { useQuery, useRealm } from '@realm/react';
import { Bookmark } from '../models/Bookmark';
import { NavigationProp, Route } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

interface MaqamProps {
    navigation: NavigationProp<any, any>;
    route: Route<any, any>;
}

export default function Maqam({ navigation, route }: MaqamProps) {
    const realm = useRealm();
    const bookmarks = useQuery<Bookmark>('Bookmark', collection => collection.sorted('createdAt', true));
    const [showActions, setShowActions] = useState<string | null>(null);

    const handleDelete = useCallback((bookmark: Bookmark) => {
        Alert.alert(
            "Delete Bookmark",
            "Are you sure you want to delete this bookmark?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        try {
                            realm.write(() => {
                                realm.delete(bookmark);
                            });
                        } catch (error) {
                            console.error('Error deleting bookmark:', error);
                        }
                        setShowActions(null);
                    }
                }
            ]
        );
    }, [realm]);

    const renderItem = useCallback(({ item }: { item: Bookmark }) => (
        <Pressable
            style={({ pressed }) => [
                styles.bookmarkWrapper,
                {
                    borderBottomWidth: pressed ? 2 : 5,
                    borderRightWidth: pressed ? 2 : 5,
                    borderTopWidth: pressed ? 2 : 1,
                    borderLeftWidth: pressed ? 2 : 1,
                    backgroundColor: pressed ? '#e8e8e8' : '#f5f5f5'
                },
                showActions === item._id.toHexString() && styles.bookmarkSelected
            ]}
            onPress={() => {
                if (showActions === item._id.toHexString()) {
                    setShowActions(null);
                } else {
                    navigation.navigate('hafezi', {
                        gotoPageNumber: item.pageNumber,
                    });
                }
            }}
            onLongPress={() => setShowActions(item._id.toHexString())}
        >
            <View style={styles.bookmarkContent}>
                <Text style={styles.pageNumber}>Page: {item.pageNumber}</Text>
                <Text style={styles.details}>{item.details}</Text>
                <Text style={styles.date}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>

            {showActions === item._id.toHexString() && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDelete(item)}
                    >
                        <MaterialIcons name="delete" size={20} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => handleDelete(item)}
                    >
                        <MaterialIcons name="edit" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>
            )}
        </Pressable>
    ), [showActions, navigation, handleDelete]);

    return (
        <View style={styles.container}>
            {bookmarks.length === 0 ? (
                <Text style={styles.noBookmarks}>No bookmarks yet</Text>
            ) : (
                <FlatList
                    data={bookmarks}
                    renderItem={renderItem}
                    keyExtractor={item => item._id.toHexString()}
                    contentContainerStyle={styles.listContainer}
                    extraData={showActions}
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
    bookmarkWrapper: {
        flex: 1,
        borderRadius: 10,
        marginBottom: 10,
        borderColor: '#ccc',
        overflow: 'hidden',
    },
    bookmarkContent: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 16
    },
    bookmarkSelected: {
        backgroundColor: '#e8e8e8',
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
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    actionButton: {
        padding: 8,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    deleteButton: {},
    editButton: {},
    noBookmarks: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
});