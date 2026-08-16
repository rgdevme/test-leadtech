import type { PropsWithChildren } from "react"

import { Text } from "@/components/atoms"
import styles from "./index.module.css"

type ScrollIndicatorProps = PropsWithChildren<{
	href: string
	label: string
}>

export const ScrollIndicator = ({ href, label }: ScrollIndicatorProps) => (
	<a
		className={styles.indicator}
		href={href}>
		<Text
			as='span'
			size='small'
			unstyled>
			{label}
		</Text>
		<span
			aria-hidden='true'
			className={styles.rail}>
			<span className={styles.marker} />
		</span>
	</a>
)
