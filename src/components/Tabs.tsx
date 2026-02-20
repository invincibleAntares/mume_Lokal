import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useTheme } from "../theme/ThemeContext";

interface Props {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: Props) {
  const { theme } = useTheme();

  return (
    <View style={[tw`flex-row px-4 border-b`, { borderColor: theme.border }]}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onChange(tab)}
            style={tw`mr-6 pb-3`}
          >
            <Text
              style={[
                tw`text-base`,
                { color: isActive ? theme.primary : theme.subText },
                isActive && tw`font-semibold`,
              ]}
            >
              {tab}
            </Text>

            {isActive && (
              <View
                style={[
                  tw`h-0.5 mt-2 rounded-full`,
                  { backgroundColor: theme.primary },
                ]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
