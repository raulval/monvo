import React from "react";
import { View, Text, Pressable } from "react-native";
import { Check, Bell } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";

interface Props {
	title: string;
	isDone: boolean;
	hasReminder?: boolean;
	onToggle: () => void;
	onLongPress?: () => void;
	onPress?: () => void;
}

export function ItemRow({ title, isDone, hasReminder, onToggle, onLongPress, onPress }: Props) {
	return (
		<Pressable onPress={onPress} onLongPress={onLongPress} className="flex-row items-center py-4 px-1">
			<Pressable
				onPress={onToggle}
				className={`w-7 h-7 rounded-lg items-center justify-center border-2 mr-4 ${
					isDone ? "bg-purple-600 border-purple-600" : "bg-white border-gray-200"
				}`}
			>
				<AnimatePresence>
					{isDone && (
						<MotiView
							from={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.5 }}
						>
							<Check size={16} color="white" strokeWidth={3} />
						</MotiView>
					)}
				</AnimatePresence>
			</Pressable>

			<View className="flex-1 flex-row items-center justify-between">
				<Text
					className={`text-base font-medium flex-1 ${
						isDone ? "text-gray-400 line-through" : "text-gray-700"
					}`}
				>
					{title}
				</Text>

				{hasReminder && (
					<View className="ml-2 p-1.5 bg-purple-50 rounded-full">
						<Bell size={14} color="#9333ea" />
					</View>
				)}
			</View>
		</Pressable>
	);
}
