import { Heading } from "@/components/atoms/Heading"
import { Link } from "@/components/atoms/Link"
import { Text } from "@/components/atoms/Text"
import { en } from "@/data/locale/en"
import { defaultLocale } from "@/i18n/config"
import { routes } from "@/i18n/routes"
import styles from "./not-found.module.css"

export default function DocumentNotFound() {
	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<Heading
					as='h1'
					className={styles.heading}>
					{en.workspace.documents.notFoundTitle}
				</Heading>
				<Text className={styles.text}>{en.workspace.documents.notFoundDescription}</Text>
				<Link
					className={styles.link}
					href={routes.documents(defaultLocale)}>
					{en.workspace.documents.notFoundAction}
				</Link>
			</div>
		</main>
	)
}
