import { View, Text, Pressable } from "react-native";
import { Home, Bell, Clock, Settings } from "lucide-react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useUpcomingReminders } from "@/queries/checklistItem.queries";

// Mapeamento de ícones baseado no nome da rota
const ICON_MAP = {
	index: Home,
	reminders: Bell,
	history: Clock,
	settings: Settings,
};

export function BottomNav({ state, descriptors, navigation }: BottomTabBarProps) {
	const { data: reminders = [] } = useUpcomingReminders();
	const remindersCount = reminders.length;
	return (
		<View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg flex-row justify-around items-center pb-8 pt-2 px-2">
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const isFocused = state.index === index;
				const label = options.title !== undefined ? options.title : route.name;

				const Icon = ICON_MAP[route.name as keyof typeof ICON_MAP] || Home;

				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};

				return (
					<Pressable key={route.key} onPress={onPress} className="flex-1 items-center gap-1 -mb-3 mt-2">
						<View
							className={`p-2 rounded-2xl ${
								isFocused ? "bg-linear-to-r from-indigo-900 to-pink-600" : "bg-transparent"
							}`}
						>
							<Icon size={20} strokeWidth={isFocused ? 2.5 : 2} color={isFocused ? "white" : "#9ca3af"} />
							{route.name === "reminders" && remindersCount > 0 && (
								<View className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
							)}
						</View>

						<Text className={`text-[12px] font-bold mt-1 ${isFocused ? "text-pink-600" : "text-gray-500"}`}>
							{label}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
}
