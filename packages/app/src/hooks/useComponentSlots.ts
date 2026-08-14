"use client"

import { Children, isValidElement, type ComponentType, type ReactNode } from "react"

type SlotMap = Record<string, ComponentType<{ children?: ReactNode }>>

export const useComponentSlots = <Slots extends SlotMap>(
	allowedSlots: Slots,
	children: ReactNode
) => {
	const slots = Object.fromEntries(
		Object.keys(allowedSlots).map(slotName => [slotName, null])
	) as Record<keyof Slots, ReactNode>

	Children.forEach(children, child => {
		if (!isValidElement(child)) {
			return
		}

		const match = Object.entries(allowedSlots).find(([, Slot]) => child.type === Slot)
		if (match) {
			slots[match[0] as keyof Slots] = child
		}
	})

	return slots
}
