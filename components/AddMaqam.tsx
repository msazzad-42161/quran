import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useRealm } from '@realm/react';
import { Bookmark } from '../models/Bookmark';

interface AddMaqamProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    pageNumber: number;
}

const AddMaqam: React.FC<AddMaqamProps> = ({ visible, setVisible, pageNumber }) => {
    const [bookmarkDetails, setBookmarkDetails] = useState<string>('');
    const realm = useRealm();

    const handleSave = () => {
        try {
            realm.write(() => {
                const newTask = new Bookmark(realm, pageNumber, bookmarkDetails);
                // return task
                return newTask;
            });
            setBookmarkDetails('');
            setVisible(false);
        } catch (error) {
            console.error('Error saving bookmark:', error);
        }
    };

    const handleCancel = () => {
        setBookmarkDetails('');
        setVisible(false);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
                setVisible(!visible);
            }}>
            <Pressable onPress={() => {
                setVisible(false);
                setBookmarkDetails('');
            }} style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.pageNumberText}>Page Number: {pageNumber}</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter bookmark details"
                        placeholderTextColor="#888"
                        multiline
                        value={bookmarkDetails}
                        onChangeText={setBookmarkDetails}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleCancel}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    pageNumberText: {
        fontSize: 18,
        color: '#000',
        marginBottom: 10,
    },
    textInput: {
        width: '100%',
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        color: '#000',
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
    },
});

export default AddMaqam;