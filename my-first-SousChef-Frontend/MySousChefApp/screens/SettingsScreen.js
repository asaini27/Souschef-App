import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { registerUser } from '../ApiService';

function FavoritesScreen({ navigation }) {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.profileDetails}>
                    <Text style={styles.profileName}>Your Name</Text>
                    <Text style={styles.profileEmail}>Your Email</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewActivity}>View activity </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.item}>
                    <Text style={styles.itemText}>About</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer} onPress={() => navigation.navigate('Register')}>
                <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.footerText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 80,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    profileDetails: {
        marginLeft: 20,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileEmail: {
        fontSize: 16,
        color: '#666666',
    },
    viewActivity: {
        color: 'red',
        marginTop: 5,
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },
    sectionHeader: {
        fontSize: 16,
        color: '#999999',
        marginBottom: 10,
    },
    item: {
        paddingVertical: 10,
    },
    itemText: {
        fontSize: 18,
    },
    footer: {
        padding: 20,
    },
    footerItem: {
        paddingVertical: 10,
    },
    footerText: {
        fontSize: 16,
        color: 'red',
    },
});

export default FavoritesScreen;
