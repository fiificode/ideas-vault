import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useAuth } from "@/context/auth";

const { width, height } = Dimensions.get("window");
const isSmallDevice = height < 700;

const onboardingSteps = [
  {
    title: "Welcome to Ideas Vault",
    description:
      "Your personal space to capture and organize your brilliant ideas.",
    image: require("@/assets/images/onboarding-1.png"),
  },
  {
    title: "Organize Your Thoughts",
    description:
      "Create boards and organize your ideas into categories that make sense to you.",
    image: require("@/assets/images/onboarding-2.png"),
  },
  {
    title: "Never Lose an Idea",
    description:
      "Quickly capture your thoughts and access them whenever you need.",
    image: require("@/assets/images/onboarding-3.png"),
  },
  {
    title: "Collaborate Seamlessly", 
    description:
      "Share your ideas with team members and work together in real-time to bring your concepts to life.",
    image: require("@/assets/images/onboarding-3.png"),
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentStep + 1,
        animated: true,
      });
      setCurrentStep(currentStep + 1);
    } else {
      await completeOnboarding();
      router.replace("/auth/sign-in");
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace("/auth/sign-in");
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof onboardingSteps)[0];
    index: number;
  }) => (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.content}>
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.image}
          contentFit="contain"
          transition={200}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </Animated.View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentStep(viewableItems[0].index);
    }
  }).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={onboardingSteps}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          keyExtractor={(_, index) => index.toString()}
        />

        <View style={styles.footer}>
          <View style={styles.dots}>
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === currentStep && styles.activeDot]}
              />
            ))}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
              <Text style={styles.nextText}>
                {currentStep === onboardingSteps.length - 1
                  ? "Get Started"
                  : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    width: width,
  },
  imageContainer: {
    flex: isSmallDevice ? 0.8 : 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    maxHeight: height * 0.4,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: height * 0.04,
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02,
    color: "#1a1a1a",
  },
  description: {
    fontSize: width * 0.04,
    textAlign: "center",
    color: "#666",
    lineHeight: width * 0.06,
  },
  footer: {
    padding: width * 0.05,
    paddingBottom: height * 0.03,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.02,
  },
  dot: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.01,
    backgroundColor: "#ddd",
    marginHorizontal: width * 0.01,
  },
  activeDot: {
    backgroundColor: "#007AFF",
    width: width * 0.05,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    padding: width * 0.02,
  },
  skipText: {
    color: "#666",
    fontSize: width * 0.04,
  },
  nextButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.06,
  },
  nextText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
});
