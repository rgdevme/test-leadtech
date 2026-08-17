import "server-only"

const parseApplicationUrl = () => {
	const name = "NEXT_PUBLIC_APP_URL"
	const value = process.env[name]

	if (!value) {
		throw new Error(`${name} must be defined as an absolute HTTP or HTTPS origin.`)
	}

	try {
		const url = new URL(value)

		if (!(url.protocol === "http:" || url.protocol === "https:")) {
			throw new Error("Unsupported protocol.")
		}

		if (url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
			throw new Error("Expected an origin without a path, query, hash, or credentials.")
		}

		return url
	} catch (error) {
		throw new Error(`${name} must be a valid absolute origin.`, { cause: error })
	}
}

export const applicationUrl = parseApplicationUrl()
