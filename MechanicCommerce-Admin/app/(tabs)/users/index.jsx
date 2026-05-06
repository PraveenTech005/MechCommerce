import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useContext, useCallback } from 'react'
import { useFocusEffect } from 'expo-router'
import { AppContext } from '../../../context/AppContext'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'

const UsersIndex = () => {
    const { allUsers, fetchUsers, user, loading } = useContext(AppContext);
    const [openDropdownId, setOpenDropdownId] = useState(null) // Tracks which user's dropdown is open

    useFocusEffect(
        useCallback(() => {
            fetchUsers();
        }, [user])
    );

    const handleDelete = (id, email) => {
        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to delete the user ${email}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`${process.env.EXPO_PUBLIC_API_SERVER}/user/${id}`, {
                                headers: { Authorization: `Bearer ${user?.token}` }
                            });
                            fetchUsers();
                            if (openDropdownId === id) setOpenDropdownId(null);
                        } catch (error) {
                            Alert.alert("Error", "Could not delete user.");
                            console.log(error);
                        }
                    }
                }
            ]
        );
    }

    const handleChangeRole = async (id, newRole) => {
        try {
            await axios.put(`${process.env.EXPO_PUBLIC_API_SERVER}/user/role/${id}`, { role: newRole }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            fetchUsers();
        } catch (error) {
            Alert.alert("Error", "Could not update user role.");
            console.log(error);
        } finally {
            setOpenDropdownId(null);
        }
    }

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    }

    const renderUserItem = ({ item }) => (
        <View className="bg-white mx-4 mb-4 p-5 rounded-xl shadow-sm border border-gray-100 flex-col">
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 mr-2">
                    <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>{item.email}</Text>
                    <Text className="text-gray-500 text-sm mt-1 flex-row items-center">
                        <Ionicons name="calendar-outline" size={14} color="gray" /> Joined: {formatDate(item.createdAt || item.created)}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item._id, item.email)} className="p-2 bg-red-50 rounded-full">
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <View className="flex-row items-center">
                <Text className="text-gray-700 font-medium mr-3">Role:</Text>
                <View className="flex-1">
                    <TouchableOpacity
                        className={`border ${item.role === 'admin' ? 'border-purple-200 bg-purple-50' : 'border-blue-200 bg-blue-50'} rounded-lg p-2.5 flex-row justify-between items-center`}
                        onPress={() => setOpenDropdownId(openDropdownId === item._id ? null : item._id)}
                    >
                        <Text className={`font-semibold capitalize ${item.role === 'admin' ? 'text-purple-700' : 'text-blue-700'}`}>
                            {item.role}
                        </Text>
                        <Ionicons name={openDropdownId === item._id ? "chevron-up" : "chevron-down"} size={16} color={item.role === 'admin' ? '#7e22ce' : '#1d4ed8'} />
                    </TouchableOpacity>
                </View>
            </View>

            {openDropdownId === item._id && (
                <View className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                    {['admin', 'user'].map((roleType) => (
                        <TouchableOpacity
                            key={roleType}
                            className={`p-3 border-b border-gray-100 ${item.role === roleType ? 'bg-gray-50' : ''}`}
                            onPress={() => handleChangeRole(item._id, roleType)}
                        >
                            <Text className={`text-center font-bold capitalize pt-1 ${roleType === 'admin' ? 'text-purple-700' : 'text-blue-700'}`}>
                                {roleType}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    const formHeaderElement = (
        <View className="p-4 pt-6">
            <Text className="text-3xl font-bold text-gray-800 mb-2">Users Directory</Text>
            <Text className="text-gray-500 mb-6 font-medium">Manage user roles and account access.</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50 pb-12">
            {loading && !allUsers.length ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            ) : (
                <FlatList
                    data={allUsers}
                    keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
                    renderItem={renderUserItem}
                    ListHeaderComponent={formHeaderElement}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </SafeAreaView>
    )
}

export default UsersIndex