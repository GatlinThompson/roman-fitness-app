import {
  consumePendingLiftEdit,
  setLiftEditContext,
} from "@/lib/pendingLiftEdit";
import { font } from "@/styles/fonts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const ACTION_WIDTH = 150;
const SWIPE_THRESHOLD = 50;
const BACKGROUND_WIDTH = ACTION_WIDTH + 16;
const ITEM_MARGIN = 40;
const BG = "#161616";

type SwipeableCardProps = {
  children: React.ReactNode;
  onDelete: () => void;
  onEdit: () => void;
  canDelete: boolean;
};

function SwipeableCard({
  children,
  onDelete,
  onEdit,
  canDelete,
}: SwipeableCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);

  const close = useCallback(() => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
    isOpen.current = false;
  }, [translateX]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > 10,
      onPanResponderMove: (_, { dx }) => {
        const base = isOpen.current ? -ACTION_WIDTH : 0;
        translateX.setValue(Math.min(0, Math.max(-ACTION_WIDTH, base + dx)));
      },
      onPanResponderRelease: (_, { dx }) => {
        const base = isOpen.current ? -ACTION_WIDTH : 0;
        const current = base + dx;
        if (current < -SWIPE_THRESHOLD) {
          Animated.spring(translateX, {
            toValue: -ACTION_WIDTH,
            useNativeDriver: true,
          }).start();
          isOpen.current = true;
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          isOpen.current = false;
        }
      },
    }),
  ).current;

  return (
    <View style={swipeStyles.wrapper}>
      <View style={swipeStyles.actions}>
        <Pressable
          style={swipeStyles.editAction}
          onPress={() => {
            close();
            onEdit();
          }}
        >
          <MaterialIcons name="edit" size={24} color="black" />
        </Pressable>
        {canDelete && (
          <Pressable
            style={swipeStyles.deleteAction}
            onPress={() => {
              close();
              onDelete();
            }}
          >
            <MaterialIcons name="delete" size={24} color="white" />
          </Pressable>
        )}
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={{ transform: [{ translateX }] }}
      >
        {children}
      </Animated.View>
    </View>
  );
}

function DragHandle({
  onStart,
  onMove,
  onEnd,
}: {
  onStart: () => void;
  onMove: (dy: number) => void;
  onEnd: () => void;
}) {
  const onStartRef = useRef(onStart);
  const onMoveRef = useRef(onMove);
  const onEndRef = useRef(onEnd);

  onStartRef.current = onStart;
  onMoveRef.current = onMove;
  onEndRef.current = onEnd;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onStartRef.current(),
      onPanResponderMove: (_, { dy }) => onMoveRef.current(dy),
      onPanResponderRelease: () => onEndRef.current(),
      onPanResponderTerminate: () => onEndRef.current(),
    }),
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={styles.dragHandle}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <MaterialIcons name="drag-handle" size={24} color="#5B5757" />
    </View>
  );
}

type LiftDisplayData = {
  exercise: string;
  reps: string;
  tempo: string;
  superSet: { exercise: string; reps: string; tempo: string } | null;
};

type LiftRow = { id: string; data?: any; liftData?: LiftDisplayData };

const makeId = () => Math.random().toString(36).substring(2, 11);

function getDisplayData(lift: LiftRow): LiftDisplayData {
  if (lift.liftData) return lift.liftData;
  if (lift.data?.lift) {
    const l = lift.data.lift as any;
    return {
      exercise: l.exercise || "",
      reps: l.reps || "",
      tempo: l.tempo || "",
      superSet: l.superset || l.superSet || null,
    };
  }
  return { exercise: "", reps: "", tempo: "", superSet: null };
}

type Props = {
  initialLifts?: any[];
  onLiftsChange?: (lifts: any[]) => void;
  onRemovedLiftsChange?: (ids: number[]) => void;
};

