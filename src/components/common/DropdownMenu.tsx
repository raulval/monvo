import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { MotiView, AnimatePresence } from "moti";
import { LucideIcon } from "lucide-react-native";

interface DropdownItem {
	label: string;
	icon?: LucideIcon;
	variant?: "default" | "danger";
	onPress: () => void;
}

interface DropdownMenuProps {
	visible: boolean;
	onClose: () => void;
	items: DropdownItem[];
	anchorPosition: { x: number; y: number } | null;
}

export function DropdownMenu({ visible, onClose, items, anchorPosition }: DropdownMenuProps) {
	if (!anchorPosition) return null;

	return (
		<Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
			<View className="flex-1">
				{/* Backdrop */}
				<Pressable className="flex-1" onPress={onClose} />

				{/* Menu Container */}
				<AnimatePresence>
					{visible && (
						<MotiView
							from={{ opacity: 0, scale: 0.9, translateY: -10 }}
							animate={{ opacity: 1, scale: 1, translateY: 0 }}
							exit={{ opacity: 0, scale: 0.9, translateY: -10 }}
							transition={{ type: "timing", duration: 150 }}
							style={{
								position: "absolute",
								top: anchorPosition.y + 40, // Ajuste para descer um pouco do botão
								right: 24, // Fixado na direita com padding da tela
								zIndex: 1000,
							}}
							className="bg-white rounded-2xl shadow-2xl border border-slate-100 min-w-[180px] overflow-hidden"
						>
							{items.map((item, index) => {
								const Icon = item.icon;
								const isDanger = item.variant === "danger";

								return (
									<Pressable
										key={index}
										onPress={() => {
											item.onPress();
											onClose();
										}}
										className={`flex-row items-center px-5 py-4 active:bg-slate-50 border-b border-slate-50 last:border-b-0 gap-2`}
									>
										{Icon && <Icon size={18} color={isDanger ? "#ef4444" : "#64748b"} className="mr-3" />}
										<Text
											className={`text-base font-semibold ${isDanger ? "text-red-500" : "text-slate-700"}`}
										>
											{item.label}
										</Text>
									</Pressable>
								);
							})}
						</MotiView>
					)}
				</AnimatePresence>
			</View>
		</Modal>
	);
}
