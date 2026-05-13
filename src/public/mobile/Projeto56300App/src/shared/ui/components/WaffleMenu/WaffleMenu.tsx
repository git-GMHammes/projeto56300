import React, { useRef, useState, useCallback } from 'react'
import { Pressable, Animated, StyleSheet, View, Text } from 'react-native'
import { useTheme } from '../../../../app/providers/ThemeProvider'
import BootstrapIcon from './BootstrapIcon'
import type { WaffleMenuProps, WaffleMenuItem } from './types'

const CLOSED_SIZE   = 70
const OPEN_SIZE     = 200
const ITEM_SIZE     = 40
const STAGGER_MS    = 50
const OPEN_MS       = 300
const TOGGLE_MS     = 200
const FOOTER_HEIGHT = 44

// Converte hex #RRGGBB para rgba(r,g,b,alpha)
const withAlpha = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// Posições absolutas da grade 3×3 (left/top em dp) quando container = 200dp.
// Calculadas como: [0.25, 0.50, 0.75] × OPEN_SIZE − ITEM_SIZE / 2
const GRID: { left: number; top: number }[] = [
  { left: 30, top: 30 }, { left: 80, top: 30 }, { left: 130, top: 30 },
  { left: 30, top: 80 }, { left: 80, top: 80 }, { left: 130, top: 80 },
  { left: 30, top: 130 }, { left: 80, top: 130 }, { left: 130, top: 130 },
]

export default function WaffleMenu({ items, onItemPress }: WaffleMenuProps) {
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<WaffleMenuItem | null>(null)

  const containerAnim = useRef(new Animated.Value(0)).current
  const toggleAnim    = useRef(new Animated.Value(0)).current
  const itemAnims     = useRef(
    Array.from({ length: 9 }, () => new Animated.Value(0))
  ).current

  const displayItems = items.slice(0, 9)
  const count = displayItems.length

  const open = useCallback(() => {
    setIsOpen(true)
    const reversed = [...itemAnims.slice(0, count)].reverse()
    Animated.parallel([
      Animated.timing(containerAnim, {
        toValue: 1, duration: OPEN_MS, useNativeDriver: false,
      }),
      Animated.timing(toggleAnim, {
        toValue: 1, duration: TOGGLE_MS, useNativeDriver: true,
      }),
      Animated.stagger(STAGGER_MS, reversed.map(anim =>
        Animated.spring(anim, {
          toValue: 1, friction: 8, tension: 80, useNativeDriver: true,
        })
      )),
    ]).start()
  }, [count, containerAnim, toggleAnim, itemAnims])

  const close = useCallback(() => {
    Animated.parallel([
      Animated.timing(toggleAnim, {
        toValue: 0, duration: TOGGLE_MS, useNativeDriver: true,
      }),
      Animated.stagger(STAGGER_MS, itemAnims.slice(0, count).map(anim =>
        Animated.spring(anim, {
          toValue: 0, friction: 8, tension: 80, useNativeDriver: true,
        })
      )),
      Animated.timing(containerAnim, {
        toValue: 0,
        duration: OPEN_MS,
        delay: count * STAGGER_MS + 300,
        useNativeDriver: false,
      }),
    ]).start(() => { setIsOpen(false); setHoveredItem(null) })
  }, [count, containerAnim, toggleAnim, itemAnims])

  const containerWidth = containerAnim.interpolate({
    inputRange: [0, 1], outputRange: [CLOSED_SIZE, OPEN_SIZE],
  })
  const containerHeight = containerAnim.interpolate({
    inputRange: [0, 1], outputRange: [CLOSED_SIZE, OPEN_SIZE + FOOTER_HEIGHT],
  })
  const containerRadius = containerAnim.interpolate({
    inputRange: [0, 1], outputRange: [10, 16],
  })
  const toggleLeft = containerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [(CLOSED_SIZE / 2) - (ITEM_SIZE / 2), (OPEN_SIZE / 2) - (ITEM_SIZE / 2)],
  })
  const toggleTop = containerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [(CLOSED_SIZE / 2) - (ITEM_SIZE / 2), (OPEN_SIZE / 2) - (ITEM_SIZE / 2)],
  })
  const toggleOpacity = toggleAnim.interpolate({
    inputRange: [0, 1], outputRange: [1, 0],
  })

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width:           containerWidth,
          height:          containerHeight,
          borderRadius:    containerRadius,
          backgroundColor: withAlpha(theme.colors.surface, 0.5),
          borderColor:     withAlpha(theme.colors.border, 0.5),
        },
      ]}
    >
      {/* Itens da grade — absolutamente posicionados */}
      {displayItems.map((item: WaffleMenuItem, index: number) => {
        const isHovered = hoveredItem?.route === item.route
        return (
          <Animated.View
            key={item.route}
            style={[
              styles.item,
              {
                left:            GRID[index].left,
                top:             GRID[index].top,
                backgroundColor: isHovered
                  ? withAlpha(theme.colors.primary, 0.35)
                  : theme.colors.divider,
                transform:       [{ scale: itemAnims[index] }],
              },
            ]}
          >
            <Pressable
              onPress={() => { close(); onItemPress(item) }}
              onPressIn={() => setHoveredItem(item)}
              onPointerEnter={() => setHoveredItem(item)}
              onPointerLeave={() => setHoveredItem(null)}
              style={({ pressed }) => [
                styles.itemPressable,
                pressed && { backgroundColor: withAlpha(theme.colors.primary, 0.5) },
              ]}
              accessibilityLabel={item.label}
              accessibilityRole="button"
            >
              <BootstrapIcon name={item.icon} size={18} color={theme.colors.text} />
            </Pressable>
          </Animated.View>
        )
      })}

      {/* Toggle — absolutamente posicionado no centro da grade 200×200 */}
      <Animated.View style={[styles.toggleWrapper, { left: toggleLeft, top: toggleTop }]}>
        <Pressable
          onPress={isOpen ? close : open}
          style={styles.toggle}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel={isOpen ? 'Fechar menu' : 'Abrir menu'}
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen }}
        >
          <Animated.View style={{ opacity: toggleOpacity }}>
            <BootstrapIcon name="grid-3x3-gap" size={24} color={theme.colors.text} />
          </Animated.View>
        </Pressable>
      </Animated.View>

      {/* Rodapé descritivo — aparece ao passar o cursor sobre um ícone */}
      {isOpen && hoveredItem && (
        <View style={[styles.footer, { backgroundColor: withAlpha(theme.colors.surface, 0.9) }]}>
          <Text style={[styles.footerLabel, { color: theme.colors.text }]} numberOfLines={1}>
            {hoveredItem.label}
          </Text>
          {hoveredItem.description ? (
            <Text style={[styles.footerDesc, { color: theme.colors.text }]} numberOfLines={1}>
              {hoveredItem.description}
            </Text>
          ) : null}
        </View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  toggle: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    position: 'absolute',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    overflow: 'hidden',
  },
  itemPressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleWrapper: {
    position: 'absolute',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    zIndex: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: FOOTER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
  footerDesc: {
    fontSize: 9,
    lineHeight: 12,
    opacity: 0.65,
  },
})