function LiftInputGroup({
  initialLifts,
  onLiftsChange,
  onRemovedLiftsChange,
}: Props) {
  const [removedLiftIds, setRemovedLiftIds] = useState<number[]>([]);
  const [lifts, setLifts] = useState<LiftRow[]>(() => {
    if (initialLifts && initialLifts.length > 0) {
      return initialLifts.map((lift) => ({ id: lift.lift.id, data: lift }));
    }
    return [];
  });

  // Drag state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragAnim = useRef(new Animated.Value(0)).current;
  const draggingIndexRef = useRef(-1);
  const targetIndexRef = useRef(-1);
  const hasFiredHapticRef = useRef(false);
  const itemLayouts = useRef<Map<string, { y: number; height: number }>>(
    new Map(),
  );
  const shiftAnimsMap = useRef<Map<string, Animated.Value>>(new Map());
  const liftsRef = useRef(lifts);

  useEffect(() => {
    liftsRef.current = lifts;
  }, [lifts]);

  // Consume any pending lift edit when this screen regains focus
  useFocusEffect(
    useCallback(() => {
      const pending = consumePendingLiftEdit();
      if (!pending) return;

      if (pending.index === -1) {
        setLifts((prev) => [
          ...prev,
          { id: makeId(), liftData: pending.liftData },
        ]);
      } else {
        setLifts((prev) => {
          const updated = [...prev];
          if (updated[pending.index]) {
            updated[pending.index] = {
              ...updated[pending.index],
              liftData: pending.liftData,
            };
          }
          return updated;
        });
      }
    }, []),
  );

  const getShiftAnim = useCallback((id: string) => {
    if (!shiftAnimsMap.current.has(id)) {
      shiftAnimsMap.current.set(id, new Animated.Value(0));
    }
    return shiftAnimsMap.current.get(id)!;
  }, []);

  const formattedLifts = useMemo(
    () =>
      lifts.map((lift, index) => ({
        lift: getDisplayData(lift),
        sequence: index + 1,
      })),
    [lifts],
  );

  useEffect(() => {
    onLiftsChange?.(formattedLifts);
  }, [formattedLifts, onLiftsChange]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onRemovedLiftsChange?.(removedLiftIds);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [removedLiftIds, onRemovedLiftsChange]);

  const removeLift = (id: string) => {
    if (initialLifts && initialLifts.length > 0) {
      const numId = parseInt(id);
      if (!isNaN(numId)) {
        setRemovedLiftIds((prev) => [...prev, numId]);
      }
    }
    setLifts((prev) => prev.filter((l) => l.id !== id));
  };

  const addLift = () => {
    setLiftEditContext({
      index: -1,
      liftData: { exercise: "", reps: "", tempo: "", superSet: null },
    });
    router.push("/(tabs)/dashboard/edit_lift");
  };

  const navigateToEdit = (lift: LiftRow, index: number) => {
    setLiftEditContext({ index, liftData: getDisplayData(lift) });
    router.push("/(tabs)/dashboard/edit_lift");
  };

  const moveLift = useCallback((fromIndex: number, toIndex: number) => {
    setLifts((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const getTargetIndex = useCallback((fromIndex: number, dy: number) => {
    const currentLifts = liftsRef.current;
    const fromId = currentLifts[fromIndex]?.id;
    const fromLayout = fromId ? itemLayouts.current.get(fromId) : undefined;
    if (!fromLayout) return fromIndex;

    const fromCenter = fromLayout.y + fromLayout.height / 2;
    const draggedCenter = fromCenter + dy;

    let closestIndex = fromIndex;
    let closestDist = Infinity;

    currentLifts.forEach((lift, i) => {
      const layout = itemLayouts.current.get(lift.id);
      if (!layout) return;
      const center = layout.y + layout.height / 2;
      const dist = Math.abs(center - draggedCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });

    return closestIndex;
  }, []);

  const updateShifts = useCallback(
    (fromIndex: number, toIndex: number) => {
      const currentLifts = liftsRef.current;
      const fromId = currentLifts[fromIndex]?.id;
      const fromLayout = fromId ? itemLayouts.current.get(fromId) : undefined;
      const shiftAmount = (fromLayout?.height ?? 0) + ITEM_MARGIN;

      const animations = currentLifts
        .map((lift, i) => {
          if (i === fromIndex) return null;
          const shiftAnim = getShiftAnim(lift.id);

          let targetShift = 0;
          if (fromIndex < toIndex && i > fromIndex && i <= toIndex) {
            targetShift = -shiftAmount;
          } else if (fromIndex > toIndex && i >= toIndex && i < fromIndex) {
            targetShift = shiftAmount;
          }

          return Animated.spring(shiftAnim, {
            toValue: targetShift,
            useNativeDriver: true,
            speed: 20,
            bounciness: 0,
          });
        })
        .filter(Boolean) as Animated.CompositeAnimation[];

      Animated.parallel(animations).start();
    },
    [getShiftAnim],
  );

  const handleDragStart = useCallback(
    (id: string, index: number) => {
      draggingIndexRef.current = index;
      targetIndexRef.current = index;
      hasFiredHapticRef.current = false;
      dragAnim.setValue(0);
      setDraggingId(id);
    },
    [dragAnim],
  );

  const handleDragMove = useCallback(
    (dy: number) => {
      if (!hasFiredHapticRef.current && Math.abs(dy) > 5) {
        hasFiredHapticRef.current = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      dragAnim.setValue(dy);

      const newTarget = getTargetIndex(draggingIndexRef.current, dy);
      if (newTarget !== targetIndexRef.current) {
        targetIndexRef.current = newTarget;
        updateShifts(draggingIndexRef.current, newTarget);
      }
    },
    [dragAnim, getTargetIndex, updateShifts],
  );

  const handleDragEnd = useCallback(() => {
    const fromIndex = draggingIndexRef.current;
    const toIndex =
      targetIndexRef.current >= 0 ? targetIndexRef.current : fromIndex;

    const currentLifts = liftsRef.current;
    const resetAnimations = currentLifts.map((lift) =>
      Animated.spring(getShiftAnim(lift.id), {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 0,
      }),
    );
    Animated.parallel(resetAnimations).start();
    dragAnim.setValue(0);

    setDraggingId(null);
    draggingIndexRef.current = -1;
    targetIndexRef.current = -1;
    hasFiredHapticRef.current = false;

    if (fromIndex !== toIndex && fromIndex >= 0 && toIndex >= 0) {
      moveLift(fromIndex, toIndex);
    }
  }, [dragAnim, getShiftAnim, moveLift]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Lifts</Text>
        <Pressable style={styles.addButton} onPress={addLift}>
          <MaterialIcons name="add" size={24} color="#944444" />
          <Text style={styles.addButtonText}>Add Lift</Text>
        </Pressable>
      </View>
      <View>
        {/* Top fade */}
        <LinearGradient
          colors={[BG, "transparent"]}
          style={styles.fadeTop}
          pointerEvents="none"
        />

        {/* Bottom fade */}
        <LinearGradient
          colors={["transparent", BG]}
          style={styles.fadeBottom}
          pointerEvents="none"
        />
        <ScrollView
          style={styles.scrollSection}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {lifts.map((lift, index) => {
            const isDragging = draggingId === lift.id;
            const shiftAnim = getShiftAnim(lift.id);
            const data = getDisplayData(lift);

            return (
              <Animated.View
                key={lift.id}
                onLayout={(e) => {
                  itemLayouts.current.set(lift.id, {
                    y: e.nativeEvent.layout.y,
                    height: e.nativeEvent.layout.height,
                  });
                }}
                style={{
                  transform: [
                    { translateY: isDragging ? dragAnim : shiftAnim },
                  ],
                  zIndex: isDragging ? 999 : 1,
                  elevation: isDragging ? 10 : 1,
                }}
              >
                <SwipeableCard
                  onDelete={() => removeLift(lift.id)}
                  onEdit={() => navigateToEdit(lift, index)}
                  canDelete={lifts.length > 1}
                >
                  <Pressable
                    style={styles.liftOuterContainer}
                    onPress={() => navigateToEdit(lift, index)}
                  >
                    <View style={styles.liftCard}>
                      <View style={styles.liftContent}>
                        <View style={styles.liftTopRow}>
                          <DragHandle
                            onStart={() => handleDragStart(lift.id, index)}
                            onMove={handleDragMove}
                            onEnd={handleDragEnd}
                          />
                          <View>
                            <Text style={styles.exerciseName}>
                              {data.exercise || "New Lift"}
                            </Text>

                            <View style={styles.metaRow}>
                              <Text style={styles.metaText}>
                                Reps:{" "}
                                <Text style={styles.metaValue}>
                                  {data.reps ? data.reps : "-"}
                                </Text>
                              </Text>
                              <Text style={styles.metaText}>
                                Tempo:{" "}
                                <Text style={styles.metaValue}>
                                  {data.tempo ? data.tempo : "-"}
                                </Text>
                              </Text>
                            </View>
                            {data.superSet && (
                              <View style={styles.supersetSection}>
                                <Text style={styles.exerciseName}>
                                  {data.superSet.exercise ||
                                    "Superset Exercise"}
                                </Text>
                                <View style={styles.metaRow}>
                                  <Text style={styles.metaText}>
                                    Reps:{" "}
                                    <Text style={styles.metaValue}>
                                      {data.superSet.reps
                                        ? data.superSet.reps
                                        : "-"}
                                    </Text>
                                  </Text>
                                  <Text style={styles.metaText}>
                                    Tempo:{" "}
                                    <Text style={styles.metaValue}>
                                      {data.superSet.tempo
                                        ? data.superSet.tempo
                                        : "-"}
                                    </Text>
                                  </Text>
                                </View>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                </SwipeableCard>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

export default memo(LiftInputGroup);

const swipeStyles = StyleSheet.create({
  wrapper: {
    position: "relative",
    overflow: "hidden",
    marginBottom: 40,
  },
  actions: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    width: BACKGROUND_WIDTH,
    flexDirection: "row",
    gap: 12,
    flex: 1,
    paddingRight: 16,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#0F0E0E",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  editAction: {
    height: 48,
    width: 48,
    borderRadius: "100%",
    backgroundColor: "#EBEBEB",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  deleteAction: {
    height: 48,
    width: 48,
    borderRadius: "100%",
    backgroundColor: "rgba(220, 60, 60, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});

const styles = StyleSheet.create({
  liftOuterContainer: {
    paddingHorizontal: 16,
  },
  liftCard: {
    flexDirection: "row",
    borderRadius: 4,
    backgroundColor: "#262525",
    borderWidth: 1,
    borderColor: "#454444",
    paddingRight: 8,
    overflow: "hidden",
  },
  accentBar: {
    width: 4,
    backgroundColor: "#c42222",
  },
  liftContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 6,
  },
  liftTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  exerciseName: {
    color: "#fff",
    fontSize: 18,
    fontFamily: font.montserratBold.fontFamily,
    fontWeight: font.montserratBold.fontWeight,
    flex: 1,
    paddingRight: 20,
  },
  dragHandle: {
    padding: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginTop: 4,
  },
  metaText: {
    color: "#6E6B6B",
    fontSize: 13,
    fontFamily: font.montserratMedium.fontFamily,
    fontWeight: font.montserratMedium.fontWeight,
  },
  metaValue: {
    color: "#fff",
    fontSize: 14,
    fontFamily: font.montserratSemiBold.fontFamily,
    fontWeight: font.montserratSemiBold.fontWeight,
  },
  metaDot: {
    color: "#454444",
    fontSize: 13,
  },
  supersetSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    gap: 4,
  },
  supersetBadge: {
    backgroundColor: "rgba(100, 150, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(100, 150, 255, 0.5)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  supersetBadgeText: {
    color: "rgba(150, 180, 255, 1)",
    fontSize: 11,
    fontWeight: "700",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#0F0E0E",
    borderWidth: 1,
    borderColor: "#262525",
    borderRadius: 4,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: font.montserratRegular.fontFamily,
    fontWeight: font.montserratRegular.fontWeight,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#9D9D9D",
    fontSize: 24,
    fontFamily: font.montserratRegular.fontFamily,
    fontWeight: font.montserratRegular.fontWeight,
  },
  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 28,
  },
  fadeBottom: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 998,
  },
  container: {
    zIndex: 0,
    flex: 1,

    overflow: "hidden",
    marginBottom: 112,
  },
  scrollSection: {
    paddingTop: 24,
    zIndex: -2,
  },
});
