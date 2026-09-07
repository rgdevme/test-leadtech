import { Extension, type Editor } from "@tiptap/core"
import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view"

type WordOccurrence = {
	from: number
	to: number
	word: string
}

export type SpellcheckSuggestion = WordOccurrence & {
	anchor: {
		left: number
		top: number
	}
	suggestions: string[]
}

type EnglishSpellcheckOptions = {
	checkWords: (words: string[]) => Promise<Map<string, string[]>>
	onOpenSuggestions: (suggestion: SpellcheckSuggestion | null) => void
}

const englishSpellcheckPluginKey = new PluginKey<DecorationSet>("englishSpellcheck")
const WORD_PATTERN = /[\p{L}]+(?:['\u2019][\p{L}]+)*/gu

type SpellcheckPluginMeta =
	| { decorations: DecorationSet }
	| { ignoredWord: string }

const normalizeWord = (word: string) => word.toLocaleLowerCase("en")

const getDecorationWord = (decoration: Decoration) => {
	const specification: unknown = decoration.spec
	if (
		!specification
		|| typeof specification !== "object"
		|| !("word" in specification)
		|| typeof specification.word !== "string"
	) {
		return null
	}

	return specification.word
}

export const ignoreSpelling = (editor: Editor, word: string) => {
	editor.view.dispatch(
		editor.state.tr.setMeta(englishSpellcheckPluginKey, {
			ignoredWord: normalizeWord(word)
		} satisfies SpellcheckPluginMeta)
	)
}

const collectCompletedWords = (
	document: ProseMirrorNode,
	selectionPosition: number,
	editorHasFocus: boolean
) => {
	const occurrences: WordOccurrence[] = []

	document.descendants((node, nodePosition) => {
		if (!node.isTextblock || node.type.name === "codeBlock") {
			return true
		}

		let text = ""
		const documentPositions: number[] = []

		node.descendants((child, childPosition) => {
			if (!child.isText || !child.text) {
				if (child.isInline) {
					text += " "
					documentPositions.push(nodePosition + childPosition + 1)
				}
				return true
			}

			const isCode = child.marks.some(mark => mark.type.name === "code")
			for (const [index, character] of [...child.text].entries()) {
				text += isCode ? " " : character
				documentPositions.push(nodePosition + childPosition + index + 1)
			}
			return false
		})

		for (const match of text.matchAll(WORD_PATTERN)) {
			const matchIndex = match.index
			const word = match[0]
			const from = documentPositions[matchIndex]
			const finalCharacterPosition = documentPositions[matchIndex + word.length - 1]

			if (from === undefined || finalCharacterPosition === undefined) {
				continue
			}

			const to = finalCharacterPosition + 1
			const isWordBeingWritten =
				editorHasFocus && selectionPosition === to && text[matchIndex + word.length] === undefined

			if (!isWordBeingWritten) {
				occurrences.push({ from, to, word })
			}
		}

		return false
	})

	return occurrences
}

const createIgnoredDecoration = ({ from, to, word }: WordOccurrence) =>
	Decoration.inline(
		from,
		to,
		{
			"data-spellcheck-ignored": "true",
			spellcheck: "false"
		},
		{ word: normalizeWord(word) }
	)

const parseSuggestions = (value: string | null) => {
	if (!value) {
		return []
	}

	try {
		const suggestions: unknown = JSON.parse(value)
		return Array.isArray(suggestions)
			? suggestions.filter((suggestion): suggestion is string => typeof suggestion === "string")
			: []
	} catch {
		return []
	}
}

export const EnglishSpellcheck = Extension.create<EnglishSpellcheckOptions>({
	name: "englishSpellcheck",

	addOptions() {
		return {
			checkWords: async () => new Map(),
			onOpenSuggestions: () => undefined
		}
	},

	addProseMirrorPlugins() {
		const options = this.options
		let checkSequence = 0
		let checkTimer: ReturnType<typeof setTimeout> | null = null
		const checkedWords = new Map<string, string[] | null>()
		const ignoredWords = new Set<string>()

		const checkDocument = async (view: EditorView) => {
			const sequence = ++checkSequence
			const checkedDocument = view.state.doc
			const occurrences = collectCompletedWords(
				checkedDocument,
				view.state.selection.from,
				view.hasFocus()
			)
			const words = [...new Set(occurrences.map(({ word }) => word))]
			const uncheckedWords = words.filter(word => !checkedWords.has(word))

			try {
				if (uncheckedWords.length > 0) {
					const misspellings = await options.checkWords(uncheckedWords)
					for (const word of uncheckedWords) {
						checkedWords.set(word, misspellings.get(word) ?? null)
					}
				}
			} catch {
				return
			}

			if (sequence !== checkSequence || !view.state.doc.eq(checkedDocument)) {
				return
			}

			const decorations = occurrences.flatMap(({ from, to, word }) => {
				const normalizedWord = normalizeWord(word)
				if (ignoredWords.has(normalizedWord)) {
					return [createIgnoredDecoration({ from, to, word })]
				}

				const suggestions = checkedWords.get(word)
				if (!suggestions) {
					return []
				}

				return [
					Decoration.inline(
						from,
						to,
						{
							class: "spellcheckError",
							"data-spellcheck-error": "true",
							"data-spellcheck-from": String(from),
							"data-spellcheck-suggestions": JSON.stringify(suggestions),
							"data-spellcheck-to": String(to),
							"data-spellcheck-word": word
						},
						{ word: normalizedWord }
					)
				]
			})
			const decorationSet = DecorationSet.create(view.state.doc, decorations)
			view.dispatch(
				view.state.tr.setMeta(englishSpellcheckPluginKey, {
					decorations: decorationSet
				} satisfies SpellcheckPluginMeta)
			)
		}

		const scheduleCheck = (view: EditorView) => {
			if (checkTimer) {
				clearTimeout(checkTimer)
			}
			checkTimer = setTimeout(() => void checkDocument(view), 150)
		}

		return [
			new Plugin<DecorationSet>({
				key: englishSpellcheckPluginKey,
				props: {
					decorations: state =>
						englishSpellcheckPluginKey.getState(state) ?? DecorationSet.empty,
					handleClick: (view, _position, event) => {
						const target = event.target
						const error =
							target instanceof Element
								? target.closest<HTMLElement>("[data-spellcheck-error]")
								: null

						if (!error || !view.dom.contains(error)) {
							options.onOpenSuggestions(null)
							return false
						}

						const from = Number(error.dataset.spellcheckFrom)
						const to = Number(error.dataset.spellcheckTo)
						const word = error.dataset.spellcheckWord
						if (!Number.isInteger(from) || !Number.isInteger(to) || !word) {
							return false
						}

						const bounds = error.getBoundingClientRect()
						options.onOpenSuggestions({
							anchor: {
								left: bounds.left + bounds.width / 2,
								top: bounds.top - 8
							},
							from,
							suggestions: parseSuggestions(error.dataset.spellcheckSuggestions ?? null),
							to,
							word
						})
						return true
					},
					handleKeyDown: (_view, event) => {
						if (event.key === "Escape") {
							options.onOpenSuggestions(null)
						}
						return false
					}
				},
				state: {
					init: () => DecorationSet.empty,
					apply: (transaction, decorations) => {
						const meta = transaction.getMeta(englishSpellcheckPluginKey) as
							| SpellcheckPluginMeta
							| undefined
						if (meta && "decorations" in meta) {
							return meta.decorations
						}
						if (meta && "ignoredWord" in meta) {
							ignoredWords.add(meta.ignoredWord)
							const retainedDecorations = decorations.remove(
								decorations
									.find()
									.filter(decoration => getDecorationWord(decoration) === meta.ignoredWord)
							)
							const ignoredDecorations = collectCompletedWords(
								transaction.doc,
								transaction.selection.from,
								false
							)
								.filter(({ word }) => normalizeWord(word) === meta.ignoredWord)
								.map(createIgnoredDecoration)
							return retainedDecorations.add(transaction.doc, ignoredDecorations)
						}
						return transaction.docChanged
							? decorations.map(transaction.mapping, transaction.doc)
							: decorations
					}
				},
				view: view => {
					scheduleCheck(view)
					return {
						update: (currentView, previousState) => {
							if (!currentView.state.doc.eq(previousState.doc)) {
								scheduleCheck(currentView)
							}
						},
						destroy: () => {
							checkSequence += 1
							if (checkTimer) {
								clearTimeout(checkTimer)
							}
							options.onOpenSuggestions(null)
						}
					}
				}
			})
		]
	}
})
