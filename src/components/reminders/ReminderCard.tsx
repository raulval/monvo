import React from "react";
import { View, Text, Pressable } from "react-native";
import {
	Clock,
	ExternalLink,
	Heart,
	CheckCircle2,
	ClipboardList,
	Check,
	CheckIcon,
	CheckLine,
	CheckSquare,
} from "lucide-react-native";
import { format } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const locales = { pt: ptBR, en: enUS, es: es };
const currentLocale = locales[i18next.language as keyof typeof locales] || enUS;

interface ReminderCardProps {
	id: string;
	title: string;
	checklistTitle: string;
	dueAt: number;
	isDone: boolean;
	onToggle: () => void;
	onPress: () => void;
	onEditTime: () => void;
}

export function ReminderCard({
	title,
	checklistTitle,
	dueAt,
	isDone,
	onToggle,
	onPress,
	onEditTime,
}: ReminderCardProps) {
	const { t } = useTranslation();
	const isOverdue = dueAt < Date.now() && !isDone;

	// Format date (e.g., Feb 20)
	const formattedDate = format(dueAt, "MMM d", { locale: currentLocale });

	return (
		<View className="bg-white rounded-2xl p-5 mb-4 shadow-xl shadow-gray-200/40 border border-gray-200">
			{/* Top Row: Status & Source */}
			<View className="flex-row justify-between items-center mb-4">
				<View className="flex-row items-center gap-2">
					<View className="bg-gray-100 px-3 py-1.5 rounded-xl">
						<Text className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
							{isOverdue ? t("screens.reminders.badges.overdue") : t("screens.reminders.badges.upcoming")}
						</Text>
					</View>
					<Text className="text-[13px] font-semibold text-gray-400">{formattedDate}</Text>
				</View>

				<View className="flex-row items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full">
					<CheckSquare size={14} color="#a855f7" fill="#a855f7" />
					<Text className="text-[11px] font-bold text-purple-600">{checklistTitle}</Text>
				</View>
			</View>

			{/* Main Content */}
			<View className="mb-6">
				<Text className="text-xl font-bold text-gray-900 mb-1 leading-tight">{title}</Text>
				<Text className="text-sm font-medium text-gray-400">
					{t("common.at")} {format(dueAt, "HH:mm")}
				</Text>
			</View>

			{/* Actions Row */}
			<View className="flex-row gap-3">
				<Pressable
					onPress={onToggle}
					className="flex-1 bg-linear-to-r from-indigo-900 to-pink-600 h-14 rounded-2xl px-2 flex-row items-center justify-center gap-2 shadow-lg shadow-purple-200/50 active:scale-95 transition-all"
				>
					<CheckCircle2 size={18} color="white" strokeWidth={2.5} />
					<Text className="text-white font-bold text-[15px]">{t("screens.reminders.actions.mark_done")}</Text>
				</Pressable>

				<Pressable
					onPress={onEditTime}
					className="w-14 h-14 rounded-2xl border border-gray-100 bg-white items-center justify-center active:bg-gray-50 active:scale-95 transition-all"
				>
					<Clock size={20} color="#9ca3af" />
				</Pressable>

				<Pressable
					onPress={onPress}
					className="w-14 h-14 rounded-2xl border border-gray-100 bg-white items-center justify-center active:bg-gray-50 active:scale-95 transition-all"
				>
					<ExternalLink size={20} color="#9ca3af" />
				</Pressable>
			</View>
		</View>
	);
}
