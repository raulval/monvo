import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface HomeEmptyStateProps {
  onCreatePress: () => void;
}

export function HomeEmptyState({ onCreatePress }: HomeEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <View className="bg-white rounded-4xl border border-gray-100 p-8 items-center shadow-sm mb-6">
      <View className="mb-4 bg-purple-100 rounded-full p-4">
          <Sparkles size={32} color="#a855f7" />
      </View>

      <Text className="text-lg font-bold text-gray-900 mb-2 text-center">
        {t('screens.home.empty.title')}
      </Text>
      
      <Text className="text-sm text-gray-500 text-center leading-5 mb-6 px-4">
        {t('screens.home.empty.description')}
      </Text>

      <Pressable 
        onPress={onCreatePress}
        className="active:opacity-80 shadow-md rounded-xl flex-row bg-linear-to-r from-indigo-900 to-pink-600 items-center justify-center px-5 py-2"
      >
        <Text className="text-white font-bold text-sm">
          {t('screens.home.empty.button')}
        </Text>
      </Pressable>
    </View>
  );
}