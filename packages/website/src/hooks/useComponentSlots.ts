import { Children, isValidElement } from "react"
import type { ElementType, ReactElement, ReactNode } from "react"

type AllowedSlots = Record<string, ElementType>

export const useComponentSlots = <Slots extends AllowedSlots>(
	allowedSlots: Slots,
	children: ReactNode
) =>
	(Object.entries(allowedSlots) as [keyof Slots, ElementType][]).reduce<
		Partial<Record<keyof Slots, ReactElement>>
	>((slots, [name, Slot]) => {
		const match = Children.toArray(children).find(
			child => isValidElement(child) && child.type === Slot
		)

		if (isValidElement(match)) {
			slots[name] = match
		}

		return slots
	}, {})
