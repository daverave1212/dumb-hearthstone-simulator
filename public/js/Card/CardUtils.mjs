import { GET_CARD_WIDTH, GET_CARD_HEIGHT } from "./CardGraphicsAndSizes.mjs"
import { waitForConditionAsync } from "../lib/utils.mjs"
import { getCardTransform } from "./Card.mjs"

export const GET_HAND_RADIUS = () => GET_CARD_WIDTH() * 6
export const GET_HAND_TOTAL_ANGLE = () => 45

export let isDatabaseReady = false
export let CardDatabase
async function loadDatabase() {
    if (isDatabaseReady) {
        return
    }
    const databaseResponse = await fetch('/js/databases/cards.json')
    console.log({databaseResponse})
    CardDatabase = await databaseResponse.json()
    isDatabaseReady = true
}
loadDatabase()

export async function getCardDataAsync(name) {
    if (isDatabaseReady != true) {
        await waitForConditionAsync(() => isDatabaseReady)
    }
    return CardDatabase.find(card => card.name == name && card.type != 'HERO')
}

export function getHandCardPosition(nCards, atX, atY) {
    const posAndRots = []
    if (nCards >= 1 && nCards <= 3) {
        let leftStartPos = 0 - (nCards - 1) * GET_CARD_WIDTH() / 2 + atX
        for (let i = 0; i < nCards; i++) {
            let centerX = leftStartPos + GET_CARD_WIDTH() * i
            posAndRots.push({ x: centerX, y: atY, rotation: 0, zIndex: i })
        }
        return posAndRots
    }

    const originX = atX
    const originY = 0 + atY + GET_HAND_RADIUS()
    const newAngle = -GET_HAND_TOTAL_ANGLE() / (nCards + 1)
    const leftStartAngle = 0 + (nCards - 1) * newAngle / 2
    for (let i = 0; i < nCards; i++) {
        const thisAngle = leftStartAngle - i * newAngle - 90
        const thisAngleRadians = thisAngle * Math.PI / 180
        const thisX = originX + GET_HAND_RADIUS() * Math.cos(thisAngleRadians)
        const thisY = originY + GET_HAND_RADIUS() * Math.sin(thisAngleRadians)
        const zIndex = i
        posAndRots.push({ x: thisX, y: thisY, zIndex: zIndex, rotation: thisAngle + 90 })
    }
    return posAndRots
}

export function areCoordsInCard(cardDiv, { x, y }) {
    const cardRect = cardDiv.getBoundingClientRect()
    const isXInside = cardRect.left < x && x < cardRect.right
    const isYInside = cardRect.top < y && y < cardRect.bottom
    return isXInside && isYInside
}
