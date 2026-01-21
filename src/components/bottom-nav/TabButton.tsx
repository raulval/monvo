import React, { forwardRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { LucideIcon } from 'lucide-react-native';

interface TabButtonProps extends TabTriggerSlotProps {
  icon: LucideIcon;
  label: string;
}

export const TabButton = forwardRef<View, TabButtonProps>(
  ({ icon: Icon, label, isFocused, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...props}
        className="flex-1 items-center gap-1 py-2"
      >
        <View
          className={`p-2 rounded-2xl transition-all ${
            isFocused ? "bg-purple-600" : "bg-transparent"
          }`}
        >
          <Icon
            size={20}
            strokeWidth={isFocused ? 2.5 : 2}
            color={isFocused ? "white" : "#9ca3af"}
          />
        </View>
        <Text
          className={`text-[10px] font-bold ${
            isFocused ? "text-purple-600" : "text-gray-500"
          }`}
        >
          {label}
        </Text>
      </Pressable>
    );
  }
);