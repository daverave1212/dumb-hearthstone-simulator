import { createMinion, getCardData, updateCardData, updateCardTransform } from "../Card/Card.mjs"
import { MINION_HEIGHT, MINION_WIDTH } from "../Card/CardGraphicsAndSizes.mjs"
import { getCardDataAsync } from "../Card/CardUtils.mjs"

export let isDraggingMinion = false

export async function setupAsync() {
    const div = document.querySelector('.draggable-minion')
    const cardData = await getCardDataAsync('Leper Gnome')
    console.log('creting leper')
    console.log({cardData})
    const placeholderCard = createMinion({}, cardData, {})
    updateCardTransform(placeholderCard, { visibility: 'hidden' })
    div.appendChild(placeholderCard)

    document.querySelector('.board').addEventListener('mousemove', evt => {
        if (isDraggingMinion == false) return
        const { pageX, pageY } = evt
        updateCardTransform(getDraggableMinion(), { x: pageX - MINION_WIDTH / 2, y: pageY - MINION_HEIGHT / 2 })
    })
}

export function startDraggingMinion(minionDiv) {
    const cardDiv = getDraggableMinion()
    updateCardTransform(cardDiv, { visibility: 'visible' })
    updateCardData(cardDiv, getCardData(minionDiv))
    isDraggingMinion = true
}
export function stopDraggingMinion() {
    isDraggingMinion = false
    updateCardTransform(getDraggableMinion(), { x: -200, y: -200, visibility: 'hidden' })
}
export function getDraggableMinion() {
    return document.querySelector('.draggable-minion .minion')
}
window.getDraggableMinion = getDraggableMinion