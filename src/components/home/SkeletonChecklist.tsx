import { View } from "react-native";
import { Skeleton } from 'moti/skeleton';

export function SkeletonChecklist() {
  

  return (
    <View 
        className="w-full h-44 bg-white/60 rounded-3xl mb-4 border border-white/40 p-6"
      >
        <Skeleton 
          colorMode="light" 
          radius={16} 
          height={48} 
          width={48} 
        />
        
        <View className="mt-4 gap-2">
          <Skeleton 
            colorMode="light" 
            width={'70%'} 
            height={24} 
          />
          <Skeleton 
            colorMode="light" 
            width={'40%'} 
            height={16} 
          />
        </View>

        <View className="mt-2">
          <Skeleton 
            colorMode="light" 
            width={'100%'} 
            height={8} 
            radius="round" 
          />
        </View>
      </View>
  );
}